'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * KoiBackground
 * A minimalist fine-line tattoo-inspired background featuring a slowly-rotating
 * Yin-Yang symbol with two koi fish paths drawing and undraining in ink style.
 * Uses only SVG paths + Framer Motion — zero external dependencies.
 */
export function InkBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none -z-10">
      {/* Very subtle radial gradient to soften edges */}
      <div className="absolute inset-0 bg-radial-gradient" 
           style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(var(--background), 0.8) 100%)' }} 
      />

      {/* Whole composition: slowly rotating yin-yang + koi paths */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
        className="relative opacity-40 text-foreground"
        style={{ width: '800px', height: '800px', maxWidth: '150vw' }}
      >
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          
          {/* ─── YIN-YANG OUTLINE ─────────────────────────────────────────────── */}
          {/* Outer circle */}
          <motion.circle
            cx="100" cy="100" r="95"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 4, ease: 'easeInOut' }}
          />
          
          {/* Vertical divider (S-curve from top to bottom) */}
          <motion.path
            d="M 100 5 
               C 100 5, 150 52, 100 100 
               C 50 148, 100 195, 100 195"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 1] }}
            transition={{ duration: 5, delay: 1, ease: 'easeInOut' }}
          />

          {/* Small upper dot (dark fish's eye) */}
          <motion.circle
            cx="100" cy="52" r="10"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 3 }}
          />
          
          {/* Small lower dot (light fish's eye) */}
          <motion.circle
            cx="100" cy="148" r="10"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 3.5 }}
          />

          {/* ─── KOI FISH 1 (upper half — dark) ─────────────────────────────────── */}
          {/* Body */}
          <motion.path
            d="M 100 10
               C 130 15, 175 40, 175 75
               C 175 90, 160 100, 148 100
               C 128 100, 112 88, 100 70
               C 88 55, 78 30, 100 10 Z"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 12, delay: 4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          />
          {/* Tail fin */}
          <motion.path
            d="M 100 10 C 80 -5, 60 -10, 65 10 C 70 28, 95 20, 100 10"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 8, delay: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 8 }}
          />
          {/* Scale lines (decorative) */}
          <motion.path
            d="M 130 40 C 140 35, 155 45, 150 55"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, delay: 8, repeat: Infinity, repeatDelay: 12, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 140 65 C 155 60, 168 72, 162 82"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, delay: 9, repeat: Infinity, repeatDelay: 12, ease: 'easeInOut' }}
          />
          {/* Whisker */}
          <motion.path
            d="M 110 15 C 120 5, 135 2, 140 10"
            stroke="currentColor" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, delay: 10, repeat: Infinity, repeatDelay: 13, ease: 'easeInOut' }}
          />
          {/* Eye */}
          <motion.circle
            cx="115" cy="24" r="2.5"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 10, delay: 5, repeat: Infinity, repeatDelay: 6 }}
          />

          {/* ─── KOI FISH 2 (lower half — light) ─────────────────────────────── */}
          {/* Body — mirrored and rotated */}
          <motion.path
            d="M 100 190
               C 70 185, 25 160, 25 125
               C 25 110, 40 100, 52 100
               C 72 100, 88 112, 100 130
               C 112 145, 122 170, 100 190 Z"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: 12, delay: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
          />
          {/* Tail fin */}
          <motion.path
            d="M 100 190 C 120 205, 140 210, 135 190 C 130 172, 105 180, 100 190"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: 8, delay: 8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 8 }}
          />
          {/* Scale lines */}
          <motion.path
            d="M 70 160 C 60 165, 45 155, 50 145"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, delay: 10, repeat: Infinity, repeatDelay: 12, ease: 'easeInOut' }}
          />
          <motion.path
            d="M 60 135 C 45 140, 32 128, 38 118"
            stroke="currentColor" strokeWidth="1.2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 4, delay: 11, repeat: Infinity, repeatDelay: 12, ease: 'easeInOut' }}
          />
          {/* Whisker */}
          <motion.path
            d="M 90 185 C 80 195, 65 198, 60 190"
            stroke="currentColor" strokeWidth="1" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 3, delay: 12, repeat: Infinity, repeatDelay: 13, ease: 'easeInOut' }}
          />
          {/* Eye */}
          <motion.circle
            cx="85" cy="176" r="2.5"
            stroke="currentColor" strokeWidth="1.5" fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 10, delay: 7, repeat: Infinity, repeatDelay: 6 }}
          />

          {/* ─── SMALL DECORATIVE DOTS (water bubbles) ───────────────────── */}
          {[
            { cx: 155, cy: 30, r: 1, delay: 13 },
            { cx: 162, cy: 48, r: 0.8, delay: 14 },
            { cx: 40, cy: 165, r: 1, delay: 15 },
            { cx: 33, cy: 148, r: 0.8, delay: 16 },
          ].map((dot, i) => (
            <motion.circle
              key={i}
              cx={dot.cx} cy={dot.cy} r={dot.r}
              stroke="currentColor" strokeWidth="1" fill="none"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0, 1, 1.5] }}
              transition={{ duration: 4, delay: dot.delay, repeat: Infinity, repeatDelay: 10, ease: 'easeOut' }}
            />
          ))}

        </svg>
      </motion.div>
    </div>
  );
}
