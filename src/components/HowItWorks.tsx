import React, { useState } from 'react';
import { Clipboard, Cpu, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: '01',
      title: 'Paste a Website URL',
      subtitle: 'Instant target submission without sign-up',
      desc: 'Copy and paste any link from suspicious emails, SMS notifications, social platforms, or direct messages into our secure inspection gateway.',
      icon: Clipboard,
      preview: {
        header: 'TARGET_INPUT_STREAM',
        code: 'INPUT: "https://paypa1-account-security.cam/auth"\nSANITIZATION: Complete (0 bytes user tracking)\nSTATUS: Ingested into cryptographic sandbox',
      },
    },
    {
      step: '02',
      title: 'AI Analyzes Domain Signals',
      subtitle: 'Multi-layer heuristics & neural pattern engine',
      desc: 'Our engine inspects DNS topology, TLS handshake integrity, typosquatting homoglyphs, and checks against 50M+ known phishing signatures.',
      icon: Cpu,
      preview: {
        header: 'NEURAL_HEURISTIC_PIPELINE',
        code: 'FLAG: Homoglyph [1] replacing [l] in "paypa1"\nFLAG: TLD [.cam] flagged high-risk registrar\nFLAG: Subdomain depth anomaly (3 tiers)\nRESULT: Neural confidence 97.4% Phishing Kit',
      },
    },
    {
      step: '03',
      title: 'Get a Clear Security Assessment',
      subtitle: 'Transparent verdict, risk score & safety advice',
      desc: 'Receive an immediate SAFE, SUSPICIOUS, or DANGEROUS rating with detailed signal breakdowns and clear recommendations on next steps.',
      icon: ShieldCheck,
      preview: {
        header: 'ASSESSMENT_REPORT',
        code: 'VERDICT: DANGEROUS [CRITICAL]\nRISK SCORE: 94 / 100\nACTION: Do NOT enter credentials.\nCONTAINMENT: Domain flagged to global radar.',
      },
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-950/30">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
          <span>ZERO COMPLEXITY</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          How ScamShield AI Works
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Three streamlined stages designed to protect everyday internet users and cybersecurity professionals with zero friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
        {/* Step Selector List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                aria-label={`View step ${s.step}: ${s.title}`}
                className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#091122] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-[#060a14] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm shrink-0 border ${
                    isActive
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                      : 'bg-[#0a1020] border-slate-800 text-slate-400'
                  }`}>
                    {s.step}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-bold text-base ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {s.title}
                      </h3>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Telemetry Terminal Preview */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#04060d] border border-cyan-900/40 p-6 shadow-2xl relative overflow-hidden font-mono">
            {/* Terminal Top Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 ml-2 font-mono">
                  telemetry-engine://stage-{steps[activeStep].step}
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/30">
                ACTIVE STAGE
              </span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                // {steps[activeStep].preview.header}
              </div>

              <div className="p-4 rounded-xl bg-[#080e1c] border border-cyan-900/30 text-xs text-cyan-200 whitespace-pre-wrap leading-loose">
                {steps[activeStep].preview.code}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Telemetry verified
                </span>
                <span>Latency: 12ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
