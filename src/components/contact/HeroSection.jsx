import React, { useEffect, useRef } from 'react';
import './tides.css';

const PALETTE_KEYS = [
  {
    t: 0,
    name: 'DAWN',
    skyTop: [38, 44, 86],
    skyHor: [247, 176, 128],
    sun: [255, 238, 206],
    glow: [255, 178, 120],
    wFar: [176, 150, 150],
    wNear: [34, 62, 84],
    foam: [255, 244, 234],
    sunH: 0.1,
    glit: 0.7,
    star: 0,
  },
  {
    t: 0.28,
    name: 'MORNING',
    skyTop: [64, 134, 206],
    skyHor: [188, 222, 236],
    sun: [255, 255, 246],
    glow: [255, 250, 224],
    wFar: [120, 186, 196],
    wNear: [20, 92, 114],
    foam: [255, 255, 255],
    sunH: 0.55,
    glit: 0.5,
    star: 0,
  },
  {
    t: 0.5,
    name: 'MIDDAY',
    skyTop: [58, 142, 214],
    skyHor: [176, 216, 230],
    sun: [255, 255, 248],
    glow: [255, 252, 232],
    wFar: [96, 178, 188],
    wNear: [16, 96, 120],
    foam: [255, 255, 255],
    sunH: 0.92,
    glit: 0.45,
    star: 0,
  },
  {
    t: 0.68,
    name: 'GOLDEN HOUR',
    skyTop: [74, 92, 156],
    skyHor: [255, 202, 120],
    sun: [255, 236, 194],
    glow: [255, 168, 92],
    wFar: [206, 164, 118],
    wNear: [34, 78, 98],
    foam: [255, 244, 228],
    sunH: 0.3,
    glit: 0.95,
    star: 0,
  },
  {
    t: 0.84,
    name: 'SUNSET',
    skyTop: [48, 38, 86],
    skyHor: [255, 108, 68],
    sun: [255, 206, 148],
    glow: [255, 92, 58],
    wFar: [188, 98, 84],
    wNear: [30, 42, 72],
    foam: [255, 222, 200],
    sunH: 0.06,
    glit: 1,
    star: 0.15,
  },
  {
    t: 1,
    name: 'MOONLIT',
    skyTop: [8, 12, 30],
    skyHor: [34, 44, 82],
    sun: [228, 234, 255],
    glow: [140, 164, 216],
    wFar: [28, 42, 76],
    wNear: [6, 16, 32],
    foam: [196, 208, 234],
    sunH: 0.55,
    glit: 0.55,
    star: 1,
  },
];

const MINUTES_PER_DAY = 24 * 60;
const TIMELINE_START_MINUTES = 5 * 60;
const TIMELINE_END_MINUTES = 23 * 60;
const TIMELINE_RANGE_MINUTES = TIMELINE_END_MINUTES - TIMELINE_START_MINUTES;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpRGB(a, b, t) {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgb(color, alpha = 1) {
  return `rgba(${color[0] | 0},${color[1] | 0},${color[2] | 0},${alpha})`;
}

function formatClockMinutes(minutes) {
  const normalized = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hh = Math.floor(normalized / 60);
  const mm = normalized % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

function clockMinutesToTimelineValue(minutes) {
  if (minutes < TIMELINE_START_MINUTES || minutes > TIMELINE_END_MINUTES) {
    return 1;
  }

  return clamp01((minutes - TIMELINE_START_MINUTES) / TIMELINE_RANGE_MINUTES);
}

function timelineValueToClockMinutes(value) {
  return TIMELINE_START_MINUTES + clamp01(value) * TIMELINE_RANGE_MINUTES;
}

function getInitialClockSnapshot() {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  return {
    totalMinutes,
    timelineValue: clockMinutesToTimelineValue(totalMinutes),
  };
}

function getPalette(time) {
  let index = 0;
  while (index < PALETTE_KEYS.length - 1 && time > PALETTE_KEYS[index + 1].t) {
    index += 1;
  }

  const current = PALETTE_KEYS[index];
  const next = PALETTE_KEYS[Math.min(index + 1, PALETTE_KEYS.length - 1)];
  const span = next.t - current.t || 1;
  const k = clamp01((time - current.t) / span);

  return {
    name: k < 0.5 ? current.name : next.name,
    skyTop: lerpRGB(current.skyTop, next.skyTop, k),
    skyHor: lerpRGB(current.skyHor, next.skyHor, k),
    sun: lerpRGB(current.sun, next.sun, k),
    glow: lerpRGB(current.glow, next.glow, k),
    wFar: lerpRGB(current.wFar, next.wFar, k),
    wNear: lerpRGB(current.wNear, next.wNear, k),
    foam: lerpRGB(current.foam, next.foam, k),
    sunH: lerp(current.sunH, next.sunH, k),
    glit: lerp(current.glit, next.glit, k),
    star: lerp(current.star, next.star, k),
  };
}

export default function HeroSection() {
  const initialClockRef = useRef(null);
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const sliderRef = useRef(null);
  const moodNameRef = useRef(null);
  const moodTimeRef = useRef(null);

  if (initialClockRef.current === null) {
    initialClockRef.current = getInitialClockSnapshot();
  }

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const slider = sliderRef.current;
    const moodName = moodNameRef.current;
    const moodTime = moodTimeRef.current;
    const ctx = canvas?.getContext('2d');

    if (!section || !canvas || !slider || !moodName || !moodTime || !ctx) {
      return undefined;
    }

    let width = 1;
    let height = 1;
    let horizonY = 1;
    let oceanH = 1;
    const initialClock = initialClockRef.current;
    let timeOfDay = initialClock.timelineValue;
    let displayMinutes = initialClock.totalMinutes;
    let mouseX = 0.5;
    let tick = 0;
    let animationFrame = 0;

    slider.value = String(Math.round(timeOfDay * 1000));

    const stars = Array.from({ length: 140 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.4,
      r: Math.random() * 1.2 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));

    const clouds = Array.from({ length: 5 }, () => ({
      x: Math.random(),
      y: 0.08 + Math.random() * 0.18,
      w: 0.18 + Math.random() * 0.22,
      speed: 0.000015 + Math.random() * 0.00002,
    }));

    const birds = Array.from({ length: 4 }, () => ({
      x: Math.random(),
      y: 0.15 + Math.random() * 0.18,
      speed: 0.00004 + Math.random() * 0.00004,
      size: 8 + Math.random() * 6,
      flap: Math.random() * Math.PI * 2,
    }));

    function resize() {
      const bounds = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      horizonY = height * 0.42;
      oceanH = height - horizonY;
    }

    function updatePointer(clientX) {
      const bounds = section.getBoundingClientRect();
      mouseX = clamp01((clientX - bounds.left) / Math.max(1, bounds.width));
    }

    function draw() {
      tick += 0.016;
      const palette = getPalette(timeOfDay);

      const sunX = width * (0.5 + (mouseX - 0.5) * 0.25);
      const sunY = horizonY - palette.sunH * horizonY * 0.82;

      const sky = ctx.createLinearGradient(0, 0, 0, horizonY + oceanH * 0.1);
      sky.addColorStop(0, rgb(palette.skyTop));
      sky.addColorStop(0.7, rgb(lerpRGB(palette.skyTop, palette.skyHor, 0.55)));
      sky.addColorStop(1, rgb(palette.skyHor));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, horizonY + 2);

      if (palette.star > 0.01) {
        stars.forEach((star) => {
          const twinkle = 0.5 + 0.5 * Math.sin(tick * 2 + star.tw);
          ctx.fillStyle = rgb([255, 255, 255], palette.star * twinkle * 0.9);
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * horizonY, star.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      const glowR = Math.min(width, height) * 0.5;
      const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, glowR);
      glow.addColorStop(0, rgb(palette.glow, 0.55));
      glow.addColorStop(0.25, rgb(palette.glow, 0.22));
      glow.addColorStop(1, rgb(palette.glow, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, horizonY + oceanH * 0.4);

      const sunR = Math.min(width, height) * 0.045;
      const sunDisc = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
      sunDisc.addColorStop(0, rgb(palette.sun, 1));
      sunDisc.addColorStop(0.7, rgb(palette.sun, 0.95));
      sunDisc.addColorStop(1, rgb(palette.sun, 0.2));
      ctx.fillStyle = sunDisc;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fill();

      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x > 1.3) cloud.x = -0.3;

        const cx = cloud.x * width;
        const cy = cloud.y * horizonY;
        const cw = cloud.w * width;
        ctx.fillStyle = rgb(lerpRGB(palette.skyHor, [255, 255, 255], 0.25), 0.16);

        for (let j = 0; j < 4; j += 1) {
          ctx.beginPath();
          ctx.ellipse(
            cx + j * cw * 0.22,
            cy + Math.sin(j) * 6,
            cw * (0.3 - j * 0.04),
            cw * 0.06,
            0,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
      });

      birds.forEach((bird) => {
        bird.x += bird.speed;
        bird.flap += 0.15;
        if (bird.x > 1.2) {
          bird.x = -0.2;
          bird.y = 0.15 + Math.random() * 0.18;
        }

        const bx = bird.x * width;
        const by = bird.y * horizonY;
        const wing = Math.sin(bird.flap) * bird.size * 0.5;
        ctx.strokeStyle = rgb(lerpRGB(palette.skyTop, [0, 0, 0], 0.3), 0.5);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx - bird.size, by + wing);
        ctx.quadraticCurveTo(bx, by - bird.size * 0.3, bx, by);
        ctx.quadraticCurveTo(bx, by - bird.size * 0.3, bx + bird.size, by + wing);
        ctx.stroke();
      });

      const haze = ctx.createLinearGradient(0, horizonY - 40, 0, horizonY + 40);
      haze.addColorStop(0, rgb(palette.skyHor, 0));
      haze.addColorStop(0.5, rgb(palette.skyHor, 0.45));
      haze.addColorStop(1, rgb(palette.wFar, 0));
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizonY - 40, width, 80);

      const swellCount = 26;
      for (let i = 0; i < swellCount; i += 1) {
        const depth = i / (swellCount - 1);
        const yTop = horizonY + Math.pow(depth, 1.9) * oceanH;
        const amp = lerp(0.6, 30, depth);
        const waveLength = lerp(46, 340, depth);
        const speed = lerp(0.25, 0.9, depth);
        const phase = tick * speed + i * 0.9;
        const color = lerpRGB(palette.wFar, palette.wNear, depth);

        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, yTop + Math.sin(phase) * amp);
        for (let x = 0; x <= width; x += 6) {
          const y =
            yTop +
            Math.sin(x / waveLength + phase) * amp +
            Math.sin(x / (waveLength * 0.4) + phase * 1.6) * amp * 0.3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = rgb(color);
        ctx.fill();

        ctx.lineWidth = lerp(0.6, 2.2, depth);
        ctx.beginPath();
        let started = false;
        for (let x = 0; x <= width; x += 6) {
          const y =
            yTop +
            Math.sin(x / waveLength + phase) * amp +
            Math.sin(x / (waveLength * 0.4) + phase * 1.6) * amp * 0.3;
          if (started) {
            ctx.lineTo(x, y);
          } else {
            ctx.moveTo(x, y);
            started = true;
          }
        }
        ctx.strokeStyle = rgb(lerpRGB(color, palette.sun, 0.55), lerp(0.05, 0.3, depth));
        ctx.stroke();

        if (depth > 0.62) {
          const foamAlpha = (depth - 0.62) / 0.38;
          for (let x = 0; x <= width; x += 9) {
            const y =
              yTop +
              Math.sin(x / waveLength + phase) * amp +
              Math.sin(x / (waveLength * 0.4) + phase * 1.6) * amp * 0.3;
            const crest = Math.sin(x / waveLength + phase);
            if (crest > 0.55 && Math.random() > 0.45) {
              ctx.fillStyle = rgb(palette.foam, foamAlpha * (0.18 + Math.random() * 0.35));
              ctx.fillRect(
                x + (Math.random() - 0.5) * 6,
                y - Math.random() * 3,
                1.5 + Math.random() * 3,
                1.5 + Math.random() * 2,
              );
            }
          }
        }
      }

      const glitterCount = 220;
      for (let i = 0; i < glitterCount; i += 1) {
        const dy = Math.random();
        const y = horizonY + Math.pow(dy, 1.5) * oceanH;
        const spread = lerp(6, width * 0.3, dy);
        const x = sunX + (Math.random() - 0.5) * 2 * spread;
        const distFade = 1 - Math.min(1, Math.abs(x - sunX) / (spread + 1));
        const flick = 0.25 + Math.random() * 0.75;
        const alpha = distFade * distFade * flick * palette.glit * (1 - dy * 0.25);
        if (alpha < 0.02) continue;

        ctx.fillStyle = rgb(palette.sun, alpha * 0.85);
        const len = 1 + Math.random() * (2 + dy * 4);
        ctx.fillRect(x, y, len, 1 + dy);
      }

      const vignette = ctx.createRadialGradient(
        width / 2,
        height * 0.55,
        height * 0.25,
        width / 2,
        height * 0.55,
        height * 0.9,
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,8,0.34)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      moodName.textContent = palette.name;
      moodTime.textContent = formatClockMinutes(displayMinutes);

      animationFrame = requestAnimationFrame(draw);
    }

    const handleSliderInput = () => {
      timeOfDay = Number(slider.value) / 1000;
      displayMinutes = timelineValueToClockMinutes(timeOfDay);
    };
    const handleMouseMove = (event) => updatePointer(event.clientX);
    const handleTouchMove = (event) => {
      if (event.touches.length > 0) updatePointer(event.touches[0].clientX);
    };

    resize();
    slider.addEventListener('input', handleSliderInput);
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      slider.removeEventListener('input', handleSliderInput);
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const initialClock = initialClockRef.current;
  const initialTimelineValue = Math.round(initialClock.timelineValue * 1000);
  const initialMoodName = getPalette(initialClock.timelineValue).name;
  const initialMoodTime = formatClockMinutes(initialClock.totalMinutes);

  return (
    <section ref={sectionRef} className="tides-hero" aria-label="TIDES cinematic ocean hero">
      <canvas ref={canvasRef} className="tides-ocean" aria-hidden="true" />

      <div className="tides-ui">
        <div className="tides-ui-top">
          <div className="tides-label">◑ &nbsp;36 TECH FREEDOM</div>
          <div className="tides-mood">
            <span ref={moodNameRef}>{initialMoodName}</span>
            <span ref={moodTimeRef} className="tides-mood-time">
              {initialMoodTime}
            </span>
          </div>
        </div>

        <div className="tides-ui-bottom">
          <p className="tides-caption">
            Same sea — <em>every hour a different blue.</em>
          </p>

          <div className="tides-slider-wrap">
            <span className="tides-slider-end">DAWN</span>
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max="1000"
              defaultValue={initialTimelineValue}
              aria-label="Ocean time of day"
            />
            <span className="tides-slider-end">NIGHT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
