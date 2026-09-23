"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_resolution;
uniform float u_time;

// Fast hash
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// 2D Perlin-style noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Broad liquid silk drapery with sweeping domain warping
float silkHeight(vec2 p_uv, float t) {
  // Scale for broad, elegant drapery folds across the viewport
  vec2 p = p_uv * 1.35;

  // Primary slow-rolling fluid warp field
  vec2 w1 = vec2(
    sin(p.y * 1.4 + t * 0.16 + 0.8),
    cos(p.x * 1.2 - t * 0.13 + 1.4)
  );

  // Secondary subtle organic turbulence
  vec2 w2 = vec2(
    sin((p.x + w1.x * 0.85) * 2.0 + t * 0.20),
    cos((p.y + w1.y * 0.85) * 1.8 - t * 0.15)
  );

  // Fabric folds: sweeping diagonal ridges with graceful undulations
  float f1 = sin(p.x * 1.5 + p.y * 1.05 + w2.x * 1.35 + t * 0.18);
  float f2 = cos(p.x * 0.95 - p.y * 1.4 + w2.y * 1.25 - t * 0.15);
  float f3 = sin((p.x + p.y) * 2.2 + (w1.x + w2.y) * 1.1 + t * 0.22);
  float f4 = noise(p * 2.5 + w2 * 0.5 + t * 0.08) * 0.25;

  // WATER CURRENT: long luminous streams that visibly FLOW across the scene
  // like light ribbons on water — elongated along x, drifting with time.
  float current =
    sin(p.x * 0.55 - t * 0.85 + 2.4 * sin(p.y * 0.9 + t * 0.12)) * 0.55 +
    noise(vec2(p.x * 0.45 - t * 0.55, p.y * 1.7)) * 0.30;

  float h = f1 * 0.50 + f2 * 0.36 + f3 * 0.15 + f4 * 0.05 + current * 0.42;

  // Non-linear pleat curvature: deep rounded troughs and sharp glowing crests
  return sin(h * 2.2);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p_uv = uv;
  p_uv.x *= aspect;

  // Slow, cinematic liquid velocity (slightly livelier so folds read clearly)
  float t = u_time * 0.42;

  // Surface normal through finite differences
  float eps = 0.0035;
  float h0 = silkHeight(p_uv, t);
  float hx = silkHeight(p_uv + vec2(eps, 0.0), t);
  float hy = silkHeight(p_uv + vec2(0.0, eps), t);

  vec3 normal = normalize(vec3(-(hx - h0) / eps * 3.2, -(hy - h0) / eps * 3.2, 1.0));

  // Dramatic directional grazing spotlight from upper-left
  vec3 lightDir = normalize(vec3(-0.35, 0.50, 0.65));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  float diff = max(0.0, dot(normal, lightDir));
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec1 = pow(max(0.0, dot(normal, halfVec)), 12.0); // Soft velvet bloom
  float spec2 = pow(max(0.0, dot(normal, halfVec)), 34.0); // Sharp liquid silk specular highlight

  // Velvet Fresnel rim sheen along fold silhouettes
  float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.6);

  // High-Contrast Luxury Wine & Ruby Wedding Palette:
  vec3 c_valley = vec3(0.04, 0.005, 0.012);   // Near-black shadow valley (#0a0103)
  vec3 c_wine = vec3(0.18, 0.018, 0.052);     // Deep wine / dark burgundy (#2e050d)
  vec3 c_crimson = vec3(0.38, 0.042, 0.115);  // Rich oxblood midtone (#610b1d)
  vec3 c_ruby = vec3(0.62, 0.085, 0.19);      // Glowing radiant ruby crest (#9e1630)
  vec3 c_sheen = vec3(0.92, 0.28, 0.40);     // Specular liquid silk sheen
  vec3 c_gold = vec3(0.95, 0.72, 0.35);      // Warm gold specular glint

  // Map height from [-1, 1] to [0, 1]
  float nh = h0 * 0.5 + 0.5;

  // HIGHLIGHTS-ONLY MODE: this canvas is screen-blended over the
  // photographic artwork, so dark shader output vanishes into the photo and
  // only luminous additions surface. Broad crimson fields are scaled way
  // down (they were stacking into a flat red tint over the artwork); pale
  // sheen + gold crest glints remain as liquid light on the velvet folds.
  vec3 col = mix(c_valley, c_wine, smoothstep(0.05, 0.34, nh));
  col = mix(col, c_crimson, smoothstep(0.30, 0.70, nh) * (diff * 0.9 + 0.25) * 0.30);
  col = mix(col, c_ruby, smoothstep(0.58, 0.94, nh) * (diff * 0.95 + 0.3) * 0.22);

  // Faint velvet fresnel along fold ridges
  col += c_crimson * fresnel * 0.09;

  // Liquid specular highlights along crests — faint reflections in the
  // darkness, never brightening the screen
  col += c_sheen * spec1 * 0.06;
  col += c_sheen * spec2 * 0.16;
  col += c_gold * spec2 * 0.12;

  // FLOWING WATER STREAMS — thin deep-red reflections gliding over the
  // black silk folds: visible when you look carefully, never a glow.
  float stream =
    smoothstep(0.52, 0.72, nh) * smoothstep(0.98, 0.80, nh);
  col += (c_sheen * 0.34 + c_gold * 0.22) * stream * (0.5 + 0.5 * diff);

  // CAUSTIC RIPPLES — fine interference ripples drifting with the current,
  // like sunlight refracting through shallow flowing water.
  float ripplePhase = p_uv.x * 5.5 + p_uv.y * 2.2 - t * 1.35
    + 1.8 * noise(vec2(p_uv.x * 3.0 - t * 0.8, p_uv.y * 3.4));
  float caustic = pow(0.5 + 0.5 * sin(ripplePhase * 6.2831), 7.0);
  col += (c_sheen * 0.20 + c_gold * 0.14) * caustic * (0.30 + 0.35 * diff);

  // Subtle perimeter vignette
  vec2 vigCoord = uv * (1.0 - uv.yx);
  float vig = clamp(vigCoord.x * vigCoord.y * 30.0, 0.0, 1.0);
  col *= mix(0.85, 1.0, vig);

  gl_FragColor = vec4(col, 1.0);
}
`;

interface FluidSilkBackgroundProps {
  className?: string;
}

export const FluidSilkBackground: React.FC<FluidSilkBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number | null = null;
    let startTime = performance.now();

    // 1. Initialize WebGL Context
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          powerPreference: "low-power",
          preserveDrawingBuffer: false,
        }) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    // 2. Fallback: 2D Canvas Procedural Fluid
    if (!gl) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const render2DFallback = () => {
        animationFrameId = null;
        if (document.visibilityState !== "visible") return;

        const t = (performance.now() - startTime) * 0.0003;
        const w = canvas.width;
        const h = canvas.height;

        // Base gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, "#120205");
        bgGrad.addColorStop(0.5, "#220309");
        bgGrad.addColorStop(1, "#0a0103");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Undulating silky bezier folds
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const offset = i * 1.8 + t * (0.8 + i * 0.2);
          ctx.moveTo(0, h * 0.5 + Math.sin(offset) * (h * 0.2));
          ctx.bezierCurveTo(
            w * 0.33,
            h * 0.3 + Math.cos(offset * 0.9) * (h * 0.25),
            w * 0.66,
            h * 0.7 + Math.sin(offset * 1.1) * (h * 0.25),
            w,
            h * 0.5 + Math.cos(offset) * (h * 0.2)
          );
          ctx.lineTo(w, h);
          ctx.lineTo(0, h);
          ctx.closePath();

          const foldGrad = ctx.createLinearGradient(0, h * 0.2, w, h * 0.8);
          foldGrad.addColorStop(0, "rgba(77, 9, 22, 0.28)");
          foldGrad.addColorStop(0.5, "rgba(110, 16, 34, 0.42)");
          foldGrad.addColorStop(1, "rgba(34, 3, 9, 0.2)");
          ctx.fillStyle = foldGrad;
          ctx.fill();
        }

        if (!reducedMotion && document.visibilityState === "visible") {
          animationFrameId = requestAnimationFrame(render2DFallback);
        }
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState !== "visible") {
          if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        } else if (reducedMotion) {
          render2DFallback();
        } else if (animationFrameId === null) {
          animationFrameId = requestAnimationFrame(render2DFallback);
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      if (document.visibilityState === "visible") {
        if (reducedMotion) render2DFallback();
        else animationFrameId = requestAnimationFrame(render2DFallback);
      }
      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      };
    }

    // 3. WebGL Shader Setup
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    // Full-screen quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    const aPositionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");

    // 4. Responsive Resize — resolution-capped for 60fps on mobile GPUs.
    // Raising the cap doubles shader work per frame; on phones the photo
    // backdrop carries the detail, so the silk renders small and upscales.
    const handleResize = () => {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth || 1280;
      const height = rect.height || window.innerHeight || 900;

      // Cap DPR to 1 on mobile, 1.25 on desktop — the sheen is soft-focus
      // light, so sub-DPR crispness is wasted GPU time.
      const maxDpr = window.innerWidth <= 768 ? 1 : 1.25;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      // Max rendering dimension cap
      const renderW = Math.min(Math.floor(width * dpr), window.innerWidth <= 768 ? 900 : 1600);
      const renderH = Math.min(Math.floor(height * dpr), window.innerWidth <= 768 ? 700 : 1000);

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
        gl.viewport(0, 0, renderW, renderH);
        gl.uniform2f(uResolutionLoc, renderW, renderH);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // The canvas is fixed to the viewport and remains the page background as
    // the guest scrolls, so viewport intersection is not a useful pause signal.
    // Stop its RAF entirely while the document is hidden instead.
    const handleVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      } else if (reducedMotion) {
        gl!.uniform1f(uTimeLoc, 1.2);
        gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      } else if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    // 6. Master Render Loop
    const render = () => {
      animationFrameId = null;
      if (document.visibilityState === "visible" && gl) {
        // Drive time from performance.now(), NOT the rAF timestamp: some
        // compositing environments deliver frozen rAF timestamps, which
        // would freeze the water. performance.now() is monotonic everywhere.
        const elapsedSeconds = (performance.now() - startTime) * 0.001;
        gl.uniform1f(uTimeLoc, elapsedSeconds);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      if (!reducedMotion && document.visibilityState === "visible") {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // If reduced motion is preferred, render a single frame and halt
    if (reducedMotion) {
      if (document.visibilityState === "visible") {
        gl.uniform1f(uTimeLoc, 1.2);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    } else if (document.visibilityState === "visible") {
      animationFrameId = requestAnimationFrame(render);
    }

    // 7. Cleanup
    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
        gl.deleteBuffer(positionBuffer);
      }
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // Fixed to the viewport: the flowing water reads at natural screen
      // proportions everywhere on the page and the GPU cost stays constant
      className={`fixed inset-0 w-full h-full pointer-events-none select-none object-cover ${className}`}
      style={{
        // Blend the liquid-silk shader over the photographic backdrop as
        // flowing light: dark shader regions vanish, crests glow through.
        mixBlendMode: "screen",
        opacity: 0.34,
      }}
    />
  );
};
