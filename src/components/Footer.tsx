import React from 'react';
import { Shield, Lock, Terminal, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#030509] text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#071324] border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-tight flex items-center gap-1.5">
              ScamShield AI <span className="text-[10px] font-mono text-cyan-400">v3.0</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Future-Generation Cybersecurity Platform
            </div>
          </div>
        </div>

        {/* Notice & Privacy statement */}
        <div className="text-xs text-slate-500 font-mono text-center md:text-left max-w-md">
          ScamShield AI inspects domain signals for informational security awareness. 
          Results and simulated feeds are clearly labeled for transparency.
        </div>

        {/* Back to top & Copyright */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-500">
            © {new Date().getFullYear()} ScamShield AI
          </span>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="p-2 rounded-lg bg-[#080d1a] border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
