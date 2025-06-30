"use client"

import React from "react"

interface GlitterProps {
  isDarkMode?: boolean
}

export function AnimatedGlitter({ isDarkMode = false }: GlitterProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Glitter Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={`absolute animate-float-${i % 4} ${
            isDarkMode 
              ? "bg-gradient-to-r from-purple-400 to-pink-400" 
              : "bg-gradient-to-r from-purple-500 to-blue-500"
          }`}
          style={{
            width: Math.random() * 8 + 4 + "px",
            height: Math.random() * 8 + 4 + "px",
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDelay: Math.random() * 4 + "s",
            animationDuration: (Math.random() * 3 + 4) + "s",
            clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
          }}
        />
      ))}
      
      {/* Larger Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className={`absolute animate-spin-slow ${
            isDarkMode 
              ? "text-yellow-300" 
              : "text-yellow-500"
          }`}
          style={{
            left: Math.random() * 100 + "%",
            top: Math.random() * 100 + "%",
            animationDelay: Math.random() * 2 + "s",
            fontSize: Math.random() * 20 + 15 + "px",
          }}
        >
          ✨
        </div>
      ))}
    </div>
  )
}

export function FloatingShapes({ isDarkMode = false }: GlitterProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating Geometric Shapes */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`shape-${i}`}
          className={`absolute animate-bounce-slow opacity-20 ${
            isDarkMode 
              ? "bg-gradient-to-br from-purple-500 to-pink-500" 
              : "bg-gradient-to-br from-blue-400 to-purple-500"
          }`}
          style={{
            width: Math.random() * 60 + 40 + "px",
            height: Math.random() * 60 + 40 + "px",
            left: Math.random() * 90 + "%",
            top: Math.random() * 90 + "%",
            animationDelay: Math.random() * 3 + "s",
            borderRadius: i % 2 === 0 ? "50%" : "20%",
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  )
}
