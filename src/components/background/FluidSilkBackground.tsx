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

// Fast 2D hash
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

// 3-octave Fractional Brownian Motion (FBM)
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.877, 0.479, -0.479, 0.877);
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = rot * p * 2.05 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

// Organic liquid silk height field with multi-stage domain warping
float silkHeight(vec2 uv, float t) {
  vec2 p = uv * 2.4;

  // Primary slow-rolling fabric folds
  vec2 q = vec2(
    fbm(p + vec2(0.0, 0.0) + t * 0.03),
    fbm(p + vec2(5.2, 1.3) - t * 0.025)
  );

  // Secondary liquid turbulence
  vec2 r = vec2(
    fbm(p + 3.2 * q + vec2(1.7, 9.2) + t * 0.04),
    fbm(p + 3.2 * q + vec2(8.3, 2.8) - t * 0.035)
  );

  // Surface deformation
  float h1 = fbm(p + 3.8 * r + t * 0.03);
  float h2 = sin(p.x * 2.2 + p.y * 1.4 + 3.6 * r.x + t * 0.07);

  return h1 * 0.65 + h2 * 0.35;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p_uv = uv;
  p_uv.x *= aspect;

  // Ultra-slow, cinematic time evolution
  float t = u_time * 0.28;

  // Finite differences to calculate surface normal
  float eps = 0.0035;
  float h0 = silkHeight(p_uv, t);
  float hx = silkHeight(p_uv + vec2(eps, 0.0), t);
  float hy = silkHeight(p_uv + vec2(0.0, eps), t);

  vec3 normal = normalize(vec3(-(hx - h0) / eps * 2.6, -(hy - h0) / eps * 2.6, 1.0));

  // Soft directional spotlight grazing from upper-left
  vec3 lightDir = normalize(vec3(-0.25, 0.45, 0.75));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);

  float diff = max(0.0, dot(normal, lightDir));
  vec3 halfVec = normalize(lightDir + viewDir);
  float spec = pow(max(0.0, dot(normal, halfVec)), 26.0);

  // Velvet Fresnel sheen along fold contours
  float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.6);

  // Luxury Dark Burgundy Wedding Palette
  vec3 c_base = vec3(0.045, 0.006, 0.015);      // Near-black burgundy (#0c0104)
  vec3 c_wine = vec3(0.16, 0.018, 0.048);       // Deep wine (#29040c)
  vec3 c_crimson = vec3(0.32, 0.038, 0.092);    // Rich oxblood (#520917)
  vec3 c_ruby = vec3(0.52, 0.072, 0.15);        // Glowing muted ruby highlight (#851226)
  vec3 c_sheen = vec3(0.70, 0.14, 0.24);       // Specular silk glint
  vec3 c_gold = vec3(0.75, 0.50, 0.20);        // Subtle golden ember warmth

  float nh = clamp(h0 * 0.5 + 0.5, 0.0, 1.0);

  vec3 col = mix(c_base, c_wine, smoothstep(0.05, 0.42, nh));
  col = mix(col, c_crimson, smoothstep(0.38, 0.76, nh) * (diff * 0.85 + 0.15));
  col = mix(col, c_ruby, smoothstep(0.68, 0.98, nh) * (diff * 0.75 + 0.25));

  // Layer velvet fresnel rim
  col += c_crimson * fresnel * 0.6;

  // Layer restrained liquid silk specular highlights
  col += c_sheen * spec * 0.75;
  col += c_gold * spec * 0.15;

  // Gentle vignette softening around canvas borders
  vec2 vigCoord = uv * (1.0 - uv.yx);
  float vig = clamp(vigCoord.x * vigCoord.y * 28.0, 0.0, 1.0);
  col *= mix(0.78, 1.0, vig);

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
    let isVisible = true;
    let isTabActive = true;
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
          preserveDrawingBuffer: true,
        }) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    // 2. Fallback: 2D Canvas Procedural Fluid
    if (!gl) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const render2DFallback = (now: number) => {
        if (!isVisible || !isTabActive) {
          if (!reducedMotion) {
            animationFrameId = requestAnimationFrame(render2DFallback);
          }
          return;
        }

        const t = (now - startTime) * 0.0003;
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

        if (!reducedMotion) {
          animationFrameId = requestAnimationFrame(render2DFallback);
        }
      };

      animationFrameId = requestAnimationFrame(render2DFallback);
      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
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

    // 4. Responsive Resize with Capped DPR for 60fps Mobile Performance
    const handleResize = () => {
      if (!canvas || !gl) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width || window.innerWidth || 1280;
      const height = rect.height || window.innerHeight || 900;

      // Cap DPR to 1.25 on mobile, 1.5 on desktop for optimal battery and thermals
      const maxDpr = window.innerWidth <= 768 ? 1.25 : 1.5;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      // Max rendering dimension cap
      const renderW = Math.min(Math.floor(width * dpr), 1440);
      const renderH = Math.min(Math.floor(height * dpr), 1024);

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
        gl.viewport(0, 0, renderW, renderH);
        gl.uniform2f(uResolutionLoc, renderW, renderH);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    // 5. Visibility & Intersection Observers (0% GPU when hero is scrolled out of view)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isTabActive = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 6. Master Render Loop
    const render = (now: number) => {
      if (isVisible && isTabActive && gl) {
        const elapsedSeconds = (now - startTime) * 0.001;
        gl.uniform1f(uTimeLoc, elapsedSeconds);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      if (!reducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // If reduced motion is preferred, render a single frame and halt
    if (reducedMotion) {
      gl.uniform1f(uTimeLoc, 1.2);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    // 7. Cleanup
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();

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
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-0 object-cover ${className}`}
      style={{
        willChange: "transform",
      }}
    />
  );
};
