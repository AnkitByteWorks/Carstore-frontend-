"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import type { Car } from "@/lib/types/car";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RotateCcw,
  Layers,
  Eye,
  Sliders,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  Upload,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Car3DViewerProps {
  car: Car;
}

type ViewMode = "exterior" | "doors" | "engine" | "interior";

interface EnginePartInfo {
  id: string;
  name: string;
  spec: string;
  desc: string;
  material: string;
}

const ENGINE_PARTS: EnginePartInfo[] = [
  {
    id: "turbos",
    name: "Sequential Twin Turbos",
    spec: "Titanium-Aluminide Turbines • 1.9 Bar Boost",
    desc: "Feeds over 50,000 liters of pressurized induction air into the engine each minute.",
    material: "Aerospace Titanium",
  },
  {
    id: "intake",
    name: "Carbon Fiber Intake Plenum",
    spec: "Dual Resonance Airbox • Dry Carbon",
    desc: "Acoustically tuned carbon fiber runners for ultra-fast throttle transient response.",
    material: "Pre-preg Carbon Composite",
  },
  {
    id: "block",
    name: "Monoblock V12/W16 Engine Core",
    spec: "Forged Crankshaft & Titanium Rods • 8,500 RPM",
    desc: "High-revving bespoke forged aluminum-silicon core designed for extreme thermal loads.",
    material: "Forged Al-Si Alloy",
  },
  {
    id: "exhaust",
    name: "Inconel 625 Exhaust Manifold",
    spec: "Ceramic Thermal Barrier • Quad Tips",
    desc: "Formula 1 specification superalloy capable of withstanding continuous 1,000°C temperatures.",
    material: "Inconel 625 Superalloy",
  },
];

const EXTERIOR_COLORS = [
  { id: "carbon_blue", name: "Royal Carbon Blue", hex: "#0c2854", metallic: 0.85, roughness: 0.2 },
  { id: "rosso_corsa", name: "Rosso Corsa Red", hex: "#b91c1c", metallic: 0.75, roughness: 0.2 },
  { id: "nero_daytona", name: "Nero Metallic Black", hex: "#0b0f17", metallic: 0.95, roughness: 0.15 },
  { id: "giallo_gold", name: "Giallo Modena Gold", hex: "#d97706", metallic: 0.8, roughness: 0.22 },
  { id: "argento_silver", name: "Liquid Argento Silver", hex: "#cbd5e1", metallic: 0.98, roughness: 0.12 },
  { id: "verde_mantis", name: "Verde Mantis Green", hex: "#15803d", metallic: 0.8, roughness: 0.25 },
];

const SEAT_COLORS = [
  { id: "saddle_tan", name: "Hermès Saddle Tan", hex: "#b45309" },
  { id: "nero_alcantara", name: "Nero Alcantara", hex: "#1e293b" },
  { id: "monza_red", name: "Rosso Red Leather", hex: "#991b1b" },
  { id: "crema_white", name: "Crema White Nappa", hex: "#f1f5f9" },
];

export function Car3DViewer({ car }: Car3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("exterior");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [engineExploded, setEngineExploded] = useState(false);
  const [activeColor, setActiveColor] = useState(EXTERIOR_COLORS[0]);
  const [activeSeatColor, setActiveSeatColor] = useState(SEAT_COLORS[0]);
  const [selectedPart, setSelectedPart] = useState<EnginePartInfo | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [cadFileName, setCadFileName] = useState<string | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Mesh References for Kinematics & Animations
  const leftDoorPivotRef = useRef<THREE.Group | null>(null);
  const rightDoorPivotRef = useRef<THREE.Group | null>(null);
  const engineGroupRef = useRef<THREE.Group | null>(null);
  const enginePartsRef = useRef<{ [key: string]: THREE.Mesh | THREE.Group }>({});
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const seatMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Target Camera Interpolation
  const targetCamPos = useRef(new THREE.Vector3(3.8, 1.8, 4.5));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.5, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0.5, 0));

  // Mouse Interaction Variables
  const isDragging = useRef(false);
  const previousMousePos = useRef({ x: 0, y: 0 });
  const spherical = useRef({ radius: 6.5, theta: 0.8, phi: 1.1 });

  // ─── BUILD 3D HYPERCAR SCENE ───
  const initThreeScene = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070e);
    scene.fog = new THREE.FogExp2(0x05070e, 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 2.2, 5.0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // Replace old canvas if any
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting (Luxury Studio Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    mainKeyLight.position.set(5, 7, 5);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0x7090b0, 1.2);
    fillLight.position.set(-5, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.SpotLight(0xd4af37, 2.8, 15, Math.PI / 4, 0.5, 1.5);
    rimLight.position.set(0, 5, -5);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // 5. Studio Stage / Floor
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.35,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ground Grid
    const grid = new THREE.GridHelper(24, 24, 0xd4af37, 0x1e293b);
    grid.position.y = 0.001;
    scene.add(grid);

    // 6. Car Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor.hex),
      metalness: activeColor.metallic,
      roughness: activeColor.roughness,
    });
    bodyMaterialRef.current = bodyMat;

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x15181e,
      roughness: 0.4,
      metalness: 0.3,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0.75,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.08,
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeSeatColor.hex),
      roughness: 0.7,
      metalness: 0.1,
    });
    seatMaterialRef.current = seatMat;

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.25,
    });

    // ─── ASSEMBLE 3D HYPERCAR ───
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // A. Main Body / Chassis
    const chassisGeo = new THREE.BoxGeometry(2.1, 0.45, 4.4);
    const chassis = new THREE.Mesh(chassisGeo, bodyMat);
    chassis.position.y = 0.5;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    carRoot.add(chassis);

    // Front Nose / Splitter
    const noseGeo = new THREE.CylinderGeometry(0.85, 1.05, 0.3, 16);
    const nose = new THREE.Mesh(noseGeo, carbonMat);
    nose.rotation.z = Math.PI / 2;
    nose.position.set(0, 0.38, 2.2);
    nose.scale.set(0.6, 1.8, 0.8);
    carRoot.add(nose);

    // Aerodynamic Rear Wing & Diffuser
    const wingGeo = new THREE.BoxGeometry(2.2, 0.06, 0.5);
    const wing = new THREE.Mesh(wingGeo, carbonMat);
    wing.position.set(0, 1.15, -2.1);
    carRoot.add(wing);

    const wingPillarL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.15), carbonMat);
    wingPillarL.position.set(-0.6, 0.9, -2.05);
    const wingPillarR = wingPillarL.clone();
    wingPillarR.position.x = 0.6;
    carRoot.add(wingPillarL, wingPillarR);

    // Cabin Greenhouse & Glass Windshield
    const cabinGeo = new THREE.ConeGeometry(1.2, 1.2, 4);
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.rotation.y = Math.PI / 4;
    cabin.position.set(0, 1.05, 0.1);
    cabin.scale.set(0.9, 0.65, 1.6);
    carRoot.add(cabin);

    // B. Doors with Realistic Scissor/Butterfly Hinge Pivots
    const doorGeo = new THREE.BoxGeometry(0.12, 0.55, 1.4);

    // Left Door Pivot (Placed at front hinge point)
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-1.06, 0.6, 0.8);
    const leftDoorMesh = new THREE.Mesh(doorGeo, bodyMat);
    leftDoorMesh.position.set(0, 0, -0.7); // offset from hinge
    leftDoorMesh.castShadow = true;
    leftDoorPivot.add(leftDoorMesh);
    carRoot.add(leftDoorPivot);
    leftDoorPivotRef.current = leftDoorPivot;

    // Right Door Pivot
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(1.06, 0.6, 0.8);
    const rightDoorMesh = new THREE.Mesh(doorGeo, bodyMat);
    rightDoorMesh.position.set(0, 0, -0.7);
    rightDoorMesh.castShadow = true;
    rightDoorPivot.add(rightDoorMesh);
    carRoot.add(rightDoorPivot);
    rightDoorPivotRef.current = rightDoorPivot;

    // C. Wheels & Brake Assemblies
    const wheelPositions = [
      { x: -1.08, y: 0.38, z: 1.4 },
      { x: 1.08, y: 0.38, z: 1.4 },
      { x: -1.08, y: 0.38, z: -1.4 },
      { x: 1.08, y: 0.38, z: -1.4 },
    ];

    wheelPositions.forEach((pos) => {
      const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.32, 24);
      const tireMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85 });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.position.set(pos.x, pos.y, pos.z);
      tire.castShadow = true;

      // Rim
      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.34, 16);
      const rim = new THREE.Mesh(rimGeo, chromeMat);
      tire.add(rim);

      // Gold Caliper
      const caliperGeo = new THREE.BoxGeometry(0.12, 0.16, 0.22);
      const caliper = new THREE.Mesh(caliperGeo, goldAccentMat);
      caliper.position.set(0, 0.16, 0);
      tire.add(caliper);

      carRoot.add(tire);
    });

    // D. Interior Cockpit & Luxury Bucket Seats
    const interiorGroup = new THREE.Group();
    interiorGroup.position.set(0, 0.6, 0.2);

    // Driver Seat (Left)
    const seatGeo = new THREE.BoxGeometry(0.48, 0.6, 0.55);
    const seatDriver = new THREE.Mesh(seatGeo, seatMat);
    seatDriver.position.set(-0.45, 0.2, 0);
    seatDriver.castShadow = true;

    const headrestGeo = new THREE.BoxGeometry(0.24, 0.2, 0.15);
    const headrestDriver = new THREE.Mesh(headrestGeo, seatMat);
    headrestDriver.position.set(0, 0.42, -0.2);
    seatDriver.add(headrestDriver);

    // Passenger Seat (Right)
    const seatPass = seatDriver.clone();
    seatPass.position.x = 0.45;

    // Steering Wheel & Dash
    const steeringGeo = new THREE.TorusGeometry(0.16, 0.03, 8, 24);
    const steering = new THREE.Mesh(steeringGeo, carbonMat);
    steering.position.set(-0.45, 0.42, 0.48);
    steering.rotation.x = -Math.PI / 6;

    interiorGroup.add(seatDriver, seatPass, steering);
    carRoot.add(interiorGroup);

    // E. Realistic Multi-Part Engine Bay (Mid/Rear Engine)
    const engineGroup = new THREE.Group();
    engineGroup.position.set(0, 0.65, -1.1);
    engineGroupRef.current = engineGroup;

    // Part 1: Engine Block
    const blockGeo = new THREE.BoxGeometry(0.9, 0.45, 1.0);
    const block = new THREE.Mesh(blockGeo, chromeMat);
    block.castShadow = true;
    engineGroup.add(block);
    enginePartsRef.current["block"] = block;

    // Part 2: Carbon Intake Plenum (Top)
    const intakeGeo = new THREE.BoxGeometry(0.65, 0.2, 0.85);
    const intake = new THREE.Mesh(intakeGeo, carbonMat);
    intake.position.set(0, 0.32, 0);
    engineGroup.add(intake);
    enginePartsRef.current["intake"] = intake;

    // Part 3: Twin Turbochargers (Sides)
    const turbosGroup = new THREE.Group();
    const turboL = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.06, 12, 24), goldAccentMat);
    turboL.position.set(-0.62, 0.1, 0.1);
    turboL.rotation.y = Math.PI / 2;

    const turboR = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.06, 12, 24), goldAccentMat);
    turboR.position.set(0.62, 0.1, 0.1);
    turboR.rotation.y = -Math.PI / 2;

    turbosGroup.add(turboL, turboR);
    engineGroup.add(turbosGroup);
    enginePartsRef.current["turbos"] = turbosGroup;

    // Part 4: Inconel Quad Exhaust Manifold (Rear)
    const exhaustGroup = new THREE.Group();
    for (let i = -1.5; i <= 1.5; i += 1) {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.35, 16), chromeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(i * 0.14, -0.1, -0.65);
      exhaustGroup.add(tip);
    }
    engineGroup.add(exhaustGroup);
    enginePartsRef.current["exhaust"] = exhaustGroup;

    carRoot.add(engineGroup);

    // ─── ANIMATION LOOP ───
    let angle = 0;
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      // Auto-rotation around target
      if (autoRotate && !isDragging.current && viewMode === "exterior") {
        angle += 0.003;
        spherical.current.theta = angle;
      }

      // Compute camera position from spherical coordinates
      const s = spherical.current;
      const x = s.radius * Math.sin(s.phi) * Math.sin(s.theta);
      const y = s.radius * Math.cos(s.phi);
      const z = s.radius * Math.sin(s.phi) * Math.cos(s.theta);

      // Smooth camera interpolation towards target
      camera.position.lerp(new THREE.Vector3(x, Math.max(0.3, y), z), 0.08);
      currentLookAt.current.lerp(targetLookAt.current, 0.08);
      camera.lookAt(currentLookAt.current);

      // Smooth Door Kinematics (Butterfly Door Motion: rotate up Z and out Y)
      const targetDoorAngle = doorsOpen ? 1.15 : 0.0;
      if (leftDoorPivotRef.current && rightDoorPivotRef.current) {
        leftDoorPivotRef.current.rotation.z = THREE.MathUtils.lerp(leftDoorPivotRef.current.rotation.z, -targetDoorAngle, 0.08);
        leftDoorPivotRef.current.rotation.y = THREE.MathUtils.lerp(leftDoorPivotRef.current.rotation.y, targetDoorAngle * 0.45, 0.08);

        rightDoorPivotRef.current.rotation.z = THREE.MathUtils.lerp(rightDoorPivotRef.current.rotation.z, targetDoorAngle, 0.08);
        rightDoorPivotRef.current.rotation.y = THREE.MathUtils.lerp(rightDoorPivotRef.current.rotation.y, -targetDoorAngle * 0.45, 0.08);
      }

      // Smooth Exploded View Disassembly
      const parts = enginePartsRef.current;
      if (parts["intake"]) {
        const targetY = engineExploded ? 0.75 : 0.32;
        parts["intake"].position.y = THREE.MathUtils.lerp(parts["intake"].position.y, targetY, 0.08);
      }
      if (parts["turbos"]) {
        const targetScale = engineExploded ? 1.3 : 1.0;
        parts["turbos"].scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
      }
      if (parts["exhaust"]) {
        const targetZ = engineExploded ? -0.45 : 0.0;
        parts["exhaust"].position.z = THREE.MathUtils.lerp(parts["exhaust"].position.z, targetZ, 0.08);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── RESIZE HANDLER ───
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
    };
  }, [autoRotate, viewMode, doorsOpen, engineExploded, activeColor, activeSeatColor]);

  useEffect(() => {
    initThreeScene();
  }, [initThreeScene]);

  // ─── CAMERA VIEW PRESETS ───
  const switchView = (mode: ViewMode) => {
    setViewMode(mode);
    setAutoRotate(false);

    if (mode === "exterior") {
      spherical.current = { radius: 6.2, theta: 0.8, phi: 1.15 };
      targetLookAt.current.set(0, 0.5, 0);
    } else if (mode === "doors") {
      setDoorsOpen(true);
      spherical.current = { radius: 4.8, theta: 1.45, phi: 1.25 };
      targetLookAt.current.set(0, 0.6, 0.2);
    } else if (mode === "engine") {
      spherical.current = { radius: 3.2, theta: 3.14, phi: 0.95 }; // focus on rear engine bay
      targetLookAt.current.set(0, 0.75, -1.1);
    } else if (mode === "interior") {
      spherical.current = { radius: 1.6, theta: 0.2, phi: 1.3 }; // cockpit close-up
      targetLookAt.current.set(0, 0.7, 0.1);
    }
  };

  // ─── COLOR UPDATES ───
  const changeExteriorPaint = (color: (typeof EXTERIOR_COLORS)[0]) => {
    setActiveColor(color);
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(color.hex);
      bodyMaterialRef.current.metalness = color.metallic;
      bodyMaterialRef.current.roughness = color.roughness;
    }
  };

  const changeSeatUpholstery = (color: (typeof SEAT_COLORS)[0]) => {
    setActiveSeatColor(color);
    if (seatMaterialRef.current) {
      seatMaterialRef.current.color.set(color.hex);
    }
  };

  // ─── MOUSE / TOUCH ORBIT CONTROLS ───
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMousePos.current.x;
    const deltaY = e.clientY - previousMousePos.current.y;

    spherical.current.theta -= deltaX * 0.007;
    spherical.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.current.phi - deltaY * 0.007));

    previousMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    spherical.current.radius = Math.max(1.8, Math.min(10.0, spherical.current.radius + e.deltaY * 0.005));
  };

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 transition-all ${
        fullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[620px] md:h-[680px]"
      }`}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <Badge className="bg-slate-900/90 backdrop-blur-md text-gold border-gold/40 px-3 py-1 font-semibold flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold animate-pulse" />
            3D Studio CAD Viewer
          </Badge>
          <span className="text-xs text-slate-400 hidden sm:inline-block bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-sm">
            Drag to Orbit • Scroll to Zoom
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`border-slate-700 bg-slate-900/80 backdrop-blur-sm text-xs ${
              autoRotate ? "text-gold border-gold/50" : "text-slate-300"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            {autoRotate ? "Auto Rotating" : "Paused"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setFullscreen(!fullscreen)}
            className="border-slate-700 bg-slate-900/80 backdrop-blur-sm text-slate-300 hover:text-white"
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Primary Interaction Dock (View Modes) */}
      <div className="absolute top-16 left-4 flex flex-wrap gap-2 pointer-events-auto">
        <Button
          size="sm"
          variant={viewMode === "exterior" ? "default" : "secondary"}
          onClick={() => switchView("exterior")}
          className={`text-xs backdrop-blur-md ${
            viewMode === "exterior" ? "gradient-gold text-slate-950 font-bold" : "bg-slate-900/80 text-slate-300 border border-slate-800"
          }`}
        >
          <Eye className="h-3.5 w-3.5 mr-1.5" />
          Exterior 360°
        </Button>

        <Button
          size="sm"
          variant={viewMode === "doors" ? "default" : "secondary"}
          onClick={() => {
            switchView("doors");
            setDoorsOpen(!doorsOpen);
          }}
          className={`text-xs backdrop-blur-md ${
            viewMode === "doors" ? "gradient-gold text-slate-950 font-bold" : "bg-slate-900/80 text-slate-300 border border-slate-800"
          }`}
        >
          <Sliders className="h-3.5 w-3.5 mr-1.5" />
          {doorsOpen ? "Close Doors" : "Open Butterfly Doors"}
        </Button>

        <Button
          size="sm"
          variant={viewMode === "engine" ? "default" : "secondary"}
          onClick={() => switchView("engine")}
          className={`text-xs backdrop-blur-md ${
            viewMode === "engine" ? "gradient-gold text-slate-950 font-bold" : "bg-slate-900/80 text-slate-300 border border-slate-800"
          }`}
        >
          <Layers className="h-3.5 w-3.5 mr-1.5" />
          Inspect Engine
        </Button>

        <Button
          size="sm"
          variant={viewMode === "interior" ? "default" : "secondary"}
          onClick={() => switchView("interior")}
          className={`text-xs backdrop-blur-md ${
            viewMode === "interior" ? "gradient-gold text-slate-950 font-bold" : "bg-slate-900/80 text-slate-300 border border-slate-800"
          }`}
        >
          <Info className="h-3.5 w-3.5 mr-1.5" />
          Cockpit & Seats
        </Button>
      </div>

      {/* Engine Disassembly Floating Panel */}
      <AnimatePresence>
        {viewMode === "engine" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute left-4 bottom-24 max-w-sm bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-white pointer-events-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-gold tracking-wider">
                V12 / W16 Hypercar Engine
              </span>
              <Button
                size="sm"
                variant={engineExploded ? "destructive" : "outline"}
                onClick={() => setEngineExploded(!engineExploded)}
                className={`text-xs h-7 px-2.5 ${!engineExploded ? "border-gold/60 text-gold" : ""}`}
              >
                {engineExploded ? "Reassemble Engine" : "⚡ Exploded View"}
              </Button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Click individual powertrain components to inspect metallurgy and engineering specifications:
            </p>

            <div className="grid grid-cols-2 gap-1.5">
              {ENGINE_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedPart(part)}
                  className={`text-left p-2 rounded-lg text-xs transition border ${
                    selectedPart?.id === part.id
                      ? "bg-gold/20 border-gold text-white font-medium"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <p className="font-semibold text-[11px] truncate">{part.name}</p>
                  <p className="text-[10px] text-slate-400">{part.material}</p>
                </button>
              ))}
            </div>

            {selectedPart && (
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs">
                <p className="font-bold text-gold">{selectedPart.name}</p>
                <p className="text-[11px] text-slate-300 font-mono mt-0.5">{selectedPart.spec}</p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{selectedPart.desc}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interior & Cockpit Leather Panel */}
      <AnimatePresence>
        {viewMode === "interior" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute left-4 bottom-24 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 text-white pointer-events-auto shadow-2xl max-w-xs"
          >
            <span className="text-xs uppercase font-bold text-gold tracking-wider block mb-1">
              Bespoke Seat Upholstery
            </span>
            <p className="text-xs text-slate-400 mb-3">
              Hand-stitched Italian leather options for sports carbon bucket seats:
            </p>
            <div className="flex gap-2">
              {SEAT_COLORS.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => changeSeatUpholstery(seat)}
                  title={seat.name}
                  className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                    activeSeatColor.id === seat.id ? "border-gold scale-110 shadow-lg" : "border-slate-700"
                  }`}
                  style={{ backgroundColor: seat.hex }}
                >
                  {activeSeatColor.id === seat.id && <Check className="h-4 w-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-300 mt-2 font-medium">{activeSeatColor.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Color Palette Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl px-4 py-2.5 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Exterior Paint:
          </span>
          <div className="flex items-center gap-2">
            {EXTERIOR_COLORS.map((color) => (
              <button
                key={color.id}
                onClick={() => changeExteriorPaint(color)}
                title={color.name}
                className={`w-7 h-7 rounded-full border-2 transition transform hover:scale-110 flex items-center justify-center ${
                  activeColor.id === color.id ? "border-gold scale-110 shadow-lg" : "border-slate-700"
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {activeColor.id === color.id && <Check className="h-3.5 w-3.5 text-white drop-shadow" />}
              </button>
            ))}
          </div>
          <span className="text-xs text-white font-medium hidden md:inline-block">
            {activeColor.name}
          </span>
        </div>

        {/* Custom CAD / .GLB Import Hook */}
        <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-gold cursor-pointer transition border border-dashed border-slate-700 hover:border-gold/50 rounded-lg px-3 py-1.5">
          <Upload className="h-3.5 w-3.5" />
          <span>{cadFileName ? cadFileName : "Drop AutoCAD .GLB"}</span>
          <input
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setCadFileName(file.name);
            }}
          />
        </label>
      </div>
    </div>
  );
}
