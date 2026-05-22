import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { IndigenousGroup } from '../data/indigenousData';
import { Loader2, RotateCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface ThreeGlobeProps {
  groups: IndigenousGroup[];
  activeGroupId: string;
  onSelectGroup: (id: string) => void;
}

export default function ThreeGlobe({ groups, activeGroupId, onSelectGroup }: ThreeGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredGroup, setHoveredGroup] = useState<IndigenousGroup | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Keep mutable references for the animation loop
  const stateRef = useRef({
    activeGroupId,
    groups,
    isRotating,
    targetRotationX: 0,
    targetRotationY: 0,
    currentRotationX: 0,
    currentRotationY: 0,
  });

  // Keep state updated for the ref
  useEffect(() => {
    stateRef.current.activeGroupId = activeGroupId;
    stateRef.current.groups = groups;
    stateRef.current.isRotating = isRotating;

    // Calculate target rotation to bring coordinates front-and-center when active group changes
    const active = groups.find(g => g.id === activeGroupId);
    if (active) {
      // Latitude: north-south rotation on X axis
      // Longitude: east-west rotation on Y axis
      const latRad = (active.location.latitude * Math.PI) / 180;
      const lonRad = (active.location.longitude * Math.PI) / 180;

      // Map spherical coords to target rotation angles
      stateRef.current.targetRotationX = latRad;
      // Subtracting PI/2 to rotate standard front to camera view
      stateRef.current.targetRotationY = -lonRad;
    }
  }, [activeGroupId, groups, isRotating]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent background to blend with dark tactical panel

    // Camera setup
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.z = 11;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Spherical base radius in Three units
    const GLOBE_RADIUS = 3.8;

    // 1. Solid Dark Core to mask backend coordinates (visual occlusion)
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.02, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x07070a,
      transparent: false,
      opacity: 1.0,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // 2. High-Tech Tactical Grid Shell
    const gridGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 30, 15);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x27272a, // dark zinc-800
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // 3. Highlighted Equator Circle
    const equatorRadius = GLOBE_RADIUS + 0.01;
    const equatorGeo = new THREE.RingGeometry(equatorRadius, equatorRadius + 0.02, 64);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // tactical blue
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2; // Lie flat across equator
    globeGroup.add(equator);

    // Helper: Convert Lat & Long to 3D Cartesian coordinates
    const latLongToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(radius * Math.sin(phi) * Math.sin(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);

      return new THREE.Vector3(x, y, z);
    };

    // Keep dynamic map of node meshes to reference active highlight or raycasting
    const nodeMeshes: { mesh: THREE.Mesh; group: IndigenousGroup }[] = [];

    // 4. Plot Indigenous Groups onto the Globe
    groups.forEach(group => {
      const pos = latLongToVector3(group.location.latitude, group.location.longitude, GLOBE_RADIUS + 0.04);
      
      // Node marker geometry
      const nodeGeo = new THREE.SphereGeometry(0.07, 16, 16);
      
      // Tactical color representation based on category or custom status
      const dotColor = group.category === 'Indigenous' ? 0x3b82f6 : // Blue
                       group.category === 'Stateless' ? 0xef4444 : // Red
                       0xf59e0b; // Yellow-Orange

      const nodeMat = new THREE.MeshBasicMaterial({
        color: dotColor,
        transparent: true,
        opacity: 0.9,
      });

      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      
      // Save reference to metadata for clicks
      nodeMesh.userData = { groupId: group.id };
      
      globeGroup.add(nodeMesh);
      nodeMeshes.push({ mesh: nodeMesh, group });
    });

    // 5. Active Target Highlight Beacon (Vertical Light Beam & Pulsing concentric flat ring on surface)
    const ringGeo = new THREE.RingGeometry(0.12, 0.16, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const activeTargetRing = new THREE.Mesh(ringGeo, ringMat);
    globeGroup.add(activeTargetRing);

    // Emissive cylindrical laser beam pointing outwards
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.06, 1.4, 8, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
      wireframe: true
    });
    const activeTargetBeam = new THREE.Mesh(beamGeo, beamMat);
    // Move cylinder center points outward so base lies on globe surface
    beamGeo.translate(0, 0.7, 0);
    globeGroup.add(activeTargetBeam);

    setLoading(false);

    // Track user drag controls manually (100% reliable local mechanism)
    let isDragging = false;
    let isCentering = false;
    let lastProcessedGroupId = activeGroupId;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let autoRotateTimerTimer: any = null;

    const handleMouseDown = (e: MouseEvent) => {
      // Raycasting support
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      // Calculate intersection on nodeMeshes
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        const hitGroupId = intersects[0].object.userData.groupId;
        if (hitGroupId) {
          onSelectGroup(hitGroupId);
          isCentering = true;
          setIsRotating(false);
          return;
        }
      }

      isDragging = true;
      isCentering = false; // Overridden by manual dragging
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsRotating(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Raycasting hover state
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));
      if (intersects.length > 0) {
        const hitGroupId = intersects[0].object.userData.groupId;
        const matchingGroup = stateRef.current.groups.find(g => g.id === hitGroupId);
        if (matchingGroup) {
          setHoveredGroup(matchingGroup);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredGroup(null);
        document.body.style.cursor = 'default';
      }

      if (!isDragging) return;

      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      // Rotate around sphere center
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;

      // Constrain polar angle on X (tilt)
      globeGroup.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, globeGroup.rotation.x));

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // Sync active state target rotation values to match current position so it doesn't instantly snap back
      stateRef.current.currentRotationX = globeGroup.rotation.x;
      stateRef.current.currentRotationY = globeGroup.rotation.y;
    };

    const handleMouseUp = () => {
      isDragging = false;
      // Restart rotation after a delay of inactivity
      clearTimeout(autoRotateTimerTimer);
      autoRotateTimerTimer = setTimeout(() => {
        setIsRotating(true);
      }, 7000);
    };

    // Dynamic scale zoom on Wheel interaction
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * -0.001;
      const nextScale = globeGroup.scale.x + zoomFactor;
      const clampedScale = Math.max(0.65, Math.min(3.5, nextScale));
      globeGroup.scale.set(clampedScale, clampedScale, clampedScale);
    };

    // Touch Support for mobile
    let touchStartDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      setIsRotating(false);
      isCentering = false; // Overridden by touch interaction
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        // Multi-touch Pinch zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;

        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
        globeGroup.rotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, globeGroup.rotation.x));

        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;

        stateRef.current.currentRotationX = globeGroup.rotation.x;
        stateRef.current.currentRotationY = globeGroup.rotation.y;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (touchStartDist > 0) {
          const deltaZoom = (dist - touchStartDist) * 0.005;
          const targetScale = globeGroup.scale.x + deltaZoom;
          const clampedScale = Math.max(0.6, Math.min(3.5, targetScale));
          globeGroup.scale.set(clampedScale, clampedScale, clampedScale);
          touchStartDist = dist;
        }
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      touchStartDist = 0;
      clearTimeout(autoRotateTimerTimer);
      autoRotateTimerTimer = setTimeout(() => {
        setIsRotating(true);
      }, 7500);
    };

    // Attach Event Listeners
    const targetElement = renderer.domElement;
    targetElement.addEventListener('mousedown', handleMouseDown);
    targetElement.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    targetElement.addEventListener('wheel', handleWheel, { passive: false });
    
    targetElement.addEventListener('touchstart', handleTouchStart);
    targetElement.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // Initial values helper
    let frameId: number;
    let pulseTime = 0;

    // 6. ANIMATION LOOP
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      pulseTime += 0.035;

      const activeGroupObj = stateRef.current.groups.find(g => g.id === stateRef.current.activeGroupId);
      
      // Update target positions & beam mesh on active state
      if (activeGroupObj) {
        const activePos = latLongToVector3(
          activeGroupObj.location.latitude, 
          activeGroupObj.location.longitude, 
          GLOBE_RADIUS + 0.02
        );

        activeTargetRing.visible = true;
        activeTargetBeam.visible = true;

        // Position & orient ring/beam to face directly outwards from Earth core
        activeTargetRing.position.copy(activePos);
        activeTargetBeam.position.copy(activePos);

        // Point cylinder and concentric rings away from the sphere's origin
        const lookTarget = activePos.clone().multiplyScalar(1.5);
        activeTargetRing.lookAt(lookTarget);
        activeTargetRing.rotation.x += Math.PI / 2; // Flat on mesh surface

        activeTargetBeam.lookAt(lookTarget);
        activeTargetBeam.rotation.x += Math.PI / 2; // Project outward

        // Animate pulse scale & glow strength
        const ringScale = 1.0 + Math.sin(pulseTime * 2.5) * 0.15;
        activeTargetRing.scale.set(ringScale, ringScale, ringScale);

        // Customize beacon color to fit group
        const targetColorHex = activeGroupObj.category === 'Indigenous' ? 0x3b82f6 : 
                              activeGroupObj.category === 'Stateless' ? 0xef4444 : 0xf59e0b;
        
        // Emissive-like pulsing
        (activeTargetRing.material as THREE.MeshBasicMaterial).color.setHex(targetColorHex);
        (activeTargetBeam.material as THREE.MeshBasicMaterial).color.setHex(targetColorHex);
        (activeTargetBeam.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(pulseTime * 3) * 0.18;
      } else {
        activeTargetRing.visible = false;
        activeTargetBeam.visible = false;
      }

      // Track and detect change in active group
      const currentActiveGroupId = stateRef.current.activeGroupId;
      if (currentActiveGroupId !== lastProcessedGroupId) {
        lastProcessedGroupId = currentActiveGroupId;
        if (currentActiveGroupId) {
          isCentering = true;
          setIsRotating(false);
        }
      }

      // Smooth camera interpolation / Auto-spin centering
      if (!isDragging) {
        if (isCentering) {
          const targetY = stateRef.current.targetRotationY;
          const targetX = stateRef.current.targetRotationX;

          // Shortest path angle interpolation (avoiding infinite spin wrapping)
          let diffY = targetY - globeGroup.rotation.y;
          diffY = Math.atan2(Math.sin(diffY), Math.cos(diffY));

          let diffX = targetX - globeGroup.rotation.x;
          diffX = Math.atan2(Math.sin(diffX), Math.cos(diffX));

          // Smooth lerp for rotations
          globeGroup.rotation.y += diffY * 0.075;
          globeGroup.rotation.x += diffX * 0.075;

          // If close enough, lock and stop fighting to prevent vibration & allow dragging elsewhere
          if (Math.abs(diffY) < 0.002 && Math.abs(diffX) < 0.002) {
            globeGroup.rotation.y = targetY;
            globeGroup.rotation.x = targetX;
            isCentering = false;
          }

          stateRef.current.currentRotationX = globeGroup.rotation.x;
          stateRef.current.currentRotationY = globeGroup.rotation.y;
        } else if (stateRef.current.isRotating) {
          // Slow Idle rotation on Y axis when not active or focusing
          globeGroup.rotation.y += 0.0016;
          // Slowly bleed tilt back to horizontal meridian
          globeGroup.rotation.x += (0.05 - globeGroup.rotation.x) * 0.015;
          
          stateRef.current.currentRotationX = globeGroup.rotation.x;
          stateRef.current.currentRotationY = globeGroup.rotation.y;
        }
      }

      // Sync Node opacities (highlight hovered group)
      nodeMeshes.forEach(item => {
        const isSelected = item.group.id === stateRef.current.activeGroupId;
        const isHovered = hoveredGroup && item.group.id === hoveredGroup.id;
        
        if (isSelected) {
          (item.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
          item.mesh.scale.set(1.4, 1.4, 1.4);
        } else if (isHovered) {
          (item.mesh.material as THREE.MeshBasicMaterial).opacity = 1.0;
          item.mesh.scale.set(1.5, 1.5, 1.5);
        } else {
          (item.mesh.material as THREE.MeshBasicMaterial).opacity = 0.65;
          item.mesh.scale.set(1.0, 1.0, 1.0);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // CLEANUP
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(autoRotateTimerTimer);
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      targetElement.removeEventListener('mousedown', handleMouseDown);
      targetElement.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      targetElement.removeEventListener('touchstart', handleTouchStart);
      targetElement.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      gridGeo.dispose();
      gridMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      equatorGeo.dispose();
      equatorMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      
      nodeMeshes.forEach(item => {
        item.mesh.geometry.dispose();
        (item.mesh.material as THREE.Material).dispose();
      });

      renderer.dispose();
    };
  }, [groups]);

  // Handle Quick UI Buttons
  const triggerZoomIn = () => {
    if (!containerRef.current) return;
    const canvas = containerRef.current.querySelector('canvas');
    if (canvas) {
      const zoomEvent = new WheelEvent('wheel', { deltaY: -150 });
      canvas.dispatchEvent(zoomEvent);
    }
  };

  const triggerZoomOut = () => {
    if (!containerRef.current) return;
    const canvas = containerRef.current.querySelector('canvas');
    if (canvas) {
      const zoomEvent = new WheelEvent('wheel', { deltaY: 150 });
      canvas.dispatchEvent(zoomEvent);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing bg-[#030304]">
      
      {/* 3D Render Canvas container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 z-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
          <p className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase">Compiling Spherical Coordinate Matrices...</p>
        </div>
      )}

      {/* Floating Tactical Overlay Map Legend */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none p-3.5 rounded border border-zinc-800 bg-[#09090b]/92 max-w-[210px] leading-relaxed">
        <div className="flex items-center gap-1.5 mb-2 border-b border-zinc-805 pb-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-zinc-200">Globe HUD Telemetry</span>
        </div>
        
        <div className="space-y-1.5 text-[9px] font-mono">
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Coordinate Proj:</span>
            <span className="text-zinc-300">UTM-3D</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Active Sensor:</span>
            <span className="text-blue-400">PULSE_BEACON</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500">Rotation Model:</span>
            <span className="text-zinc-300">{isRotating ? 'STABLE IDLE' : 'MANUAL_LOCK'}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[8px] border-t border-zinc-800 text-zinc-500 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span>Indigenous Group Coordinates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>Stateless Population Nodes</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Isolated Clan Boundaries</span>
          </div>
        </div>
      </div>

      {/* Interactive Hover Tooltip inside canvas */}
      {hoveredGroup && (
        <div 
          className="absolute z-30 bottom-16 left-4 p-3 rounded.5 border border-zinc-800 bg-[#09090b]/98 max-w-[240px] shadow-2xl transition-all duration-150 animate-fade-in"
          style={{ pointerEvents: 'none' }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-1.5 mb-1.5">
            <span className="font-bold text-xs font-mono text-zinc-100">{hoveredGroup.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-zinc-800 text-blue-400">
              {hoveredGroup.category}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 leading-normal mb-1">
            {hoveredGroup.familyName} • {hoveredGroup.region}
          </div>
          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-relaxed italic">
            {hoveredGroup.metadata.summary}
          </p>
          <div className="mt-2 text-[8px] font-mono text-blue-400 uppercase tracking-widest text-right">
            Click to Lock and Open Details
          </div>
        </div>
      )}

      {/* Globe Manipulation Panel (Tactical Floating Buttons) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 p-1 rounded border border-zinc-800 bg-[#09090b]/90 pointer-events-auto">
        <button 
          onClick={triggerZoomIn}
          title="Zoom In" 
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={triggerZoomOut}
          title="Zoom Out" 
          className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-3.5 bg-zinc-800 mx-0.5" />
        <button 
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? "Pause Idle Spin" : "Resume Idle Spin"} 
          className={`p-1.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-zinc-800 ${isRotating ? 'text-blue-400' : 'text-zinc-500'}`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin-slow' : ''}`} />
          <span>{isRotating ? 'Locking off' : 'Auto lock'}</span>
        </button>
      </div>

    </div>
  );
}
