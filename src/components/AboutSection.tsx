import React from 'react';
import { Shield, Target, Users, HeartHandshake, Sparkles, CheckCircle } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-cyan-950/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Mission text */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#071324] border border-cyan-500/30 text-xs font-mono text-cyan-300 w-fit">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>OUR MISSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Democratizing Cybersecurity <br />
            for Every Internet Citizen.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every single day, hundreds of thousands of people fall victim to deceptive links,
            spoofed banking portals, and weaponized typosquatted domains. Legacy antivirus tools
            are cumbersome, while browser warnings frequently arrive hours too late.
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            <strong className="text-white">ScamShield AI</strong> was built on a simple conviction: 
            verifying a link's authenticity should be instantaneous, zero-cost, and accessible to anyone 
            with a single click. We combine high-performance cryptographic heuristics with neural intelligence 
            to arm individuals, families, and organizations against modern digital extortion.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>100% Free Public Utility</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero User Tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Real-Time Telemetry</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-mono text-slate-300">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero-Day Defense</span>
            </div>
          </div>
        </div>

        {/* Right Visual Card */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl bg-[#060a14] border border-cyan-900/40 p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">The ScamShield Pledge</h3>
                <span className="text-xs font-mono text-cyan-400">UNCOMPROMISED USER INTEGRITY</span>
              </div>
            </div>

            <blockquote className="text-sm text-slate-300 italic border-l-2 border-cyan-500 pl-4 py-1 mb-6 leading-relaxed">
              "We believe online trust is fundamentally broken. By giving users immediate, clear visibility 
              into what lies behind an unfamiliar link, we neutralize attacks before credentials are ever submitted."
            </blockquote>

            <div className="p-4 rounded-xl bg-[#04060c] border border-slate-800 font-mono text-xs text-slate-400 flex items-center justify-between">
              <span>ACTIVE ARCHITECTURE:</span>
              <span className="text-emerald-400 font-semibold">NEURAL HEURISTIC ENGINE V3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
