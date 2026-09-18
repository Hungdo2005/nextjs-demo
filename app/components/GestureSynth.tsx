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
  Zap
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
  const currentChordKeyRef = useRef<string>("C");
  const isPinchedRef = useRef(false);
  const lastTriggerTimeRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const handsInstanceRef = useRef<any>(null);

  // React State for UI
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChord, setCurrentChord] = useState<ChordDefinition>(CHORD_MAP.C);
  const [soundPreset, setSoundPreset] = useState<"ethereal" | "retro" | "harp">("ethereal");
  const [volume, setVolume] = useState(-2); // dB (higher default volume)
  const [isMuted, setIsMuted] = useState(false);
  const [autoStrum, setAutoStrum] = useState(true); // Auto play chord on gesture change
  const [fps, setFps] = useState(0);
  const [audioStatus, setAudioStatus] = useState<string>("Ready");
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

  // AutoStrum ref for access in animation/processing callbacks
  const autoStrumRef = useRef(true);
  useEffect(() => {
    autoStrumRef.current = autoStrum;
  }, [autoStrum]);

  // ==========================================
  // 3. AUDIO ENGINE INITIALIZATION (Tone.js)
  // ==========================================

  const setupAudio = useCallback(async () => {
    // Ensure Web Audio Context is active and running
    await Tone.start();
    if (Tone.context.state !== "running") {
      await Tone.context.resume();
    }
    Tone.getContext().lookAhead = 0.02;

    // Dispose previous synth if any to prevent memory leak
    if (synthRef.current) {
      try {
        synthRef.current.dispose();
      } catch (e) {
        console.warn("Disposing old synth:", e);
      }
    }

    // Master volume node
    const vol = new Tone.Volume(volume).toDestination();
    volumeNodeRef.current = vol;

    // Real-time Waveform Analyzer for visualizer
    const waveform = new Tone.Waveform(512);
    waveformRef.current = waveform;

    // Reliable Freeverb (instant, synchronous, zero-lag, no generate() needed!)
    const reverb = new Tone.Freeverb({
      roomSize: 0.65,
      dampening: 3200,
      wet: 0.3,
    });
    reverbRef.current = reverb;

    // Lowpass filter modulated by Right Hand Y
    const filter = new Tone.Filter({
      frequency: 3800,
      type: "lowpass",
      rolloff: -12,
      Q: 1.2,
    });
    filterRef.current = filter;

    // PolySynth with warm analog polyphonic sound
    const polySynth = new Tone.PolySynth(Tone.Synth, {
      volume: 0,
      oscillator: {
        type: "fatsawtooth",
        count: 2,
        spread: 20,
      },
      envelope: {
        attack: 0.02,
        decay: 0.35,
        sustain: 0.4,
        release: 1.1,
      },
    });

    // Chain: PolySynth -> Filter -> Reverb -> Waveform -> Master Volume
    polySynth.chain(filter, reverb, waveform, vol);
    synthRef.current = polySynth;
    setAudioStatus("Active (Web Audio Live)");
  }, [volume]);

  // Switch Sound Presets
  const applyPreset = useCallback((preset: "ethereal" | "retro" | "harp") => {
    if (!synthRef.current) return;
    setSoundPreset(preset);

    if (preset === "ethereal") {
      synthRef.current.set({
        oscillator: { type: "fatsawtooth", count: 2, spread: 25 },
        envelope: { attack: 0.04, decay: 0.5, sustain: 0.45, release: 1.6 },
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

  // Update volume
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
    // 160ms debounce cooldown
    if (now - lastTriggerTimeRef.current < 160) return;
    lastTriggerTimeRef.current = now;

    // Wake up AudioContext if needed
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

    // Spawn visual particles on trigger
    const canvas = canvasRef.current;
    if (canvas) {
      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.65;
      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.3;
        const speed = 3 + Math.random() * 5;
        particlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: chordDef.color,
          size: 3 + Math.random() * 4,
          alpha: 1,
          life: 1,
        });
      }
    }
  }, []);

  // Helper: Euclidean distance between 2 normalized points
  const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  };

  // ==========================================
  // 5. GESTURE RECOGNITION LOGIC
  // ==========================================

  // Detect individual fingers extended for a hand
  const getFingersExtended = (landmarks: any[]) => {
    const wrist = landmarks[0];
    const distToWrist = (idx: number) => dist(wrist, landmarks[idx]);

    // Non-thumb fingers: tip is above PIP (smaller y) AND tip is farther from wrist than PIP
    const isIndexExtended =
      landmarks[8].y < landmarks[6].y && distToWrist(8) > distToWrist(6) * 1.08;
    const isMiddleExtended =
      landmarks[12].y < landmarks[10].y && distToWrist(12) > distToWrist(10) * 1.08;
    const isRingExtended =
      landmarks[16].y < landmarks[14].y && distToWrist(16) > distToWrist(14) * 1.08;
    const isPinkyExtended =
      landmarks[20].y < landmarks[18].y && distToWrist(20) > distToWrist(18) * 1.08;

    // Thumb check: tip (4) is extended away from palm (pinky base 17 or index base 5)
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

  // Process Hand as Chord Selector
  const processChordHand = (landmarks: any[]) => {
    const f = getFingersExtended(landmarks);

    // 1. Am (vi): Ngón cái + ngón trỏ giơ cùng lúc (Hình chữ L hoặc 2 ngón)
    const isThumbAndIndex =
      f.thumb && f.index && !f.middle && !f.ring && !f.pinky;
    const isTwoFingers =
      isThumbAndIndex || (f.index && f.middle && !f.ring && !f.pinky && !f.thumb);

    // Count
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

        // Auto-Strum if enabled: immediately play chord upon gesture switch!
        if (autoStrumRef.current) {
          triggerChord(newChord, 0.85);
        }
      }
    }

    setDetectedGestureLeft(hint);
  };

  // Process Hand as Trigger / Modulation
  const processTriggerHand = (landmarks: any[]) => {
    // 1. Pinch Detection: Thumb tip (4) and Index tip (8)
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const pinchDistance = dist(thumbTip, indexTip);

    // Height Y: wrist (0)
    const handY = landmarks[0].y; // 0 (top) to 1 (bottom)
    const heightPercent = Math.round((1 - handY) * 100);

    // Real-time Modulation: Height controls Filter frequency (300Hz - 6500Hz)
    if (filterRef.current) {
      const targetFreq = 400 + (1 - handY) * 5800;
      filterRef.current.frequency.rampTo(targetFreq, 0.08);
    }

    // Pinch threshold: generous threshold (< 0.08 is pinch, > 0.11 is release)
    const isPinchingNow = pinchDistance < 0.08;

    // Trigger on State Transition: OPEN -> PINCH
    if (isPinchingNow && !isPinchedRef.current) {
      isPinchedRef.current = true;
      const activeChord = CHORD_MAP[currentChordKeyRef.current] || CHORD_MAP.C;
      triggerChord(activeChord, 1.0);

      // Spawn burst effect at right hand index position
      const canvas = canvasRef.current;
      if (canvas) {
        const pinchCanvasX = (1 - indexTip.x) * canvas.width; // Mirrored
        const pinchCanvasY = indexTip.y * canvas.height;
        for (let i = 0; i < 16; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          particlesRef.current.push({
            x: pinchCanvasX,
            y: pinchCanvasY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: "#f43f5e",
            size: 4 + Math.random() * 3,
            alpha: 1,
            life: 0.8,
          });
        }
      }
    } else if (!isPinchingNow && pinchDistance > 0.11) {
      isPinchedRef.current = false;
    }

    setRightHandState({
      isPinching: isPinchedRef.current,
      heightPct: Math.max(0, Math.min(100, heightPercent)),
    });
  };

  // ==========================================
  // 6. CANVAS RENDERING & VISUALIZER
  // ==========================================

  const renderCanvas = (results: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Mirrored Camera Feed
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // Horizontal mirror flip for natural webcam interaction
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image || video, 0, 0, width, height);

    // Dark sleek gradient overlay
    const overlayGrad = ctx.createLinearGradient(0, 0, 0, height);
    overlayGrad.addColorStop(0, "rgba(8, 10, 24, 0.4)");
    overlayGrad.addColorStop(0.5, "rgba(10, 15, 35, 0.25)");
    overlayGrad.addColorStop(1, "rgba(5, 7, 18, 0.8)");
    ctx.fillStyle = overlayGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // 2. Draw Hand Landmarks & Futuristic Skeleton
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks = results.multiHandLandmarks[i];
        
        // Determine hand role by screen position in mirrored view
        // The hand on the left half of the screen = Chord Hand (Cyan)
        // The hand on the right half of the screen = Trigger Hand (Pink)
        const wristScreenX = (1 - landmarks[0].x) * width;
        const isChordHand =
          results.multiHandLandmarks.length === 1 || wristScreenX < width * 0.5;
        const handThemeColor = isChordHand ? "#06b6d4" : "#ec4899";

        // Skeleton connections
        const CONNECTIONS = [
          [0, 1], [1, 2], [2, 3], [3, 4],
          [0, 5], [5, 6], [6, 7], [7, 8],
          [5, 9], [9, 10], [10, 11], [11, 12],
          [9, 13], [13, 14], [14, 15], [15, 16],
          [13, 17], [17, 18], [18, 19], [19, 20],
          [0, 17],
        ];

        ctx.lineWidth = 3;
        ctx.strokeStyle = handThemeColor;
        ctx.shadowColor = handThemeColor;
        ctx.shadowBlur = 10;

        for (const [start, end] of CONNECTIONS) {
          const p1 = { x: (1 - landmarks[start].x) * width, y: landmarks[start].y * height };
          const p2 = { x: (1 - landmarks[end].x) * width, y: landmarks[end].y * height };
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Draw Nodes
        ctx.shadowBlur = 12;
        for (let j = 0; j < landmarks.length; j++) {
          const pt = { x: (1 - landmarks[j].x) * width, y: landmarks[j].y * height };
          ctx.beginPath();
          const isTip = [4, 8, 12, 16, 20].includes(j);
          ctx.arc(pt.x, pt.y, isTip ? 6 : 4, 0, Math.PI * 2);
          ctx.fillStyle = isTip ? "#ffffff" : handThemeColor;
          ctx.fill();
        }

        // Floating Badge above wrist
        const wristPt = { x: wristScreenX, y: landmarks[0].y * height };
        ctx.shadowBlur = 6;
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.beginPath();
        ctx.roundRect(wristPt.x - 75, wristPt.y + 15, 150, 28, 8);
        ctx.fill();
        ctx.strokeStyle = handThemeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = handThemeColor;
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          isChordHand ? "TAY CHỌN HỢP ÂM" : "TAY GẢY & BIỂU CẢM",
          wristPt.x,
          wristPt.y + 33
        );
      }
    }

    // 3. Draw Audio Waveform Visualizer (Gold to Pink gradient)
    if (waveformRef.current) {
      const waveformValues = waveformRef.current.getValue();
      const waveBaseY = height * 0.78;
      const waveAmplitude = height * 0.16;

      ctx.save();
      ctx.beginPath();

      const waveGrad = ctx.createLinearGradient(
        0,
        waveBaseY - waveAmplitude,
        width,
        waveBaseY + waveAmplitude
      );
      waveGrad.addColorStop(0, "#facc15"); // Gold
      waveGrad.addColorStop(0.5, "#fb7185"); // Rose
      waveGrad.addColorStop(1, "#ec4899"); // Pink

      ctx.strokeStyle = waveGrad;
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#ec4899";
      ctx.shadowBlur = 18;

      const sliceWidth = width / waveformValues.length;
      let x = 0;

      for (let i = 0; i < waveformValues.length; i++) {
        const v = waveformValues[i];
        const y = waveBaseY + v * waveAmplitude;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();

      // Subtle reflection
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(250, 204, 21, 0.35)";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.restore();
    }

    // 4. Draw Interactive Particles
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      p.life -= 0.025;

      if (p.alpha <= 0 || p.life <= 0) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Calculate FPS
    frameCountRef.current += 1;
    const now = performance.now();
    if (now - lastFpsTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
    }
  };

  // ==========================================
  // 7. MEDIAPIPE INITIALIZATION & CAMERA LOOP
  // ==========================================

  const startApp = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Initialize Tone.js Audio Engine
      await setupAudio();

      // Play immediate welcoming chord so user HEARS SOUND right away!
      if (synthRef.current) {
        try {
          synthRef.current.triggerAttackRelease(["C4", "E4", "G4"], "4n");
        } catch (e) {
          console.warn("Welcome chime failed:", e);
        }
      }

      // 2. Initialize Camera Stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
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
        canvasRef.current.width = videoRef.current.videoWidth || 1280;
        canvasRef.current.height = videoRef.current.videoHeight || 720;
      }

      // 3. Dynamically Load MediaPipe Hands
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
        modelComplexity: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.55,
      });

      hands.onResults((results: any) => {
        if (!isRunningRef.current) return;

        // Process hand gestures
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          if (results.multiHandLandmarks.length === 1) {
            // Single hand: Treat as Chord Hand (most intuitive!)
            processChordHand(results.multiHandLandmarks[0]);
          } else {
            // 2 hands: Sort by screen X (mirrored)
            // Left-most on screen = Chord Hand, Right-most = Trigger Hand
            const hand0X = (1 - results.multiHandLandmarks[0][0].x);
            const hand1X = (1 - results.multiHandLandmarks[1][0].x);

            if (hand0X < hand1X) {
              processChordHand(results.multiHandLandmarks[0]);
              processTriggerHand(results.multiHandLandmarks[1]);
            } else {
              processChordHand(results.multiHandLandmarks[1]);
              processTriggerHand(results.multiHandLandmarks[0]);
            }
          }
        } else {
          setDetectedGestureLeft("Đưa bàn tay lên trước camera...");
        }

        // Render visual frame
        renderCanvas(results);
      });

      await hands.initialize();
      handsInstanceRef.current = hands;

      // 4. Start Camera Processing Loop
      isRunningRef.current = true;
      const processFrame = async () => {
        if (!isRunningRef.current) return;
        if (videoRef.current && videoRef.current.readyState >= 2) {
          try {
            await hands.send({ image: videoRef.current });
          } catch (err) {
            console.warn("Hand frame processing:", err);
          }
        }
        animationFrameIdRef.current = requestAnimationFrame(processFrame);
      };

      animationFrameIdRef.current = requestAnimationFrame(processFrame);

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

  // Stop camera and audio on cleanup
  const stopApp = useCallback(() => {
    isRunningRef.current = false;
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
        console.warn("Synth dispose:", e);
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

  // Toggle Fullscreen
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
        // Clicking anywhere also triggers chord for easy testing!
        if (isStarted) {
          triggerChord(currentChord, 0.95);
        }
      }}
    >
      {/* Hidden processing video element */}
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* Main Canvas covering whole viewport */}
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
              {/* MANUAL TEST SOUND BUTTON (Guaranteed Sound Verification) */}
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

              {/* Performance FPS Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>{fps} FPS</span>
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
          WELCOME / AUTOPLAY OVERLAY (START SCREEN)
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
              Nhận diện cử chỉ tay qua Webcam với Google MediaPipe và phát âm thanh đa âm bằng Web Audio API (Tone.js).
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
                  <span>Đang tải MediaPipe & Audio Engine...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Bật Camera & Audio Engine</span>
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <CameraIcon className="w-3.5 h-3.5 text-cyan-400" /> Camera Client-Side
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-pink-400" /> Web Audio (Tone.js)
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
