import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface CyberShield3DProps {
  threatLevel?: 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' | 'SCANNING' | 'IDLE';
  isScanning?: boolean;
}

// Module-level scratch math objects to ensure zero GC in animation loop
const _targetRotation = new THREE.Vector2(0, 0);
const _currentRotation = new THREE.Vector2(0, 0);

export const CyberShield3D: React.FC<CyberShield3DProps> = ({
  threatLevel = 'IDLE',
  isScanning = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [shieldStateMode, setShieldStateMode] = useState<'DEFENSE' | 'TACTICAL' | 'PULSE'>('DEFENSE');

  // Keep latest props in ref for continuous animation loop
  const stateRef = useRef({ threatLevel, isScanning, shieldStateMode });
  stateRef.current = { threatLevel, isScanning, shieldStateMode };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Setup Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.2);
    camera.lookAt(0, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Warm key + cool hemisphere fill)
    const keyLight = new THREE.DirectionalLight(0xa5f3fc, 2.8);
    keyLight.position.set(3, 4, 3.5);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    rimLight.position.set(-3, -1, -2);
    scene.add(rimLight);

    const fillLight = new THREE.HemisphereLight(0x0891b2, 0x050811, 1.2);
    scene.add(fillLight);

    // 5. Procedural 3D Composite Shield (8 distinct parts)
    const shieldGroup = new THREE.Group();
    shieldGroup.position.set(0, 0.15, 0);

    // Shield Shape Curve
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.4);
    shieldShape.bezierCurveTo(0.65, 1.35, 1.15, 1.1, 1.15, 0.3);
    shieldShape.bezierCurveTo(1.15, -0.4, 0.6, -1.0, 0, -1.45);
    shieldShape.bezierCurveTo(-0.6, -1.0, -1.15, -0.4, -1.15, 0.3);
    shieldShape.bezierCurveTo(-1.15, 1.1, -0.65, 1.35, 0, 1.4);

    const innerShape = new THREE.Shape();
    innerShape.moveTo(0, 1.18);
    innerShape.bezierCurveTo(0.5, 1.14, 0.9, 0.9, 0.9, 0.25);
    innerShape.bezierCurveTo(0.9, -0.32, 0.45, -0.85, 0, -1.22);
    innerShape.bezierCurveTo(-0.45, -0.85, -0.9, -0.32, -0.9, 0.25);
    innerShape.bezierCurveTo(-0.9, 0.9, -0.5, 1.14, 0, 1.18);

    // Part 1: Outer Shield Beveled Frame
    const outerExtrudeSettings = {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.06,
      bevelThickness: 0.05,
    };
    const outerGeo = new THREE.ExtrudeGeometry(shieldShape, outerExtrudeSettings);
    outerGeo.center();

    // High metalness dark titanium frame
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.92,
      roughness: 0.18,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    if (!isSoftwareGl) outerMesh.castShadow = true;
    shieldGroup.add(outerMesh);

    // Part 2: Inner Armor Plate (Contrasting roughness)
    const innerExtrudeSettings = {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    };
    const innerGeo = new THREE.ExtrudeGeometry(innerShape, innerExtrudeSettings);
    innerGeo.center();
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x061e38,
      metalness: 0.65,
      roughness: 0.48, // roughness varies by > 0.25
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.z = 0.04;
    shieldGroup.add(innerMesh);

    // Part 3: Holographic Center Crest (Embossed Cyber Emblem)
    const crestGeo = new THREE.OctahedronGeometry(0.38, 0);
    const crestMat = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      emissive: 0x0891b2,
      emissiveIntensity: 0.55,
      metalness: 0.9,
      roughness: 0.1,
    });
    const crestMesh = new THREE.Mesh(crestGeo, crestMat);
    crestMesh.position.set(0, 0.05, 0.18);
    shieldGroup.add(crestMesh);

    // Part 4: Inner Core Glow Node
    const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0.05, 0.2);
    shieldGroup.add(coreMesh);

    // Part 5 & 6: Dual Concentric Holographic Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.015, 12, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.2,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 2.3;
    shieldGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.012, 12, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.15,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 2.8;
    ring2Mesh.rotation.x = Math.PI / 4;
    shieldGroup.add(ring2Mesh);

    // Part 7: Radar Scanning Reticle Arc
    const radarGeo = new THREE.RingGeometry(0.5, 1.4, 32, 1, 0, Math.PI / 3);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.z = 0.12;
    shieldGroup.add(radarMesh);

    // Part 8: Floating Data Cloud Particles
    const particleCount = isSoftwareGl ? 30 : 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 1.6 + Math.random() * 0.9;
      particlePos[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = rad * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    shieldGroup.add(particles);

    // Part 9: Soft Radial Contact Shadow Plane directly beneath object
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0,0,0,0.7)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.3)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const shadowGeo = new THREE.PlaneGeometry(3.2, 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.55;
    shieldGroup.add(shadowPlane);

    scene.add(shieldGroup);

    // Mouse Parallax Interaction
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      _targetRotation.x = y * 0.35;
      _targetRotation.y = x * 0.55;
    };

    window.addEventListener('pointermove', handlePointerMove);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    // Software WebGL pacing helper
    let frameId = 0;
    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    // Animation Loop
    let lastTime = performance.now();
    let startTime = performance.now();

    function tick() {
      const now = performance.now();
      const delta = Math.min(0.1, (now - lastTime) / 1000);
      const elapsed = (now - startTime) / 1000;
      lastTime = now;

      // Smooth exponential damping for mouse look
      _currentRotation.x = THREE.MathUtils.damp(_currentRotation.x, _targetRotation.x, 4.0, delta);
      _currentRotation.y = THREE.MathUtils.damp(_currentRotation.y, _targetRotation.y, 4.0, delta);

      // Idle float & wobble
      const floatY = Math.sin(elapsed * 1.5) * 0.06;
      shieldGroup.position.y = 0.15 + floatY;

      // Base rotation + mouse tilt
      shieldGroup.rotation.x = _currentRotation.x;
      shieldGroup.rotation.y = _currentRotation.y + Math.sin(elapsed * 0.6) * 0.12;

      // Spin rings in opposing directions
      ring1Mesh.rotation.z += delta * 0.45;
      ring2Mesh.rotation.z -= delta * 0.35;

      // Radar sweep
      radarMesh.rotation.z += delta * (stateRef.current.isScanning ? 3.5 : 1.2);

      // Core spin
      crestMesh.rotation.x = elapsed * 0.8;
      crestMesh.rotation.y = elapsed * 0.9;
      coreMesh.rotation.y = -elapsed * 1.2;

      // Particle subtle spin
      particles.rotation.y = elapsed * 0.15;

      // Color reactivity based on threat level
      const currentThreat = stateRef.current.threatLevel;
      if (currentThreat === 'DANGEROUS') {
        crestMat.color.setHex(0xef4444);
        crestMat.emissive.setHex(0xb91c1c);
        radarMat.color.setHex(0xf87171);
        ring1Mat.color.setHex(0xfc8181);
        keyLight.color.setHex(0xfca5a5);
      } else if (currentThreat === 'SUSPICIOUS') {
        crestMat.color.setHex(0xf59e0b);
        crestMat.emissive.setHex(0xd97706);
        radarMat.color.setHex(0xfbbf24);
        ring1Mat.color.setHex(0xfde68a);
        keyLight.color.setHex(0xfef08a);
      } else if (currentThreat === 'SAFE') {
        crestMat.color.setHex(0x10b981);
        crestMat.emissive.setHex(0x059669);
        radarMat.color.setHex(0x34d399);
        ring1Mat.color.setHex(0x6ee7b7);
        keyLight.color.setHex(0xa7f3d0);
      } else {
        // IDLE / SCANNING (electric cyan / aqua)
        crestMat.color.setHex(0x22d3ee);
        crestMat.emissive.setHex(0x0891b2);
        radarMat.color.setHex(0x06b6d4);
        ring1Mat.color.setHex(0x38bdf8);
        keyLight.color.setHex(0xa5f3fc);
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start loop
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      // Dispose geometries & materials
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      crestGeo.dispose();
      crestMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      radarGeo.dispose();
      radarMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTex.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[440px] md:h-[500px] flex items-center justify-center overflow-hidden">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        data-testid="cyber-shield-3d-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Floating Status & Telemetry Tag */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2 bg-[#080d1a]/80 border border-cyan-500/30 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>CYBER_CORE // ACTIVE</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 pl-1">
          STATE: {threatLevel}
        </div>
      </div>

      {/* Collapsible Sleek Control Dock (Three.js skill directive: bottom-center, <=15% footprint, solid/rgba) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          onClick={() => setIsCinemaMode(!isCinemaMode)}
          aria-label={isCinemaMode ? 'Show shield controls' : 'Hide shield controls'}
          className="text-[10px] font-mono tracking-wider text-slate-400 hover:text-cyan-300 bg-[#070b14]/90 border border-slate-800 px-2.5 py-0.5 rounded-t-md transition-colors"
        >
          {isCinemaMode ? '▴ Controls' : '▾ Collapse'}
        </button>

        {!isCinemaMode && (
          <div className="flex items-center gap-2 bg-[#070b14]/95 border border-cyan-900/40 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 shadow-xl">
            <span className="text-slate-500 text-[11px]">DEFENSE:</span>
            <button
              onClick={() => setShieldStateMode('DEFENSE')}
              aria-label="Set Defense mode"
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                shieldStateMode === 'DEFENSE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Shield
            </button>
            <button
              onClick={() => setShieldStateMode('TACTICAL')}
              aria-label="Set Tactical mode"
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                shieldStateMode === 'TACTICAL' ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Radar
            </button>
            <button
              onClick={() => setShieldStateMode('PULSE')}
              aria-label="Set Pulse mode"
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                shieldStateMode === 'PULSE' ? 'bg-cyan-950 text-cyan-300 border border-cyan-600/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orbital
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
