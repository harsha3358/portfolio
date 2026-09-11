"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, PerspectiveCamera } from "@react-three/drei";
import { damp, easeOutCubic, mapRange, smoothstep } from "@/lib/laptopMath";
import { personal } from "@/lib/data";
import { CODE_BG, CODE_BG_HEADER, CODE_COLORS } from "@/lib/codeHighlight";

const BASE_WIDTH = 2.6;
const BASE_HEIGHT = 0.09;
const BASE_DEPTH = 1.7;
const LID_HEIGHT = 0.06;
const MAX_OPEN_DEG = 112;

// Camera framing: a wide three-quarter "product shot" pose for the closed/opening
// laptop, blending into a close pose aimed through the open screen as we approach.
const WIDE_POS = new THREE.Vector3(2.15, 0.98, 3.7);
const WIDE_TARGET = new THREE.Vector3(0, -0.02, 0);
const CLOSE_POS = new THREE.Vector3(0, 0.9, -1.0);
const CLOSE_TARGET = new THREE.Vector3(0, 0.9, -1.4);

const _pos = new THREE.Vector3();
const _target = new THREE.Vector3();

function useKeyboardTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#141417";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cols = 15;
    const rows = 6;
    const padX = 40;
    const padY = 30;
    const gap = 6;
    const cellW = (canvas.width - padX * 2) / cols;
    const cellH = (canvas.height - padY * 2 - 60) / rows;

    ctx.fillStyle = "#232327";
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = padX + c * cellW + gap / 2;
        const y = padY + r * cellH + gap / 2;
        const w = cellW - gap;
        const h = cellH - gap;
        const radius = 4;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.fill();
      }
    }

    ctx.fillStyle = "#1c1c20";
    const padW = canvas.width * 0.32;
    const padH = 46;
    ctx.beginPath();
    const px = (canvas.width - padW) / 2;
    const py = canvas.height - padH - 14;
    const radius = 8;
    ctx.moveTo(px + radius, py);
    ctx.arcTo(px + padW, py, px + padW, py + padH, radius);
    ctx.arcTo(px + padW, py + padH, px, py + padH, radius);
    ctx.arcTo(px, py + padH, px, py, radius);
    ctx.arcTo(px, py, px + padW, py, radius);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

export default function LaptopScene({
  progressRef,
  reducedMotion,
}: {
  progressRef: { current: number };
  reducedMotion: boolean;
}) {
  const smoothed = useRef(0);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const lidPivotRef = useRef<THREE.Group>(null);
  const screenMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const clock = useRef(0);

  const keyboardTexture = useKeyboardTexture();
  const { camera } = useThree();

  useFrame((_, delta) => {
    clock.current += delta;

    const targetProgress = progressRef.current;
    smoothed.current = reducedMotion
      ? targetProgress
      : damp(smoothed.current, targetProgress, 12, delta);
    const p = smoothed.current;

    const openDeg = MAX_OPEN_DEG * easeOutCubic(mapRange(p, 0, 0.85, 0, 1));
    if (lidPivotRef.current) {
      lidPivotRef.current.rotation.x = -((openDeg * Math.PI) / 180);
    }

    const brightness = smoothstep(0.28, 0.68, p);
    if (screenMatRef.current) {
      screenMatRef.current.emissiveIntensity = brightness * 1.6;
    }

    const identityOpacity = smoothstep(0.55, 0.8, p);
    if (identityRef.current) {
      identityRef.current.style.opacity = String(identityOpacity);
    }

    if (hintRef.current) {
      hintRef.current.style.opacity = String(1 - smoothstep(0, 0.04, p));
    }

    const driftX = reducedMotion ? 0 : Math.sin(clock.current * 0.25) * 0.06;
    const driftY = reducedMotion ? 0 : Math.cos(clock.current * 0.2) * 0.04;

    const approach = easeOutCubic(smoothstep(0.85, 1, p));

    _pos.copy(WIDE_POS).lerp(CLOSE_POS, approach);
    _pos.x += driftX * (1 - approach);
    _pos.y += driftY * (1 - approach);

    _target.copy(WIDE_TARGET).lerp(CLOSE_TARGET, approach);

    const cam = cameraRef.current ?? camera;
    if (cam) {
      cam.position.copy(_pos);
      cam.lookAt(_target);
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault fov={30} position={WIDE_POS.toArray()} />

      <ambientLight intensity={0.85} color="#cfd6e6" />
      <directionalLight position={[3, 4, 2]} intensity={2.6} color="#fff4e0" castShadow />
      <pointLight position={[-2.5, 1.5, -1]} intensity={1.1} color="#cf9a52" />
      <pointLight position={[1.5, 0.4, 3]} intensity={0.6} color="#8fb3ff" />

      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[BASE_WIDTH, BASE_HEIGHT, BASE_DEPTH]} />
          <meshStandardMaterial color="#2c2c31" metalness={0.5} roughness={0.4} />
        </mesh>

        {/* Keyboard deck surface */}
        {keyboardTexture && (
          <mesh position={[0, BASE_HEIGHT / 2 + 0.001, -0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[BASE_WIDTH - 0.2, BASE_DEPTH - 0.25]} />
            <meshStandardMaterial map={keyboardTexture} roughness={0.8} metalness={0.1} />
          </mesh>
        )}

        {/* Lid pivot at back hinge edge */}
        <group position={[0, BASE_HEIGHT / 2, -BASE_DEPTH / 2]} ref={lidPivotRef}>
          {/* Lid bezel */}
          <mesh position={[0, 0, BASE_DEPTH / 2]} castShadow>
            <boxGeometry args={[BASE_WIDTH, LID_HEIGHT, BASE_DEPTH]} />
            <meshStandardMaterial color="#17171a" metalness={0.75} roughness={0.3} />
          </mesh>

          {/* Screen + identity content, on the inner face of the lid */}
          <group
            position={[0, -LID_HEIGHT / 2 - 0.001, BASE_DEPTH / 2]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <mesh>
              <planeGeometry args={[BASE_WIDTH - 0.18, BASE_DEPTH - 0.14]} />
              <meshStandardMaterial
                ref={screenMatRef}
                color="#050506"
                emissive="#e8c893"
                emissiveIntensity={0}
                roughness={0.15}
                metalness={0.1}
              />
            </mesh>

            <Html
              transform
              occlude={false}
              distanceFactor={1.55}
              position={[0, 0, 0.001]}
              style={{ pointerEvents: "none" }}
            >
              <div
                ref={identityRef}
                style={{
                  opacity: 0,
                  width: "440px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  fontFamily: "var(--font-sans, sans-serif)",
                  boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)",
                  background: CODE_BG,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 14px",
                    background: CODE_BG_HEADER,
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ marginLeft: 6, fontSize: "11px", color: CODE_COLORS.punct, fontFamily: "var(--font-mono, monospace)" }}>
                    harsha3358 — whoami
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "14px",
                    color: "#111111",
                    textAlign: "center",
                    padding: "32px 24px",
                  }}
                >
                  <div
                    style={{
                      width: "88px",
                      height: "88px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #cf9a52, #8a5f2b)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "42px",
                      lineHeight: 1,
                      boxShadow: "0 0 40px rgba(207,154,82,0.45)",
                    }}
                  >
                    🙂
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 600, letterSpacing: "0.5px" }}>
                    {personal.displayName}
                  </div>
                  <div style={{ fontSize: "14px", color: "#3a3a3a", letterSpacing: "0.5px" }}>
                    {personal.role}
                  </div>
                </div>
              </div>
            </Html>
          </group>
        </group>
      </group>

      <ContactShadows position={[0, -0.05, 0]} opacity={0.5} scale={5} blur={2.2} far={1.5} />

      <Html fullscreen style={{ pointerEvents: "none" }}>
        <div
          ref={hintRef}
          style={{
            position: "absolute",
            bottom: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#9a9aa3",
            fontSize: "12px",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          scroll to open
        </div>
      </Html>
    </>
  );
}
