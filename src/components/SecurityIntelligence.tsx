import React, { useState } from 'react';
import { 
  ShieldAlert, Eye, Globe2, Link2, Sparkles, CheckCircle2, 
  AlertTriangle, Lock, ShieldCheck, Terminal
} from 'lucide-react';

export const SecurityIntelligence: React.FC = () => {
  const [selectedVector, setSelectedVector] = useState(0);

  const vectors = [
    {
      id: 'phishing',
      title: 'Phishing Detection',
      icon: ShieldAlert,
      badge: 'CREDENTIAL_DEFENSE',
      description: 'Identifies fraudulent login pages that impersonate financial institutions, cloud services, and social media platforms.',
      indicators: [
        'Fake SSO OAuth consent dialogs',
        'Suspicious credential harvesting input fields',
        'Unauthorized brand trademark and logo cloning',
        'Obfuscated JavaScript keyloggers in payload'
      ],
      examplePayload: 'https://security-verify-bankofamerica.com/login.php',
      verdict: 'BLOCKED: Unauthorized financial credential siphon',
    },
    {
      id: 'look-alike',
      title: 'Look-Alike Domain Detection',
      icon: Eye,
      badge: 'HOMOGLYPH_GUARD',
      description: 'Scans for subtle visual substitutions (homoglyphs), punycode (`xn--`), and typosquatting intended to fool human eyes.',
      indicators: [
        'Cyrillic and Greek unicode glyph swaps (e.g. "а" vs "a")',
        'Number-for-letter replacements (e.g. "paypa1.com" or "g00gle.com")',
        'Character duplication (e.g. "arnazon.com" or "app-1e.com")',
        'Misleading top-level domain combinations'
      ],
      examplePayload: 'https://xn--appl-43d.com/support (IDN Spoofing)',
      verdict: 'BLOCKED: Punycode homograph targeting Apple ID',
    },
    {
      id: 'suspicious-url',
      title: 'Suspicious URL Identification',
      icon: Link2,
      badge: 'SYNTAX_ANALYTICS',
      description: 'Deconstructs anomalous URL anatomy including excessive subdomains, non-standard port listeners, and deceptive open redirects.',
      indicators: [
        'Four or more nested subdomain tiers to evade domain reputation',
        'Open redirect query parameters forwarding to untrusted endpoints',
        'Obfuscated IP literals and hex/octal encoded hosts',
        'Dangerous disposable top-level domains (.zip, .top, .buzz)'
      ],
      examplePayload: 'https://account.update.verify.paypal.com.evilexample.xyz:8080/token',
      verdict: 'BLOCKED: Multilevel subdomain evasion with disposable TLD',
    },
    {
      id: 'domain-risk',
      title: 'Domain Risk Analysis',
      icon: Globe2,
      badge: 'WHOIS_TELEMETRY',
      description: 'Evaluates infrastructural age, authoritative DNS configuration, registrar trustworthiness, and hosting ASN incident history.',
      indicators: [
        'Newly registered domain (&lt; 48 hours lifespan)',
        'Absence of SPF, DKIM, or DNSSEC cryptographic enforcement',
        'Anonymous bulletproof hosting infrastructure flags',
        'Rapid DNS change (Fast-Flux botnet network routing)'
      ],
      examplePayload: 'https://fastflux-payment-gateway-29402.online/',
      verdict: 'BLOCKED: Autonomous system with 98% malicious density',
    },
    {
      id: 'recommendations',
      title: 'Security Recommendations',
      icon: Sparkles,
      badge: 'ACTIVE_DEFENSE',
      description: 'Provides proactive tactical guidance and automated remediation directives tailored to the specific threat severity.',
      indicators: [
        'Immediate browser tab isolation and token invalidation guidelines',
        'Multi-factor authentication (MFA) hygiene alerts',
        'Corporate incident response reporting hooks',
        'Safe authentic alternative URL resolution'
      ],
      examplePayload: 'DIRECTIVE: Revoke session cookies and report to abuse@domain',
      verdict: 'RECOMMENDATION: Verified authoritative official website link provided',
    },
  ];

  const current = vectors[selectedVector];
  const Icon = current.icon;

  return (
    <section id="intelligence" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-950/30">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
          <span>THREAT SPECTRUM</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Next-Generation Security Intelligence
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Autonomous neural pattern recognition and multi-factor heuristics trained to detect zero-day digital deception.
        </p>
      </div>

      {/* Vector Selector Pills */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {vectors.map((vec, idx) => {
          const VIcon = vec.icon;
          const isSelected = selectedVector === idx;
          return (
            <button
              key={vec.id}
              onClick={() => setSelectedVector(idx)}
              aria-label={`Select intelligence module ${vec.title}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-[#060a14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <VIcon className="w-3.5 h-3.5" />
              <span>{vec.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Vector Deep-Dive Card */}
      <div className="rounded-3xl bg-[#060a14] border border-cyan-900/40 p-6 sm:p-10 shadow-2xl max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 tracking-wider px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                  {current.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  {current.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {current.description}
            </p>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                Key Behavioral Indicators Checked:
              </h4>
              <ul className="space-y-2.5">
                {current.indicators.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span dangerouslySetInnerHTML={{ __html: ind }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Live Simulation Box */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl bg-[#04060d] border border-slate-800 p-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  ANALYSIS_SANDBOX
                </span>
                <span className="text-emerald-400">ISOLATED</span>
              </div>

              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                Simulated Attack Payload:
              </div>
              <div className="p-3 rounded-lg bg-[#090e1c] border border-slate-800 text-rose-300 break-all text-[11px] mb-4">
                {current.examplePayload}
              </div>

              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                ScamShield Verdict:
              </div>
              <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-200 text-xs font-bold leading-normal">
                {current.verdict}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#080d1a] border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <span>
                Zero execution sandbox ensures zero malicious scripts touch your device during inspection.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
