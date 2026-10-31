/**
 * ScamShield AI — Future-Generation Cybersecurity Website & Threat Scanner
 * Integrated with Supabase Backend Persistence
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroScanner, SCAN_STAGES } from './components/HeroScanner';
import { ScanResultDetail } from './components/ScanResultDetail';
import { HowItWorks } from './components/HowItWorks';
import { SecurityIntelligence } from './components/SecurityIntelligence';
import { LiveThreatDashboard } from './components/LiveThreatDashboard';
import { WhyScamShield } from './components/WhyScamShield';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ScanResult, analyzeUrlThreat } from './utils/scannerLogic';
import { cyberAudio } from './utils/cyberAudio';
import { saveScanToSupabase } from './services/supabaseService.js';

export default function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [activeScanStage, setActiveScanStage] = useState(0);
  const [lastResult, setLastResult] = useState<ScanResult | null>(null);

  // Check URL params for ?autostart=1 or ?url=...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const target = params.get('url');
    const autostart = params.get('autostart');

    if (target) {
      handleScan(target);
    } else if (autostart === '1') {
      handleScan('http://paypa1-security-update-login.xyz/verify');
    }
  }, []);

  const handleScan = async (rawUrl: string) => {
    setIsScanning(true);
    setActiveScanStage(0);

    // Staged progression timer to simulate deep multi-layer neural scan
    const stageInterval = setInterval(() => {
      setActiveScanStage((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      let finalResult: ScanResult;

      try {
        const response = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: rawUrl }),
        });

        if (response.ok) {
          finalResult = await response.json();
        } else {
          // Fallback to local heuristic engine
          finalResult = analyzeUrlThreat(rawUrl);
        }
      } catch {
        // Offline / client fallback
        finalResult = analyzeUrlThreat(rawUrl);
      }

      // Ensure at least 1.8 seconds of scan radar visualization
      await new Promise((resolve) => setTimeout(resolve, 1800));

      clearInterval(stageInterval);
      setLastResult(finalResult);

      // Save scan audit record directly to Supabase Backend
      saveScanToSupabase(finalResult).catch((dbErr) => {
        console.warn('Supabase auto-save background handler:', dbErr);
      });

      // Play audio feedback
      if (finalResult.status === 'SAFE') {
        cyberAudio.playSafeVerdict();
      } else {
        cyberAudio.playThreatAlert();
      }

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err: any) {
      clearInterval(stageInterval);
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanAnother = () => {
    setLastResult(null);
    const scannerEl = document.getElementById('scanner');
    if (scannerEl) {
      scannerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const inputEl = document.getElementById('url-input');
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleNavScanClick = () => {
    const scannerEl = document.getElementById('scanner');
    if (scannerEl) {
      scannerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const inputEl = document.getElementById('url-input');
    if (inputEl) {
      inputEl.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#04060a] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Responsive Navigation */}
      <Navbar onScanClick={handleNavScanClick} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section with 3D Cyber Shield and Interactive Scanner */}
        <HeroScanner
          onScan={handleScan}
          isScanning={isScanning}
          activeScanStage={activeScanStage}
          lastResult={lastResult}
        />

        {/* Scan Results View (Visible once a scan has completed) */}
        {lastResult && (
          <ScanResultDetail
            result={lastResult}
            onScanAnother={handleScanAnother}
          />
        )}

        {/* How It Works Section */}
        <HowItWorks />

        {/* Security Intelligence Vector Matrix */}
        <SecurityIntelligence />

        {/* Live Threat Dashboard with Supabase Telemetry Feed */}
        <LiveThreatDashboard />

        {/* Why ScamShield AI Section */}
        <WhyScamShield />

        {/* Mission & About Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
