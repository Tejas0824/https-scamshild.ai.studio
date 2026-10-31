import React, { useState } from 'react';
import { Search, ShieldAlert, ArrowRight, CornerDownLeft, Sparkles, CheckCircle2, AlertTriangle, ShieldX } from 'lucide-react';
import { CyberShield3D } from './CyberShield3D';
import ParticleDrift from './ParticleDrift';
import { ScanResult, ThreatStatus } from '../utils/scannerLogic';
import { cyberAudio } from '../utils/cyberAudio';

interface HeroScannerProps {
  onScan: (url: string) => Promise<void>;
  isScanning: boolean;
  activeScanStage: number;
  lastResult: ScanResult | null;
}

export const SCAN_STAGES = [
  'Resolving DNS & Host Topology...',
  'Inspecting SSL/TLS Cipher Suite & Certificate Chain...',
  'Executing Typosquatting & Homoglyph Anomaly Engine...',
  'Evaluating Domain Age, Entropy & Registrar Telemetry...',
  'Running Neural Pattern & Exploit Vector Cross-Check...',
  'Finalizing Cryptographic Threat Assessment...',
];

const SAMPLE_URLS = [
  { label: 'Google (Authentic)', url: 'https://google.com', expected: 'SAFE' },
  { label: 'PayPal Clone (Phish)', url: 'http://paypa1-security-update-login.xyz/verify', expected: 'DANGEROUS' },
  { label: 'Crypto Drainer (Scam)', url: 'https://airdrop-claim-solana365.xyz/connect', expected: 'DANGEROUS' },
  { label: 'Suspicious Subdomain', url: 'https://auth-portal.service-update-account.com', expected: 'SUSPICIOUS' },
];

export const HeroScanner: React.FC<HeroScannerProps> = ({
  onScan,
  isScanning,
  activeScanStage,
  lastResult,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!inputUrl.trim()) {
      setValidationError('Please enter a website URL or domain name.');
      return;
    }
    cyberAudio.playScanStart();
    onScan(inputUrl.trim());
  };

  const handleSelectSample = (sampleUrl: string) => {
    setInputUrl(sampleUrl);
    setValidationError(null);
    cyberAudio.playScanStart();
    onScan(sampleUrl);
  };

  const currentThreatLevel: ThreatStatus | 'SCANNING' | 'IDLE' = isScanning
    ? 'SCANNING'
    : lastResult
    ? lastResult.status
    : 'IDLE';

  return (
    <section id="scanner" className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-16 overflow-hidden cyber-grid">
      {/* Interactive WebGL Neural Particle Mesh (Particle Drift) */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-75">
        <ParticleDrift
          background="transparent"
          baseColor="#0369a1"
          accentColor="#00f0ff"
          density={140}
          dotSize={4.5}
          speed={32}
          linkDistance={150}
          linkThickness={1.2}
          hover={180}
        />
      </div>

      {/* Radial ambient cyber glow behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCAMSHIELD 3.0 // NEURAL THREAT DETECTION</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>PARTICLE_DRIFT // ACTIVE</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0c1220] border border-slate-800 text-xs font-mono text-slate-400">
            <span>ZERO PRIVACY LOGGING</span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            THE INTERNET ISN'T ALWAYS <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-200 to-cyan-400">
              WHAT IT SEEMS.
            </span>
          </h1>

          <div className="text-xl sm:text-2xl font-bold tracking-wide text-cyan-400 mb-4 font-mono">
            SCAN BEFORE YOU TRUST.
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AI-powered intelligence that detects suspicious websites, phishing attempts,
            and digital threats before they reach you.
          </p>
        </div>

        {/* Grid: 3D Shield Model + Interactive Scanner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Column: 3D Cybersecurity Shield */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[420px] rounded-2xl bg-[#060a14]/80 border border-cyan-900/40 p-2 shadow-2xl">
              {/* Radar sweep ring decoration */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/10 pointer-events-none" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/10 pointer-events-none" />

              {/* Three.js 3D Cyber Shield */}
              <CyberShield3D threatLevel={currentThreatLevel} isScanning={isScanning} />

              {/* Threat Status Pill below shield */}
              <div className="flex items-center justify-between px-4 py-2 mt-2 bg-[#080e1c] rounded-lg border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">SHIELD TELEMETRY:</span>
                <span className={`font-semibold ${
                  currentThreatLevel === 'SAFE' ? 'text-emerald-400' :
                  currentThreatLevel === 'SUSPICIOUS' ? 'text-amber-400' :
                  currentThreatLevel === 'DANGEROUS' ? 'text-rose-400' :
                  currentThreatLevel === 'SCANNING' ? 'text-cyan-400' : 'text-slate-300'
                }`}>
                  {currentThreatLevel === 'SCANNING' ? 'ANALYSIS_IN_PROGRESS' : currentThreatLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Scan Form & Live Telemetry Console */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-1 lg:order-2">
            {/* Input Card with Glowing Cyan Border */}
            <div className="bg-[#070c18] rounded-2xl border border-cyan-500/25 p-5 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.12)]">
              <div className="flex items-center justify-between mb-4">
                <label htmlFor="url-input" className="text-xs font-mono uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Search className="w-3.5 h-3.5" />
                  Target URL / Domain Inspector
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  HTTP / HTTPS / Subdomains / IP
                </span>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    id="url-input"
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="e.g. paypal-security-update.net or amazon.com"
                    disabled={isScanning}
                    className="w-full h-12 sm:h-14 px-4 bg-[#0a1020] border border-cyan-900/60 rounded-xl text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => setInputUrl('')}
                      aria-label="Clear input URL"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-[#070b14]"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isScanning}
                  aria-label="Scan Website"
                  className="h-12 sm:h-14 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isScanning ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>SCANNING...</span>
                    </div>
                  ) : (
                    <>
                      <span>SCAN WEBSITE</span>
                      <CornerDownLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Validation error display */}
              {validationError && (
                <div className="mt-3 text-xs font-mono text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Live Scanning Progress Overlay */}
              {isScanning && (
                <div className="mt-5 p-4 rounded-xl bg-[#091122] border border-cyan-500/30 font-mono text-xs">
                  <div className="flex items-center justify-between text-cyan-400 mb-2">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>REAL-TIME ANALYSIS ENGINE</span>
                    </span>
                    <span className="text-slate-400">
                      STAGE {activeScanStage + 1} / {SCAN_STAGES.length}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-full transition-all duration-300"
                      style={{
                        width: `${((activeScanStage + 1) / SCAN_STAGES.length) * 100}%`,
                      }}
                    />
                  </div>

                  {/* Active Step Text */}
                  <div className="text-slate-200 text-xs flex items-center gap-2 py-1">
                    <span className="text-cyan-400">›</span>
                    <span>{SCAN_STAGES[activeScanStage]}</span>
                  </div>
                </div>
              )}

              {/* Sample Target Testing Chips */}
              <div className="mt-6 pt-5 border-t border-slate-800/80">
                <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                  <span>TEST WITH VERIFIED EXAMPLES:</span>
                  <span className="text-[10px] text-cyan-400 font-mono">1-CLICK SCAN</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_URLS.map((sample) => (
                    <button
                      key={sample.label}
                      type="button"
                      onClick={() => handleSelectSample(sample.url)}
                      disabled={isScanning}
                      aria-label={`Test URL ${sample.label}`}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0b1324] hover:bg-[#0f1d38] border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-all text-left"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          sample.expected === 'SAFE'
                            ? 'bg-emerald-400'
                            : sample.expected === 'SUSPICIOUS'
                            ? 'bg-amber-400'
                            : 'bg-rose-500'
                        }`}
                      />
                      <span>{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Threat-Detection Indicators */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#060a14]/90 border border-slate-800/90 flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Threat Accuracy
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                  99.8%
                </span>
                <span className="text-[10px] font-mono text-cyan-400 mt-0.5">
                  Multi-Vector Heuristics
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060a14]/90 border border-slate-800/90 flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Analysis Latency
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                  &lt; 450ms
                </span>
                <span className="text-[10px] font-mono text-emerald-400 mt-0.5">
                  Sub-second Response
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#060a14]/90 border border-slate-800/90 flex flex-col">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Protected Queries
                </span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
                  1.48M+
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Zero Data Stored
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
