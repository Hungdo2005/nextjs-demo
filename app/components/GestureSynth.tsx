"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as Tone from "tone";
import {
  Volume2,
  VolumeX,
  Camera as CameraIcon,
  Music,
  Activity,
  Sparkles,
  Info,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  Play,
  Zap,
  Gauge
} from "lucide-react";

// ==========================================
// 1. DATA STRUCTURES & MUSICAL CONFIG
// ==========================================

export interface ChordDefinition {
  name: string;
  roman: string;
  notes: string[];
  color: string;
  gestureHint: string;
  fingerPattern: string;
}

export const CHORD_MAP: Record<string, ChordDefinition> = {
  C: {
    name: "C",
    roman: "C (I)",
    notes: ["C4", "E4", "G4"],
    color: "#06b6d4", // Cyan
    gestureHint: "1 ngón trỏ giơ lên",
    fingerPattern: "☝️ 1 Ngón Trỏ",
  },
  Am: {
    name: "Am",
    roman: "Am (vi)",
    notes: ["A3", "C4", "E4"],
    color: "#ec4899", // Neon Pink
    gestureHint: "Ngón cái + ngón trỏ giơ cùng lúc (Chữ L)",
    fingerPattern: "👆+👍 Cái & Trỏ (Chữ L)",
  },
  F: {
    name: "F",
    roman: "F (IV)",
    notes: ["F3", "A3", "C4"],
    color: "#a855f7", // Purple
    gestureHint: "4 ngón giơ (trừ ngón cái)",
    fingerPattern: "🖖 4 Ngón Tay",
  },
  G: {
    name: "G",
    roman: "G (V)",
    notes: ["G3", "B3", "D4"],
    color: "#eab308", // Golden Yellow
    gestureHint: "5 ngón xòe cả bàn tay",
    fingerPattern: "🖐️ 5 Ngón Xòe",
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
}

// ==========================================
// 2. MAIN GESTURE SYNTH COMPONENT
// ==========================================

export default function GestureSynth() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Audio Engine Refs
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const reverbRef = useRef<Tone.Freeverb | null>(null);
  const waveformRef = useRef<Tone.Waveform | null>(null);
  const volumeNodeRef = useRef<Tone.Volume | null>(null);

  // Tracking & State Refs
  const isRunningRef = useRef(false);
  const isAiBusyRef = useRef(false); // Prevents frame congestion
  const latestResultsRef = useRef<any>(null); // Decouples Render from AI Inference
  const currentChordKeyRef = useRef<string>("C");
  const isPinchedRef = useRef(false);
  const lastTriggerTimeRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const handsInstanceRef = useRef<any>(null);

  // React State Throttling Refs
  const lastUiUpdateRef = useRef(0);
  const cachedLeftGestureRef = useRef("Đang chờ bàn tay...");

  // React State for UI
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChord, setCurrentChord] = useState<ChordDefinition>(CHORD_MAP.C);
  const [soundPreset, setSoundPreset] = useState<"ethereal" | "retro" | "harp">("ethereal");
  const [volume, setVolume] = useState(-2); // dB
  const [isMuted, setIsMuted] = useState(false);
  const [autoStrum, setAutoStrum] = useState(true);
  const [fps, setFps] = useState(60);
  const [detectedGestureLeft, setDetectedGestureLeft] = useState<string>("Đang chờ bàn tay...");
  const [rightHandState, setRightHandState] = useState<{ isPinching: boolean; heightPct: number }>({
    isPinching: false,
    heightPct: 50,
  });
  const [showHelper, setShowHelper] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FPS calculation
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(performance.now());

  const autoStrumRef = useRef(true);
  useEffect(() => {
    autoStrumRef.current = autoStrum;
  }, [autoStrum]);

  // ==========================================
  // 3. AUDIO ENGINE INITIALIZATION (Tone.js)
  // ==========================================

  const setupAudio = useCallback(async () => {
    await Tone.start();
    if (Tone.context.state !== "running") {
      await Tone.context.resume();
    }
    Tone.getContext().lookAhead = 0.02;

    if (synthRef.current) {
      try {
        synthRef.current.dispose();
      } catch (e) {
        console.warn(e);
      }
    }

    const vol = new Tone.Volume(volume).toDestination();
    volumeNodeRef.current = vol;

    // Use smaller waveform buffer (256 instead of 512) for faster canvas array iteration
    const waveform = new Tone.Waveform(256);
    waveformRef.current = waveform;

    const reverb = new Tone.Freeverb({
      roomSize: 0.65,
      dampening: 3200,
      wet: 0.28,
    });
    reverbRef.current = reverb;

    const filter = new Tone.Filter({
      frequency: 3800,
      type: "lowpass",
      rolloff: -12,
      Q: 1.2,
    });
    filterRef.current = filter;

    const polySynth = new Tone.PolySynth(Tone.Synth, {
      volume: 0,
      oscillator: {
        type: "fatsawtooth",
        count: 2,
        spread: 18,
      },
      envelope: {
        attack: 0.02,
        decay: 0.35,
        sustain: 0.4,
        release: 1.0,
      },
    });

    polySynth.chain(filter, reverb, waveform, vol);
    synthRef.current = polySynth;
  }, [volume]);

  // Switch Sound Presets
  const applyPreset = useCallback((preset: "ethereal" | "retro" | "harp") => {
    if (!synthRef.current) return;
    setSoundPreset(preset);

    if (preset === "ethereal") {
      synthRef.current.set({
        oscillator: { type: "fatsawtooth", count: 2, spread: 22 },
        envelope: { attack: 0.04, decay: 0.5, sustain: 0.45, release: 1.5 },
      });
      if (reverbRef.current) reverbRef.current.wet.value = 0.35;
    } else if (preset === "retro") {
      synthRef.current.set({
        oscillator: { type: "pulse", width: 0.35 },
        envelope: { attack: 0.01, decay: 0.25, sustain: 0.25, release: 0.5 },
      });
      if (reverbRef.current) reverbRef.current.wet.value = 0.15;
    } else if (preset === "harp") {
      synthRef.current.set({
        oscillator: { type: "triangle8" },
        envelope: { attack: 0.005, decay: 0.7, sustain: 0.05, release: 1.2 },
      });
      if (reverbRef.current) reverbRef.current.wet.value = 0.4;
    }
  }, []);

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (volumeNodeRef.current) {
      volumeNodeRef.current.volume.rampTo(newVol, 0.05);
    }
  };

  const toggleMute = () => {
    if (!volumeNodeRef.current) return;
    if (isMuted) {
      volumeNodeRef.current.mute = false;
      setIsMuted(false);
    } else {
      volumeNodeRef.current.mute = true;
      setIsMuted(true);
    }
  };

  // ==========================================
  // 4. CHORD TRIGGERING & DEBOUNCING
  // ==========================================

  const triggerChord = useCallback((chordDef: ChordDefinition, intensity: number = 0.9) => {
    const now = performance.now();
    if (now - lastTriggerTimeRef.current < 160) return;
    lastTriggerTimeRef.current = now;

    if (Tone.context.state !== "running") {
      Tone.context.resume().catch((e) => console.warn(e));
    }

    if (synthRef.current) {
      try {
        synthRef.current.triggerAttackRelease(
          chordDef.notes,
          "4n",
          undefined,
          Math.min(1, Math.max(0.5, intensity))
        );
      } catch (e) {
        console.error("Audio trigger error:", e);
      }
    }

    // Spawn visual particles (optimized count: 18 particles)
    const canvas = canvasRef.current;
    if (canvas) {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.65;
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18 + Math.random() * 0.3;
        const speed = 3 + Math.random() * 5;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: chordDef.color,
          size: 3 + Math.random() * 3,
          alpha: 1,
          life: 1,
        });
      }
    }
  }, []);

  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // ==========================================
  // 5. GESTURE RECOGNITION LOGIC (OPTIMIZED)
  // ==========================================

  const getFingersExtended = (landmarks: any[]) => {
    const wrist = landmarks[0];
    const distToWrist = (idx: number) => dist(wrist, landmarks[idx]);

    const isIndexExtended =
      landmarks[8].y < landmarks[6].y && distToWrist(8) > distToWrist(6) * 1.08;
    const isMiddleExtended =
      landmarks[12].y < landmarks[10].y && distToWrist(12) > distToWrist(10) * 1.08;
    const isRingExtended =
      landmarks[16].y < landmarks[14].y && distToWrist(16) > distToWrist(14) * 1.08;
    const isPinkyExtended =
      landmarks[20].y < landmarks[18].y && distToWrist(20) > distToWrist(18) * 1.08;

    const isThumbExtended =
      dist(landmarks[4], landmarks[17]) > dist(landmarks[3], landmarks[17]) * 1.12 ||
      dist(landmarks[4], landmarks[5]) > dist(landmarks[2], landmarks[5]) * 1.15;

    return {
      thumb: isThumbExtended,
      index: isIndexExtended,
      middle: isMiddleExtended,
      ring: isRingExtended,
      pinky: isPinkyExtended,
    };
  };

  // Process Chord Hand
  const processChordHand = (landmarks: any[]) => {
    const f = getFingersExtended(landmarks);

    const isThumbAndIndex =
      f.thumb && f.index && !f.middle && !f.ring && !f.pinky;
    const isTwoFingers =
      isThumbAndIndex || (f.index && f.middle && !f.ring && !f.pinky && !f.thumb);

    const totalExtended =
      (f.index ? 1 : 0) +
      (f.middle ? 1 : 0) +
      (f.ring ? 1 : 0) +
      (f.pinky ? 1 : 0) +
      (f.thumb ? 1 : 0);
    const nonThumbCount =
      (f.index ? 1 : 0) + (f.middle ? 1 : 0) + (f.ring ? 1 : 0) + (f.pinky ? 1 : 0);

    let detectedKey: string | null = null;
    let hint = "";

    if (isThumbAndIndex || isTwoFingers) {
      detectedKey = "Am";
      hint = "👆+👍 Cái & Trỏ (Chữ L) → Am (vi)";
    } else if (totalExtended === 5) {
      detectedKey = "G";
      hint = "🖐️ 5 Ngón Xòe → G (V)";
    } else if (nonThumbCount === 4 || totalExtended === 4) {
      detectedKey = "F";
      hint = "🖖 4 Ngón Tay → F (IV)";
    } else if (
      (f.index && !f.middle && !f.ring && !f.pinky && !f.thumb) ||
      totalExtended === 1
    ) {
      detectedKey = "C";
      hint = "☝️ 1 Ngón Trỏ → C (I)";
    } else {
      hint = `${totalExtended} ngón giơ: Chờ cử chỉ hợp âm...`;
    }

    if (detectedKey && CHORD_MAP[detectedKey]) {
      if (currentChordKeyRef.current !== detectedKey) {
        currentChordKeyRef.current = detectedKey;
        const newChord = CHORD_MAP[detectedKey];
        setCurrentChord(newChord);

        if (autoStrumRef.current) {
          triggerChord(newChord, 0.85);
        }
      }
    }

    // Throttle UI update to avoid React re-rendering bottleneck
    cachedLeftGestureRef.current = hint;
  };

  // Process Trigger Hand
  const processTriggerHand = (landmarks: any[]) => {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinchDistance = dist(thumbTip, indexTip);
    const handY = landmarks[0].y;
    const heightPercent = Math.round((1 - handY) * 100);

    if (filterRef.current) {
      const targetFreq = 400 + (1 - handY) * 5800;
      filterRef.current.frequency.rampTo(targetFreq, 0.08);
    }

    const isPinchingNow = pinchDistance < 0.08;

    if (isPinchingNow && !isPinchedRef.current) {
      isPinchedRef.current = true;
      const activeChord = CHORD_MAP[currentChordKeyRef.current] || CHORD_MAP.C;
      triggerChord(activeChord, 1.0);

      const canvas = canvasRef.current;
      if (canvas) {
        const pinchCanvasX = (1 - indexTip.x) * canvas.width;
        const pinchCanvasY = indexTip.y * canvas.height;
        for (let i = 0; i < 12; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          particlesRef.current.push({
            x: pinchCanvasX,
            y: pinchCanvasY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: "#f43f5e",
            size: 4 + Math.random() * 2,
            alpha: 1,
            life: 0.8,
          });
        }
      }
    } else if (!isPinchingNow && pinchDistance > 0.11) {
      isPinchedRef.current = false;
    }

    // Throttled in parent loop
  };

  // ==========================================
  // 6. HIGH-PERFORMANCE 60 FPS RENDER LOOP
  // ==========================================

  const renderFrame = () => {
    if (!isRunningRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || video.readyState < 2) {
      animationFrameIdRef.current = requestAnimationFrame(renderFrame);
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: false }); // alpha: false gives huge canvas performance boost!
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Mirrored Camera Feed (Hardware accelerated)
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, width, height);

    // Dark sleek gradient overlay
    ctx.fillStyle = "rgba(5, 7, 18, 0.65)";
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 2. Draw Latest Hand Landmarks (Zero CPU shadowBlur penalty)
    const results = latestResultsRef.current;
    if (results && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const CONNECTIONS = [
        [0, 1], [1, 2], [2, 3], [3, 4],
        [0, 5], [5, 6], [6, 7], [7, 8],
        [5, 9], [9, 10], [10, 11], [11, 12],
        [9, 13], [13, 14], [14, 15], [15, 16],
        [13, 17], [17, 18], [18, 19], [19, 20],
        [0, 17],
      ];

      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        const wristScreenX = (1 - landmarks[0].x) * width;
        const isChordHand =
          results.multiHandLandmarks.length === 1 || wristScreenX < width * 0.5;
        const handColor = isChordHand ? "#06b6d4" : "#ec4899";
        const glowColor = isChordHand ? "rgba(6, 182, 212, 0.3)" : "rgba(236, 72, 153, 0.3)";

        // Fast Glow layer (layered stroke instead of expensive shadowBlur)
        ctx.beginPath();
        for (const [start, end] of CONNECTIONS) {
          ctx.moveTo((1 - landmarks[start].x) * width, landmarks[start].y * height);
          ctx.lineTo((1 - landmarks[end].x) * width, landmarks[end].y * height);
        }
        ctx.lineWidth = 7;
        ctx.strokeStyle = glowColor;
        ctx.stroke();

        // Sharp core bone
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = handColor;
        ctx.stroke();

        // Draw Nodes
        for (let j = 0; j < landmarks.length; j++) {
          const ptX = (1 - landmarks[j].x) * width;
          const ptY = landmarks[j].y * height;
          const isTip = [4, 8, 12, 16, 20].includes(j);

          ctx.beginPath();
          ctx.arc(ptX, ptY, isTip ? 5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isTip ? "#ffffff" : handColor;
          ctx.fill();
        }

        // Floating Badge
        const wristY = landmarks[0].y * height;
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.beginPath();
        ctx.roundRect(wristScreenX - 70, wristY + 14, 140, 26, 8);
        ctx.fill();
        ctx.strokeStyle = handColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = handColor;
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          isChordHand ? "TAY HỢP ÂM" : "TAY GẢY & FILTER",
          wristScreenX,
          wristY + 31
        );
      }
    }

    // 3. Draw Audio Waveform Visualizer (Optimized 256 samples, no heavy shadowBlur)
    if (waveformRef.current) {
      const waveformValues = waveformRef.current.getValue();
      const waveBaseY = height * 0.78;
      const waveAmplitude = height * 0.15;

      ctx.beginPath();
      const sliceWidth = width / (waveformValues.length - 1);
      for (let i = 0; i < waveformValues.length; i++) {
        const x = i * sliceWidth;
        const y = waveBaseY + waveformValues[i] * waveAmplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Fast layered glow without shadowBlur
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(236, 72, 153, 0.35)";
      ctx.stroke();

      const waveGrad = ctx.createLinearGradient(0, waveBaseY - waveAmplitude, width, waveBaseY + waveAmplitude);
      waveGrad.addColorStop(0, "#facc15");
      waveGrad.addColorStop(0.5, "#fb7185");
      waveGrad.addColorStop(1, "#ec4899");

      ctx.lineWidth = 3;
      ctx.strokeStyle = waveGrad;
      ctx.stroke();
    }

    // 4. Draw Interactive Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      p.life -= 0.03;

      if (p.alpha <= 0 || p.life <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // FPS Counter & React state throttle (10 Hz for UI)
    frameCountRef.current += 1;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }

    if (now - lastUiUpdateRef.current >= 100) {
      lastUiUpdateRef.current = now;
      setDetectedGestureLeft(cachedLeftGestureRef.current);

      if (results && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const triggerLandmarks =
          results.multiHandLandmarks.length > 1
            ? (1 - results.multiHandLandmarks[0][0].x < 1 - results.multiHandLandmarks[1][0].x
                ? results.multiHandLandmarks[1]
                : results.multiHandLandmarks[0])
            : results.multiHandLandmarks[0];

        const handY = triggerLandmarks[0].y;
        setRightHandState({
          isPinching: isPinchedRef.current,
          heightPct: Math.round((1 - handY) * 100),
        });
      }
    }

    // Loop continues at native 60 FPS
    animationFrameIdRef.current = requestAnimationFrame(renderFrame);
  };

  // ==========================================
  // 7. ASYNC AI INFERENCE LOOP (DECOUPLED)
  // ==========================================

  const startApp = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Initialize Tone.js
      await setupAudio();

      if (synthRef.current) {
        try {
          synthRef.current.triggerAttackRelease(["C4", "E4", "G4"], "4n");
        } catch (e) {
          console.warn(e);
        }
      }

      // 2. Camera Stream: Optimized 640x480 resolution (massive 4x inference speedup!)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: "user",
          frameRate: { ideal: 30, max: 60 },
        },
        audio: false,
      });

      if (!videoRef.current) {
        throw new Error("Video element không khả dụng.");
      }

      videoRef.current.srcObject = stream;
      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            resolve();
          };
        }
      });

      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth || 640;
        canvasRef.current.height = videoRef.current.videoHeight || 480;
      }

      // 3. Load MediaPipe with modelComplexity: 0 (Ultra Fast 60 FPS model)
      const handsModule = await import("@mediapipe/hands");
      const HandsClass = handsModule.Hands || (window as any).Hands;

      if (!HandsClass) {
        throw new Error("Không thể khởi tạo MediaPipe Hands.");
      }

      const hands = new HandsClass({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 0, // Lite model: 3-4x faster inference!
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.5,
      });

      hands.onResults((results: any) => {
        // Save latest results to decoupled ref
        latestResultsRef.current = results;
        isAiBusyRef.current = false;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          if (results.multiHandLandmarks.length === 1) {
            processChordHand(results.multiHandLandmarks[0]);
          } else {
            const hand0X = 1 - results.multiHandLandmarks[0][0].x;
            const hand1X = 1 - results.multiHandLandmarks[1][0].x;

            if (hand0X < hand1X) {
              processChordHand(results.multiHandLandmarks[0]);
              processTriggerHand(results.multiHandLandmarks[1]);
            } else {
              processChordHand(results.multiHandLandmarks[1]);
              processTriggerHand(results.multiHandLandmarks[0]);
            }
          }
        } else {
          cachedLeftGestureRef.current = "Đưa bàn tay lên trước camera...";
        }
      });

      await hands.initialize();
      handsInstanceRef.current = hands;

      // 4. Start Render Loop (60 FPS Native)
      isRunningRef.current = true;
      animationFrameIdRef.current = requestAnimationFrame(renderFrame);

      // 5. Start Decoupled AI Inference Loop with frame dropping prevention
      const runAiInference = async () => {
        if (!isRunningRef.current) return;

        if (
          !isAiBusyRef.current &&
          videoRef.current &&
          videoRef.current.readyState >= 2
        ) {
          isAiBusyRef.current = true;
          try {
            await hands.send({ image: videoRef.current });
          } catch (err) {
            isAiBusyRef.current = false;
          }
        }

        // Schedule next AI check immediately without blocking requestAnimationFrame
        setTimeout(runAiInference, 10);
      };

      runAiInference();

      setIsStarted(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Initialization failed:", err);
      setErrorMessage(
        err.message ||
          "Không thể mở camera hoặc audio. Vui lòng cấp quyền truy cập camera trong trình duyệt."
      );
      setIsLoading(false);
    }
  };

  const stopApp = useCallback(() => {
    isRunningRef.current = false;
    isAiBusyRef.current = false;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (synthRef.current) {
      try {
        synthRef.current.dispose();
      } catch (e) {
        console.warn(e);
      }
      synthRef.current = null;
    }

    setIsStarted(false);
  }, []);

  useEffect(() => {
    return () => {
      stopApp();
    };
  }, [stopApp]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-slate-950 text-slate-100 overflow-hidden select-none font-sans flex flex-col"
      onClick={() => {
        if (isStarted) {
          triggerChord(currentChord, 0.95);
        }
      }}
    >
      <video ref={videoRef} className="hidden" playsInline muted />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ==========================================
          TOP NAVIGATION BAR
         ========================================== */}
      <header
        className="relative z-20 flex items-center justify-between px-6 py-4 bg-slate-950/40 backdrop-blur-md border-b border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent">
              GESTURE SYNTH
            </h1>
            <p className="text-xs text-slate-400">AI Hand Tracking Web Audio Synthesizer</p>
          </div>
        </div>

        {/* Controls and Indicators */}
        <div className="flex items-center gap-3">
          {isStarted && (
            <>
              {/* MANUAL TEST SOUND BUTTON */}
              <button
                onClick={() => triggerChord(currentChord, 1.0)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-xs shadow-lg shadow-pink-500/25 active:scale-95 transition cursor-pointer"
                title="Bấm để thử phát âm thanh hợp âm hiện tại"
              >
                <Music className="w-4 h-4" />
                <span>Thử Âm ({currentChord.name})</span>
              </button>

              {/* Auto-Strum Toggle */}
              <button
                onClick={() => setAutoStrum(!autoStrum)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${
                  autoStrum
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-slate-900/80 border-white/10 text-slate-400"
                }`}
                title="Tự động phát khi đổi cử chỉ tay"
              >
                <Zap className={`w-3.5 h-3.5 ${autoStrum ? "text-cyan-400 fill-cyan-400" : ""}`} />
                <span>Tự động gảy: {autoStrum ? "BẬT" : "TẮT"}</span>
              </button>

              {/* Sound Presets */}
              <div className="flex items-center bg-slate-900/80 border border-white/10 rounded-xl p-1 text-xs">
                {(["ethereal", "retro", "harp"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPreset(p)}
                    className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                      soundPreset === p
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 rounded-xl px-3 py-1.5">
                <button
                  onClick={toggleMute}
                  className="text-slate-300 hover:text-white transition"
                  title={isMuted ? "Bật âm" : "Tắt âm"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                </button>
                <input
                  type="range"
                  min="-24"
                  max="6"
                  step="1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-20 accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
              </div>

              {/* Performance 60 FPS Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-emerald-400 shadow-sm shadow-emerald-500/10">
                <Gauge className="w-3.5 h-3.5" />
                <span>{fps} FPS (Mượt)</span>
              </div>
            </>
          )}

          {/* Helper Toggle */}
          <button
            onClick={() => setShowHelper(!showHelper)}
            className={`p-2 rounded-xl border transition ${
              showHelper
                ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                : "bg-slate-900/80 border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Bật/Tắt hướng dẫn cử chỉ"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900/80 border border-white/10 text-slate-400 hover:text-white transition"
            title="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Restart / Stop */}
          {isStarted && (
            <button
              onClick={stopApp}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition"
              title="Dừng Camera & Audio"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* ==========================================
          WELCOME OVERLAY (START SCREEN)
         ========================================== */}
      {!isStarted && (
        <div
          className="relative z-30 flex-1 flex items-center justify-center p-6 bg-slate-950/85 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="max-w-md w-full bg-slate-900/90 border border-white/10 rounded-2xl p-8 shadow-2xl shadow-cyan-500/10 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-1 mb-6 shadow-xl shadow-cyan-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Music className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight mb-2 bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Chơi Nhạc Bằng Cử Chỉ Tay
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Phiên bản tối ưu hoá hiệu năng đạt 60 FPS mượt mà với mô hình MediaPipe Lite và Render Loop độc lập.
            </p>

            {errorMessage && (
              <div className="w-full mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <button
              onClick={startApp}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 active:scale-[0.98] transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer text-base"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Đang tối ưu & khởi động Audio Engine...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Bật Camera & Audio Engine (60 FPS)</span>
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CameraIcon className="w-3.5 h-3.5 text-cyan-400" /> 60 FPS Render Loop
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-400" /> Web Audio Zero-Lag
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          IN-APP HUD OVERLAYS (WHEN RUNNING)
         ========================================== */}
      {isStarted && (
        <div className="relative z-10 flex-1 pointer-events-none flex flex-col justify-between p-6">
          {/* Top Info Badges */}
          <div className="flex items-start justify-between gap-4">
            {/* Chord Selector Status Badge */}
            <div
              className="pointer-events-auto bg-slate-950/70 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3.5 max-w-xs shadow-lg shadow-cyan-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Bàn Tay Chọn Hợp Âm
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">{detectedGestureLeft}</p>
            </div>

            {/* Trigger & Modulation Status Badge */}
            <div
              className="pointer-events-auto bg-slate-950/70 backdrop-blur-md border border-pink-500/30 rounded-2xl p-3.5 max-w-xs shadow-lg shadow-pink-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    rightHandState.isPinching ? "bg-pink-400 scale-125" : "bg-slate-500"
                  } transition-all`}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Bàn Tay Gảy & Biểu Cảm
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-300">
                <div className="flex items-center justify-between gap-3">
                  <span>Búng ngón (Pinch):</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      rightHandState.isPinching
                        ? "bg-pink-500 text-white animate-pulse"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {rightHandState.isPinching ? "GẢY NỐT 💥" : "SẴN SÀNG"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Độ cao Y (Filter):</span>
                  <span className="font-mono font-bold text-yellow-300">
                    {rightHandState.heightPct}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Gesture Quick Guide Sidebar */}
          {showHelper && (
            <div
              className="pointer-events-auto self-start bg-slate-950/75 backdrop-blur-md border border-white/10 rounded-2xl p-4 max-w-xs space-y-3 mt-4 text-xs shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-slate-300 flex items-center justify-between">
                <span>HƯỚNG DẪN CỬ CHỈ</span>
                <span className="text-[10px] text-cyan-400 font-mono">CHORD MAP</span>
              </h3>
              <div className="space-y-2">
                {Object.values(CHORD_MAP).map((chord) => {
                  const isActive = currentChord.name === chord.name;
                  return (
                    <div
                      key={chord.name}
                      onClick={() => {
                        setCurrentChord(chord);
                        currentChordKeyRef.current = chord.name;
                        triggerChord(chord, 1.0);
                      }}
                      className={`p-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-white/10 border-white/30 scale-105 shadow-md"
                          : "bg-slate-900/50 border-white/5 opacity-75 hover:opacity-100"
                      }`}
                      style={{ borderLeftColor: chord.color, borderLeftWidth: "4px" }}
                    >
                      <div>
                        <div className="font-bold text-slate-200">{chord.fingerPattern}</div>
                        <div className="text-[10px] text-slate-400">{chord.gestureHint}</div>
                      </div>
                      <div
                        className="font-bold text-sm px-2 py-0.5 rounded-lg"
                        style={{ backgroundColor: `${chord.color}25`, color: chord.color }}
                      >
                        {chord.roman}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10 space-y-1 text-slate-400 text-[11px]">
                <p>
                  👉 <strong className="text-slate-200">Gảy nốt:</strong> Búng ngón trỏ & cái tay phải (Pinch) HOẶC nhấp chuột vào màn hình.
                </p>
                <p>
                  👉 <strong className="text-slate-200">Âm sắc:</strong> Di chuyển tay phải lên cao để mở bộ lọc sáng hơn.
                </p>
              </div>
            </div>
          )}

          {/* ==========================================
              CENTER-BOTTOM MASSIVE GLOWING CHORD BADGE
             ========================================== */}
          <div
            className="pointer-events-auto flex flex-col items-center justify-center mb-6 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              triggerChord(currentChord, 1.0);
            }}
            title="Bấm vào để phát hợp âm này!"
          >
            <div
              className="relative px-10 py-5 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col items-center shadow-2xl border active:scale-95"
              style={{
                backgroundColor: `${currentChord.color}15`,
                borderColor: `${currentChord.color}60`,
                boxShadow: `0 0 45px ${currentChord.color}35`,
              }}
            >
              {/* Chord Name with Roman Numeral */}
              <div
                className="text-6xl sm:text-7xl font-black tracking-wider transition-all duration-200 select-none"
                style={{
                  color: currentChord.color,
                  textShadow: `0 0 30px ${currentChord.color}90, 0 0 60px ${currentChord.color}50`,
                }}
              >
                {currentChord.roman}
              </div>

              {/* Subtitle with active note pitches */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                  Hợp âm {currentChord.name}:
                </span>
                <div className="flex gap-1.5">
                  {currentChord.notes.map((note) => (
                    <span
                      key={note}
                      className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 border border-white/20 text-slate-200 shadow"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
