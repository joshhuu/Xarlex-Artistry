"use client"

import { useEffect, useRef, useState } from "react"

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let orbs: FloatingOrb[] = []
    let time = 0

    class FloatingOrb {
      x: number
      y: number
      baseX: number
      baseY: number
      vx: number
      vy: number
      radius: number
      color: string
      opacity: number
      pulseSpeed: number
      hue: number

      constructor() {
        this.baseX = Math.random() * canvas.width
        this.baseY = Math.random() * canvas.height
        this.x = this.baseX
        this.y = this.baseY
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.radius = Math.random() * 120 + 60
        this.hue = Math.random() * 360
        this.opacity = Math.random() * 0.4 + 0.1
        this.pulseSpeed = Math.random() * 0.02 + 0.01
      }

      update() {
        // Floating movement
        this.baseX += this.vx
        this.baseY += this.vy

        // Bounce off edges
        if (this.baseX < -this.radius || this.baseX > canvas.width + this.radius) this.vx *= -1
        if (this.baseY < -this.radius || this.baseY > canvas.height + this.radius) this.vy *= -1

        // Mouse interaction
        const mouseDistance = Math.sqrt(Math.pow(mousePos.x - this.baseX, 2) + Math.pow(mousePos.y - this.baseY, 2))
        const maxDistance = 200
        const influence = Math.max(0, 1 - mouseDistance / maxDistance)

        this.x = this.baseX + (mousePos.x - this.baseX) * influence * 0.1
        this.y = this.baseY + (mousePos.y - this.baseY) * influence * 0.1

        // Color shifting
        this.hue += 0.2
        if (this.hue > 360) this.hue = 0

        // Pulsing effect
        this.opacity = 0.2 + Math.sin(time * this.pulseSpeed) * 0.15
      }

      draw() {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)

        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 60%, ${this.opacity})`)
        gradient.addColorStop(0.4, `hsla(${this.hue + 30}, 80%, 50%, ${this.opacity * 0.6})`)
        gradient.addColorStop(1, `hsla(${this.hue + 60}, 90%, 40%, 0)`)

        ctx.save()
        ctx.filter = "blur(1px)"
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initOrbs = () => {
      orbs = []
      const orbCount = Math.min(8, Math.floor((canvas.width * canvas.height) / 100000) + 3)
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new FloatingOrb())
      }
    }

    const drawMeshGradient = () => {
      // Animated mesh gradient background
      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      const gradient2 = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height)

      const hue1 = (time * 0.5) % 360
      const hue2 = (time * 0.3 + 120) % 360
      const hue3 = (time * 0.4 + 240) % 360

      gradient1.addColorStop(0, `hsla(${hue1}, 40%, 10%, 0.8)`)
      gradient1.addColorStop(0.5, `hsla(${hue2}, 30%, 5%, 0.9)`)
      gradient1.addColorStop(1, `hsla(${hue3}, 35%, 8%, 0.85)`)

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Overlay gradient
      gradient2.addColorStop(0, `hsla(${hue2}, 50%, 15%, 0.3)`)
      gradient2.addColorStop(1, `hsla(${hue1}, 45%, 12%, 0.4)`)

      ctx.globalCompositeOperation = "overlay"
      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "source-over"
    }

    const animate = () => {
      time += 1

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw animated mesh gradient
      drawMeshGradient()

      // Update and draw orbs
      orbs.forEach((orb) => {
        orb.update()
        orb.draw()
      })

      // Add subtle noise texture
      ctx.save()
      ctx.globalAlpha = 0.03
      ctx.fillStyle = `hsl(${(time * 0.1) % 360}, 20%, 50%)`
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        ctx.fillRect(x, y, 1, 1)
      }
      ctx.restore()

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initOrbs()
    animate()

    const handleResize = () => {
      resizeCanvas()
      initOrbs()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [mousePos])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
      {/* Additional CSS gradient overlay for extra depth */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-tr from-pink-900/10 via-transparent to-cyan-900/10" />
    </>
  )
}
