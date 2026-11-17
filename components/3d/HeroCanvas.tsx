"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── 1. Scene & Camera Setup ──
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080c, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 6.0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // ── 2. Topographic Contour Line Mesh (Drawn from Poster Identity) ──
    const waveGeo = new THREE.PlaneGeometry(18, 14, 96, 72);
    const waveUniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
    };

    const waveMat = new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      uniforms: waveUniforms,
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uScroll;
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          vec3 pos = position;

          // Topographic wave contours matching the fest poster
          float wave1 = sin(pos.x * 0.45 + uTime * 0.35 + pos.y * 0.28) * 0.32;
          float wave2 = cos(pos.y * 0.55 - uTime * 0.28 + pos.x * 0.22) * 0.24;
          float dist = length(pos.xy);
          float wave3 = sin(dist * 0.95 - uTime * 0.5) * 0.16;

          // Subtle cursor displacement
          float mouseDist = length(pos.xy - vec3(uMouse * 3.5, 0.0).xy);
          float mouseWave = sin(mouseDist * 1.4 - uTime * 1.1) * exp(-mouseDist * 0.55) * 0.22;

          pos.z += wave1 + wave2 + wave3 + mouseWave - (uScroll * 0.35);
          vElevation = pos.z;
          vPosition = pos;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vPosition;
        varying float vElevation;

        void main() {
          // Deep ink base blended with electric teal lines
          vec3 deepInk = vec3(0.024, 0.031, 0.047); // #06080C
          vec3 tealLine = vec3(0.071, 0.643, 0.769); // #12A4C4

          float factor = smoothstep(-0.4, 0.6, vElevation);
          vec3 finalColor = mix(deepInk, tealLine, factor * 0.75);

          // Feather edges smoothly
          float edgeFade = smoothstep(7.0, 1.2, length(vPosition.xy));
          float alpha = edgeFade * 0.16;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
    });

    const waveMesh = new THREE.Mesh(waveGeo, waveMat);
    waveMesh.position.set(0, -0.6, -2.2);
    waveMesh.rotation.x = -Math.PI / 3.3;
    scene.add(waveMesh);

    // ── 3. Multi-Tone Floating 3D Perimeter Sculptures (Zenith Inspiration) ──
    const isMobile = container.clientWidth < 768;
    const sculptGroup = new THREE.Group();
    scene.add(sculptGroup);

    // A. Left Sculpt: Glossy Royal Violet Ribbon / Torus Knot (#5145CD)
    const violetGeo = new THREE.TorusKnotGeometry(0.72, 0.22, 100, 24, 2, 3);
    const violetMat = new THREE.MeshStandardMaterial({
      color: 0x5145cd,
      roughness: 0.28,
      metalness: 0.2,
      emissive: 0x22187a,
      emissiveIntensity: 0.35,
    });
    const violetSculpt = new THREE.Mesh(violetGeo, violetMat);
    violetSculpt.position.set(isMobile ? -3.4 : -3.6, isMobile ? 0.8 : 0.4, 0.2);
    violetSculpt.rotation.set(0.6, 0.4, 0.2);
    violetSculpt.scale.setScalar(isMobile ? 0.75 : 1.05);
    sculptGroup.add(violetSculpt);

    // B. Top Sculpt: Glossy Coral / Pink Ribbon (#F43F5E)
    const coralGeo = new THREE.TorusGeometry(0.85, 0.2, 24, 64, Math.PI * 1.5);
    const coralMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.3,
      metalness: 0.15,
      emissive: 0x7f1d2d,
      emissiveIntensity: 0.3,
    });
    const coralSculpt = new THREE.Mesh(coralGeo, coralMat);
    coralSculpt.position.set(isMobile ? 0.2 : -0.4, isMobile ? 2.6 : 2.5, -0.4);
    coralSculpt.rotation.set(-0.8, 0.3, -0.4);
    coralSculpt.scale.setScalar(isMobile ? 0.7 : 0.95);
    sculptGroup.add(coralSculpt);

    // C. Right Sculpt: Glossy Emerald Green 4-Leaf Clover / Petal Sculpt (#10B981)
    // Modeled with a torusknot with 4 lobes
    const mintGeo = new THREE.TorusKnotGeometry(0.78, 0.24, 100, 24, 1, 4);
    const mintMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.25,
      metalness: 0.18,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
    });
    const mintSculpt = new THREE.Mesh(mintGeo, mintMat);
    mintSculpt.position.set(isMobile ? 3.4 : 3.7, isMobile ? -0.8 : -0.3, 0.3);
    mintSculpt.rotation.set(0.3, -0.5, 0.4);
    mintSculpt.scale.setScalar(isMobile ? 0.75 : 1.05);
    sculptGroup.add(mintSculpt);

    // ── 4. Multi-Tone Lighting Setup ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Key directional light (Electric Cyan)
    const cyanLight = new THREE.DirectionalLight(0x12a4c4, 2.0);
    cyanLight.position.set(4, 5, 4);
    scene.add(cyanLight);

    // Soft Violet Point Light (near left sculpt)
    const violetPoint = new THREE.PointLight(0x6366f1, 2.8, 10);
    violetPoint.position.set(-4, 1, 2);
    scene.add(violetPoint);

    // Soft Mint Point Light (near right sculpt)
    const mintPoint = new THREE.PointLight(0x00ff9d, 2.5, 10);
    mintPoint.position.set(4, -1, 2);
    scene.add(mintPoint);

    // Soft Coral Point Light (near top sculpt)
    const coralPoint = new THREE.PointLight(0xf43f5e, 2.2, 10);
    coralPoint.position.set(0, 3, 2);
    scene.add(coralPoint);

    // ── 5. Mouse Damping & Scroll Handling ──
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (e.clientX - halfW) / halfW;
      targetMouseY = (e.clientY - halfH) / halfH;
      waveUniforms.uMouse.value.set(targetMouseX, targetMouseY);
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
      waveUniforms.uScroll.value = scrollY * 0.0012;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const mob = w < 768;
      violetSculpt.position.set(mob ? -3.4 : -3.6, mob ? 0.8 : 0.4, 0.2);
      violetSculpt.scale.setScalar(mob ? 0.75 : 1.05);
      coralSculpt.position.set(mob ? 0.2 : -0.4, mob ? 2.6 : 2.5, -0.4);
      coralSculpt.scale.setScalar(mob ? 0.7 : 0.95);
      mintSculpt.position.set(mob ? 3.4 : 3.7, mob ? -0.8 : -0.3, 0.3);
      mintSculpt.scale.setScalar(mob ? 0.75 : 1.05);
    };
    window.addEventListener("resize", handleResize);

    // ── 6. Animation Loop ──
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      waveUniforms.uTime.value = elapsedTime;

      // Mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;

      // Gentle continuous rotation & floating motion for 3D sculpts
      violetSculpt.rotation.x = 0.6 + Math.sin(elapsedTime * 0.5) * 0.2;
      violetSculpt.rotation.y = elapsedTime * 0.35;
      violetSculpt.position.y = (isMobile ? 0.8 : 0.4) + Math.sin(elapsedTime * 0.7) * 0.12;

      coralSculpt.rotation.y = elapsedTime * 0.28;
      coralSculpt.rotation.z = -0.4 + Math.cos(elapsedTime * 0.45) * 0.15;
      coralSculpt.position.y = (isMobile ? 2.6 : 2.5) + Math.cos(elapsedTime * 0.6) * 0.1;

      mintSculpt.rotation.x = 0.3 + Math.sin(elapsedTime * 0.4) * 0.18;
      mintSculpt.rotation.y = -elapsedTime * 0.32;
      mintSculpt.position.y = (isMobile ? -0.8 : -0.3) + Math.sin(elapsedTime * 0.65) * 0.12;

      // Camera parallax following mouse
      camera.position.x = currentMouseX * 0.25;
      camera.position.y = -currentMouseY * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      violetGeo.dispose();
      violetMat.dispose();
      coralGeo.dispose();
      coralMat.dispose();
      mintGeo.dispose();
      mintMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden"
      aria-hidden="true"
    />
  );
}
