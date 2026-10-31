import React from 'react';
import { Zap, Lock, Compass, BrainCircuit, ArrowUpRight } from 'lucide-react';

export const WhyScamShield: React.FC = () => {
  const pillars = [
    {
      icon: Zap,
      title: 'Fast Analysis',
      stat: '< 450ms',
      desc: 'Instant real-time multi-stage inspection. High-throughput distributed pipelines evaluate domain integrity without lag or waiting.',
    },
    {
      icon: Lock,
      title: 'Privacy-First Approach',
      stat: '0 Bytes Stored',
      desc: 'Your queries are never logged, tracked, or sold. Inspected URLs exist strictly in volatile memory for the duration of the scan.',
    },
    {
      icon: Compass,
      title: 'Easy-to-Understand Results',
      stat: 'Clear Verdicts',
      desc: 'No confusing technical jargon. Receive a crystal-clear SAFE, SUSPICIOUS, or DANGEROUS status with straightforward recommendations.',
    },
    {
      icon: BrainCircuit,
      title: 'Intelligent Threat Detection',
      stat: 'Neural Model',
      desc: 'Proprietary heuristic engine combined with state-of-the-art AI intelligence capable of detecting zero-day homoglyphs and polymorphic scams.',
    },
  ];

  return (
    <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-950/30">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
          <span>THE DIFFERENCE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          Why ScamShield AI
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          Engineered to provide enterprise-grade cybersecurity analysis in an intuitive, accessible interface for everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="p-6 rounded-3xl bg-[#060a14] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#091122] border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:border-cyan-400/50 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-xs font-mono text-cyan-400 font-bold mb-1">
                  {pillar.stat}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                <span>VERIFIED STANDARD</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
