import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyzeUrlThreat, ScanResult } from './src/utils/scannerLogic.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Simulated live global threats for the dashboard
const GLOBAL_THREAT_CATALOG = [
  { domain: 'sec-chase-online-login.net', type: 'Banking Phish', risk: 94, status: 'DANGEROUS', target: 'Chase Bank', country: 'US', origin: 'AS209403' },
  { domain: 'airdrop-claim-solana365.xyz', type: 'Crypto Drainer', risk: 98, status: 'DANGEROUS', target: 'Web3 Wallets', country: 'RU', origin: 'AS44050' },
  { domain: 'apple-id-verify-alert.cloud', type: 'Credential Harvest', risk: 89, status: 'DANGEROUS', target: 'Apple ID', country: 'NL', origin: 'AS14061' },
  { domain: 'microsoft-support-desk89.info', type: 'Tech Support Scam', risk: 85, status: 'DANGEROUS', target: 'Microsoft', country: 'IN', origin: 'AS55836' },
  { domain: 'amazon-prime-renewal-bonus.top', type: 'Subscription Fraud', risk: 78, status: 'DANGEROUS', target: 'Amazon', country: 'BR', origin: 'AS28573' },
  { domain: 'paypa1-account-security.cam', type: 'Typosquatting Homograph', risk: 96, status: 'DANGEROUS', target: 'PayPal', country: 'UA', origin: 'AS39832' },
  { domain: 'update-billing-netflix.click', type: 'Payment Stealer', risk: 91, status: 'DANGEROUS', target: 'Netflix', country: 'RO', origin: 'AS9009' },
  { domain: 'binance-auth-confirm-code.com', type: 'MFA Interception', risk: 95, status: 'DANGEROUS', target: 'Binance', country: 'DE', origin: 'AS24940' },
  { domain: 'cdn-fastly-cache-nodes.net', type: 'Verified Infrastructure', risk: 4, status: 'SAFE', target: 'None', country: 'US', origin: 'AS54113' },
  { domain: 'github-raw-usercontent.com', type: 'Developer Content', risk: 8, status: 'SAFE', target: 'None', country: 'US', origin: 'AS36459' },
  { domain: 'auth0-sso-gateway.internal-corp.co', type: 'Suspicious Subdomain', risk: 52, status: 'SUSPICIOUS', target: 'Enterprise SSO', country: 'SG', origin: 'AS13335' }
];

// POST /api/scan endpoint
app.post('/api/scan', async (req: Request, res: Response): Promise<void> => {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'A valid URL string is required.' });
    return;
  }

  try {
    const heuristicResult = analyzeUrlThreat(url);

    // If GEMINI_API_KEY is available, enrich with Gemini AI analysis
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI();
        const prompt = `You are ScamShield AI, an advanced cybersecurity analysis engine.
Analyze this target URL: "${heuristicResult.url}" (domain: "${heuristicResult.domain}").
Heuristic indicators already found:
- Brand impersonation: ${heuristicResult.telemetry.brandImpersonated || 'None'}
- Suspicious TLD: .${heuristicResult.telemetry.tld}
- Protocol: ${heuristicResult.protocol}
- Current Risk Score: ${heuristicResult.riskScore}/100

Provide a JSON object with:
1. "aiSummary": A concise, authoritative cybersecurity assessment (2-3 sentences).
2. "primaryThreatVector": Short tag (e.g., "Credential Harvesting", "Brand Impersonation Phishing", "Benign Infrastructure", "Financial Phishing").
3. "additionalSignals": Array of up to 2 specific cybersecurity insights { "title": string, "detail": string, "severity": "medium"|"high"|"critical"|"info" }
4. "actionAdvice": 1 concise practical guidance sentence.

Output strict JSON only without markdown or codeblocks.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedAi = JSON.parse(cleaned);

        if (parsedAi.aiSummary) {
          heuristicResult.summary = parsedAi.aiSummary;
        }
        if (parsedAi.additionalSignals && Array.isArray(parsedAi.additionalSignals)) {
          for (const s of parsedAi.additionalSignals) {
            heuristicResult.signals.push({
              id: `ai-${Date.now()}-${Math.random()}`,
              category: 'ai',
              severity: s.severity || 'high',
              title: s.title || 'AI Threat Correlation',
              detail: s.detail || ''
            });
          }
        }
        if (parsedAi.actionAdvice) {
          heuristicResult.recommendations.unshift(parsedAi.actionAdvice);
        }
        heuristicResult.engine = 'ai-gemini';
      } catch (aiErr) {
        // Fallback gracefully to high-performance heuristic analyzer
        console.warn('Gemini AI enrichment skipped or unavailable, using deterministic heuristics:', aiErr);
      }
    }

    res.json(heuristicResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Threat scan failed.' });
  }
});

// GET /api/threat-stream
app.get('/api/threat-stream', (_req: Request, res: Response) => {
  res.json({
    timestamp: new Date().toISOString(),
    catalog: GLOBAL_THREAT_CATALOG,
    stats: {
      totalScanned: 1482920,
      threatsDetected: 142308,
      safeWebsites: 1340612,
      riskDistribution: {
        safePercent: 90.4,
        suspiciousPercent: 6.8,
        dangerousPercent: 2.8
      }
    }
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScamShield AI cybersecurity server active on port ${PORT}`);
  });
}

startServer();
