import React, { useState } from 'react';
import { 
  ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, 
  Copy, Check, RefreshCw, Lock, Globe, Server, Hash, Cpu,
  Info, AlertOctagon, ArrowRight, FileText, Database
} from 'lucide-react';
import { ScanResult } from '../utils/scannerLogic';

interface ScanResultDetailProps {
  result: ScanResult;
  onScanAnother: () => void;
}

export const ScanResultDetail: React.FC<ScanResultDetailProps> = ({
  result,
  onScanAnother,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    const reportText = `[ScamShield AI Security Audit Report]
Target URL: ${result.url}
Verdict: ${result.status} (Risk Score: ${result.riskScore}/100 | Trust: ${result.trustScore}/100)
Engine: ${result.engine === 'ai-gemini' ? 'ScamShield Gemini AI' : 'Heuristic Rules Engine'}
Summary: ${result.summary}
Detected Signals (${result.signals.length}):
${result.signals.map(s => `- [${s.severity.toUpperCase()}] ${s.title}: ${s.detail}`).join('\n')}
Recommendations:
${result.recommendations.map(r => `- ${r}`).join('\n')}
Audited on: ${result.scannedAt}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="results" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Container with verdict styling */}
      <div className={`rounded-3xl bg-[#060a14] border ${
        result.status === 'SAFE' ? 'glow-border-safe border-emerald-500/40' :
        result.status === 'SUSPICIOUS' ? 'glow-border-warning border-amber-500/40' :
        'glow-border-danger border-rose-500/40'
      } overflow-hidden shadow-2xl`}>

        {/* Top Result Banner */}
        <div className={`p-6 sm:p-8 border-b ${
          result.status === 'SAFE' ? 'bg-emerald-950/20 border-emerald-900/30' :
          result.status === 'SUSPICIOUS' ? 'bg-amber-950/20 border-amber-900/30' :
          'bg-rose-950/25 border-rose-900/40'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status & Badge */}
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                result.status === 'SAFE' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                result.status === 'SUSPICIOUS' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
                'bg-rose-500/10 border-rose-500/40 text-rose-400'
              }`}>
                {result.status === 'SAFE' && <ShieldCheck className="w-8 h-8" />}
                {result.status === 'SUSPICIOUS' && <AlertTriangle className="w-8 h-8" />}
                {result.status === 'DANGEROUS' && <ShieldAlert className="w-8 h-8" />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                    result.status === 'SAFE' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/40' :
                    result.status === 'SUSPICIOUS' ? 'bg-amber-950/80 text-amber-300 border-amber-600/40' :
                    'bg-rose-950/80 text-rose-300 border-rose-600/40'
                  }`}>
                    VERDICT: {result.status}
                  </span>

                  <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    SAVED TO SUPABASE
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-mono break-all">
                  {result.hostname}
                </h2>
                <div className="text-xs font-mono text-slate-400 truncate max-w-lg mt-0.5">
                  Full URL: {result.url}
                </div>
              </div>
            </div>

            {/* Score Ring / Pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Threat Risk Score
                </div>
                <div className={`text-3xl font-extrabold font-mono ${
                  result.status === 'SAFE' ? 'text-emerald-400' :
                  result.status === 'SUSPICIOUS' ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {result.riskScore}<span className="text-xs text-slate-500">/100</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 mt-1">
                Trust Index: <span className="text-white font-bold">{result.trustScore}%</span>
              </div>
            </div>
          </div>

          {/* Verdict Summary Box */}
          <div className="mt-6 p-4 rounded-xl bg-[#040710] border border-slate-800 text-sm font-sans text-slate-200 leading-relaxed">
            <span className="font-mono text-cyan-400 text-xs font-semibold mr-2">[ASSESSMENT]</span>
            {result.summary}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Signals & Recommendations */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Detected Signals List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  Detected Security Signals ({result.signals.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Weighted threat factors
                </span>
              </div>

              <div className="space-y-3">
                {result.signals.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0">
                      {sig.severity === 'critical' && <AlertOctagon className="w-4 h-4 text-rose-400" />}
                      {sig.severity === 'high' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                      {sig.severity === 'medium' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      {sig.severity === 'low' && <Info className="w-4 h-4 text-cyan-400" />}
                      {sig.severity === 'info' && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-100">
                          {sig.title}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          sig.severity === 'critical' ? 'bg-rose-950/60 text-rose-300 border-rose-800' :
                          sig.severity === 'high' ? 'bg-rose-950/40 text-rose-400 border-rose-900' :
                          sig.severity === 'medium' ? 'bg-amber-950/40 text-amber-300 border-amber-900' :
                          sig.severity === 'info' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900' :
                          'bg-cyan-950/40 text-cyan-300 border-cyan-900'
                        }`}>
                          {sig.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-normal">
                        {sig.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Recommendations */}
            <div className="p-5 rounded-2xl bg-[#070d1a] border border-slate-800">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Actionable Security Directives
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Telemetry Specs & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Domain Telemetry Matrix */}
            <div className="p-5 rounded-2xl bg-[#080e1c] border border-slate-800">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Domain Telemetry & Fingerprint
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Target Protocol:</span>
                  <span className={result.isHttps ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                    {result.protocol.toUpperCase()} {result.isHttps ? '(Encrypted)' : '(Insecure)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">SSL Certificate:</span>
                  <span className="text-slate-200 truncate max-w-[180px]">
                    {result.telemetry.sslStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Top-Level Domain:</span>
                  <span className="text-cyan-300">.{result.telemetry.tld || 'none'}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Subdomain Depth:</span>
                  <span className="text-slate-200">{result.telemetry.subdomainsCount} levels</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Estimated Registration:</span>
                  <span className="text-slate-200">{result.telemetry.estimatedAge}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                  <span className="text-slate-400">Shannon Entropy:</span>
                  <span className="text-slate-200">{result.telemetry.entropyScore} (bits/symbol)</span>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-400">Impersonation Target:</span>
                  <span className={result.telemetry.brandImpersonated ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                    {result.telemetry.brandImpersonated || 'None Detected'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Copy Report & Scan Another */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCopyReport}
                aria-label="Copy security report"
                className="w-full py-3 px-4 rounded-xl bg-[#091122] hover:bg-[#0c1730] border border-cyan-800/40 text-xs font-mono text-cyan-300 hover:text-cyan-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>AUDIT REPORT COPIED TO CLIPBOARD</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY AUDIT REPORT</span>
                  </>
                )}
              </button>

              <button
                onClick={onScanAnother}
                aria-label="Scan another URL"
                className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>SCAN ANOTHER WEBSITE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
