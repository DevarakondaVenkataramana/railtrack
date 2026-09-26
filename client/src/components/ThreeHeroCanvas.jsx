import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Gauge, Sparkles, Zap, Compass, RefreshCw } from 'lucide-react';

const COLOR_THEMES = {
  cyber: {
    name: 'Cyber Neon',
    primary: 0x3b82f6,
    secondary: 0x06b6d4,
    accent: 0xa855f7,
    fog: 0x070b14,
    bgClass: 'from-blue-500/20 to-cyan-500/10'
  },
  emerald: {
    name: 'Emerald Bullet',
    primary: 0x10b981,
    secondary: 0x34d399,
    accent: 0x06b6d4,
    fog: 0x04130d,
    bgClass: 'from-emerald-500/20 to-teal-500/10'
  },
  vandeBharat: {
    name: 'Vande Bharat Gold',
    primary: 0xf59e0b,
    secondary: 0x3b82f6,
    accent: 0xec4899,
    fog: 0x0d0c14,
    bgClass: 'from-amber-500/20 to-blue-500/10'
  },
  crimson: {
    name: 'Hyper Velocity',
    primary: 0xef4444,
    secondary: 0xf97316,
    accent: 0x8b5cf6,
    fog: 0x120608,
    bgClass: 'from-rose-500/20 to-orange-500/10'
  }
};

const ThreeHeroCanvas = () => {
  const mountRef = useRef(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.5);
  const [currentThemeKey, setCurrentThemeKey] = useState('cyber');
  const [hudSpeed, setHudSpeed] = useState(160);
  const [isHyperSpeed, setIsHyperSpeed] = useState(false);

  const speedRef = useRef(speedMultiplier);
  const themeRef = useRef(COLOR_THEMES[currentThemeKey]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    speedRef.current = isHyperSpeed ? 3.0 : speedMultiplier;
    setHudSpeed(Math.round(110 + (isHyperSpeed ? 3.0 : speedMultiplier) * 35));
  }, [speedMultiplier, isHyperSpeed]);

  useEffect(() => {
    themeRef.current = COLOR_THEMES[currentThemeKey];
  }, [currentThemeKey]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(themeRef.current.fog, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3.5, 12);
    camera.lookAt(0, 1.2, -30);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 15, 10);
    scene.add(dirLight);

    // Dynamic point lights for the train beams
    const leftBeamLight = new THREE.PointLight(themeRef.current.primary, 3, 40);
    leftBeamLight.position.set(-1.2, 1, 0);
    scene.add(leftBeamLight);

    const rightBeamLight = new THREE.PointLight(themeRef.current.secondary, 3, 40);
    rightBeamLight.position.set(1.2, 1, 0);
    scene.add(rightBeamLight);

    // 4. Create 3D Railway Track
    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // Rails (Left & Right Glowing Metallic Beams)
    const railLength = 160;
    const railGeometry = new THREE.CylinderGeometry(0.06, 0.06, railLength, 16);
    railGeometry.rotateX(Math.PI / 2);

    const leftRailMat = new THREE.MeshStandardMaterial({
      color: themeRef.current.primary,
      emissive: themeRef.current.primary,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });

    const rightRailMat = new THREE.MeshStandardMaterial({
      color: themeRef.current.secondary,
      emissive: themeRef.current.secondary,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });

    const leftRail = new THREE.Mesh(railGeometry, leftRailMat);
    leftRail.position.set(-1.6, 0.5, -railLength / 2 + 10);
    trackGroup.add(leftRail);

    const rightRail = new THREE.Mesh(railGeometry, rightRailMat);
    rightRail.position.set(1.6, 0.5, -railLength / 2 + 10);
    trackGroup.add(rightRail);

    // Railway Sleepers / Ties (Cross bars)
    const sleeperCount = 80;
    const sleeperSpacing = 2.0;
    const sleeperGeo = new THREE.BoxGeometry(4.2, 0.12, 0.35);
    const sleeperMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });

    const sleepers = [];
    for (let i = 0; i < sleeperCount; i++) {
      const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
      sleeper.position.set(0, 0.44, -i * sleeperSpacing);
      trackGroup.add(sleeper);
      sleepers.push(sleeper);
    }

    // 5. High-Speed Light Trails / Laser Train Beams
    const trailSegments = 24;
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailSegments * 3);
    for (let i = 0; i < trailSegments; i++) {
      trailPositions[i * 3] = (Math.random() - 0.5) * 0.2;
      trailPositions[i * 3 + 1] = 0.5 + Math.random() * 0.2;
      trailPositions[i * 3 + 2] = -i * 3;
    }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMaterial = new THREE.LineBasicMaterial({
      color: themeRef.current.secondary,
      linewidth: 3,
      transparent: true,
      opacity: 0.8
    });
    const lightTrailLeft = new THREE.Line(trailGeometry, trailMaterial);
    lightTrailLeft.position.x = -1.6;
    scene.add(lightTrailLeft);

    const lightTrailRight = new THREE.Line(trailGeometry, trailMaterial.clone());
    lightTrailRight.position.x = 1.6;
    scene.add(lightTrailRight);

    // 6. Floating Telemetry Particles / Starfield
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleCoords[i * 3] = (Math.random() - 0.5) * 80;
      particleCoords[i * 3 + 1] = Math.random() * 35 - 5;
      particleCoords[i * 3 + 2] = -Math.random() * 140;
      particleScales[i] = Math.random() * 1.5 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.18,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Futuristic Ground Grid Plane
    const gridHelper = new THREE.GridHelper(200, 60, themeRef.current.primary, 0x1e293b);
    gridHelper.position.set(0, 0, -40);
    gridHelper.material.opacity = 0.35;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 8. Mouse Interaction Listener
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 1.8;
      mouseRef.current.targetY = y * 0.9;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const speed = speedRef.current;

      // Smooth camera interpolation based on mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x * 2.2;
      camera.position.y = 3.5 + mouseRef.current.y * 1.2;
      camera.lookAt(mouseRef.current.x * 0.8, 1.2, -40);

      // Move Sleepers towards camera to simulate forward motion
      const moveDistance = delta * 38 * speed;
      sleepers.forEach((sleeper) => {
        sleeper.position.z += moveDistance;
        if (sleeper.position.z > 12) {
          sleeper.position.z -= sleeperCount * sleeperSpacing;
        }
      });

      // Animate Grid
      gridHelper.position.z = (gridHelper.position.z + moveDistance) % 10 - 40;

      // Pulse rail materials
      const time = clock.getElapsedTime();
      leftRailMat.emissiveIntensity = 0.7 + Math.sin(time * 6) * 0.3;
      rightRailMat.emissiveIntensity = 0.7 + Math.cos(time * 6) * 0.3;

      // Float and rotate particles
      const positions = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += moveDistance * 0.6;
        if (positions[i * 3 + 2] > 15) {
          positions[i * 3 + 2] = -135;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Render
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentThemeKey]);

  return (
    <div className="relative w-full h-[580px] md:h-[660px] lg:h-[720px] overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950 shadow-2xl">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />

      {/* Futuristic Gradient Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent z-10" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70 z-10" />

      {/* Top 3D Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel text-white">
        <div className="flex items-center gap-2 text-xs md:text-sm font-bold tracking-wider uppercase text-blue-400">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          3D Live Kinetic Engine • WebGL
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/60">
          {Object.entries(COLOR_THEMES).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentThemeKey(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                currentThemeKey === key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {theme.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Hyper Speed Toggle Button */}
        <button
          onClick={() => setIsHyperSpeed(!isHyperSpeed)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isHyperSpeed
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-500/40 scale-105 animate-pulse'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          {isHyperSpeed ? 'HYPER DRIVE (240 KM/H)' : 'BOOST SPEED'}
        </button>
      </div>

      {/* Floating 3D Telemetry HUD (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-20 hidden sm:flex flex-col gap-2 p-4 rounded-2xl glass-panel text-white border border-blue-500/20 shadow-xl max-w-xs animate-float">
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-700/50 pb-2">
          <span className="flex items-center gap-1 font-semibold uppercase text-cyan-400">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> GPS TRACKING
          </span>
          <span className="font-mono text-emerald-400">SATELLITE LOCKED</span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black tracking-tight text-white font-mono">
              {hudSpeed}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">KM/H</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase block font-semibold">Track Stability</span>
            <span className="text-xs font-mono font-bold text-emerald-400">99.98% OPTIMAL</span>
          </div>
        </div>

        {/* Simulated Velocity Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1">
          <div
            className="bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${(hudSpeed / 250) * 100}%` }}
          />
        </div>
      </div>

      {/* Floating Interactive Route Preview Widget (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3 p-3.5 rounded-2xl glass-panel text-white border border-slate-700/60 shadow-xl">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
          <Gauge className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Superfast</div>
          <div className="text-sm font-black text-white">Vande Bharat 2.0 (20608)</div>
          <div className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Approaching Platform 1 • 0m Delay
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeHeroCanvas;
