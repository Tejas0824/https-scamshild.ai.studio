import React, { useState } from 'react';
import { Shield, Volume2, VolumeX, Menu, X, ArrowUpRight, Database } from 'lucide-react';
import { cyberAudio } from '../utils/cyberAudio';

interface NavbarProps {
  onScanClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onScanClick }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    cyberAudio.setMuted(next);
  };

  const navLinks = [
    { label: 'Scanner', href: '#scanner' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Intelligence', href: '#intelligence' },
    { label: 'Threat Radar', href: '#dashboard' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-950/40 bg-[#04060b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#scanner" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-[#071324] border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              ScamShield <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-700/30">AI</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">CYBER_DEFENSE</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wide text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-400 transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Supabase DB Backend Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#081224] border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>SUPABASE DB: ONLINE</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute cyber sound effects' : 'Mute cyber sound effects'}
            className="p-2 rounded-lg bg-[#080e1a] border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            title={isMuted ? 'Audio Muted' : 'Audio Active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Scan CTA */}
          <button
            onClick={onScanClick}
            aria-label="Scan Website"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs tracking-wide hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <span>Scan URL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="p-2 rounded bg-[#080e1a] border border-slate-800 text-slate-400"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="p-2 rounded bg-[#080e1a] border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-800 bg-[#070b14] px-4 py-5 flex flex-col gap-4 font-mono text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-cyan-400 py-1"
            >
              {link.label}
            </a>
          ))}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onScanClick();
            }}
            aria-label="Scan Website Now"
            className="w-full mt-2 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>INSTANT URL SCAN</span>
          </button>
        </div>
      )}
    </header>
  );
};
