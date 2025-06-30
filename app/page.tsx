"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, X, Zap, Palette, ImageIcon, Sun, Moon, Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import { AnimatedGlitter, FloatingShapes } from "@/components/animated-glitter"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const generatorRef = useRef<HTMLDivElement>(null)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateImage = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const response = await fetch("/api/generate-image-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (err) {
      setError("Failed to generate image. Please try again.")
      console.error("Error generating image:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isGenerating) {
      generateImage()
    }
  }

  const downloadImage = () => {
    if (!generatedImage) return

    try {
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `ai-artwork-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image. Please try right-clicking and saving manually.')
    }
  }

  const generateNewImage = () => {
    setGeneratedImage(null)
    setError(null)
    // Focus back to the input
    const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement
    if (inputElement) {
      inputElement.focus()
    }
  }

  const generateVariation = () => {
    if (!prompt.trim()) return
    generateImage()
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Animated Background */}
      <AnimatedGlitter isDarkMode={isDarkMode} />
      <FloatingShapes isDarkMode={isDarkMode} />

      {/* Content */}
      <div className="relative z-10">
        {/* Top Banner */}
        {showBanner && (
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient text-white px-4 py-3 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                  style={{
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                    animationDelay: Math.random() * 2 + "s",
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <Zap className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">
                Professional AI Art Generation - Completely Free & No Registration Required!
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <header
          className={`border-b px-4 py-4 transition-colors duration-300 backdrop-blur-sm ${isDarkMode ? "bg-gray-800/90 border-gray-700" : "bg-white/90 border-gray-200"}`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Xarlex Artify Logo"
                width={32}
                height={32}
                className="rounded-lg"
                priority
              />

              <span
                className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Xarlex Artify
              </span>
            </div>

            <div className="hidden md:block">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Button
                onClick={scrollToGenerator}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 py-20 text-center relative">
          <div className="max-w-4xl mx-auto relative">
            <Badge
              variant="secondary"
              className={`mb-8 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 animate-pulse-glow ${isDarkMode ? "bg-purple-900/30 text-purple-300 border-purple-700" : "bg-purple-100 text-purple-700 border-purple-200"}`}
            >
              <Sparkles className="w-4 h-4 mr-2 animate-spin-slow" />
              Premium AI Technology • Enterprise Grade • Always Free
            </Badge>

            <h1
              className={`text-5xl md:text-7xl font-black mb-6 leading-tight transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Create{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                Stunning
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                AI Artwork
              </span>
            </h1>

            <p
              className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300 animate-fade-in-up ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Empowering creativity through cutting-edge AI technology. Transform your imagination into stunning visual art with our advanced FLUX.1-dev model. Professional quality, lightning-fast generation, completely free.
            </p>

            <div className="flex justify-center">
              <Button
                onClick={scrollToGenerator}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-glow"
              >
                Start Creating Now
                <Sparkles className="ml-2 w-5 h-5 animate-spin-slow" />
              </Button>
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section
          ref={generatorRef}
          className={`px-4 py-20 transition-colors duration-300 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              Visualize{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Your Vision
              </span>
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Experience next-generation AI art creation with our intuitive platform. Built for creators, designers, and visionaries.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card
              className={`shadow-xl rounded-2xl p-8 md:p-12 transition-all duration-300 hover:shadow-2xl border-2 animate-pulse-glow ${isDarkMode ? "bg-gray-700/80 border-gray-600 backdrop-blur-sm" : "bg-white/80 border-gray-200 backdrop-blur-sm"}`}
            >
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3
                    className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Xarlex Artify Generator
                  </h3>
                  <p className={`transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Unleash your creativity with our advanced AI art generation platform
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="A futuristic cityscape with neon lights and flying cars at sunset..."
                      className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 hover:shadow-lg ${isDarkMode ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "border-gray-200 placeholder-gray-400"}`}
                      disabled={isGenerating}
                    />
                    {prompt && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Sparkles className="w-5 h-5 text-purple-500 animate-spin-slow" />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={generateImage}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 animate-gradient"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        <span>Creating magic...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                        <span>Generate Artwork</span>
                      </div>
                    )}
                  </Button>

                  {error && (
                    <div
                      className={`text-center p-4 border rounded-xl transition-colors duration-300 ${isDarkMode ? "bg-red-900/20 border-red-700" : "bg-red-50 border-red-200"}`}
                    >
                      <p
                        className={`font-medium transition-colors duration-300 ${isDarkMode ? "text-red-400" : "text-red-600"}`}
                      >
                        {error}
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="flex flex-col justify-center items-center py-12 space-y-6">
                      <div className="relative">
                        <div className="flex space-x-2">
                          <div
                            className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                        {/* Outer glow ring */}
                        <div className="absolute inset-0 animate-ping">
                          <div className="w-full h-full bg-purple-400 rounded-full opacity-20"></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
                          ✨ Generating your professional artwork...
                        </p>
                        <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Creating with enterprise-grade AI technology
                        </p>
                      </div>
                    </div>
                  )}

                  {generatedImage && (
                    <div className="animate-fade-in-up">
                      <div
                        className={`relative rounded-2xl overflow-hidden shadow-2xl border transition-colors duration-300 ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}
                      >
                        <Image
                          src={generatedImage || "/placeholder.svg"}
                          alt="Generated AI artwork"
                          width={800}
                          height={800}
                          className="w-full h-auto object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
                        <Button
                          onClick={downloadImage}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download
                        </Button>

                        <Button
                          onClick={generateVariation}
                          disabled={isGenerating}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 hover:scale-105 animate-gradient"
                        >
                          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                          {isGenerating ? "Generating..." : "New Variation"}
                        </Button>

                        <Button
                          onClick={generateNewImage}
                          variant="outline"
                          className={`py-3 rounded-xl font-medium transition-all duration-300 border-2 hover:scale-105 ${isDarkMode
                            ? "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/25"
                            : "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white hover:shadow-lg hover:shadow-purple-500/25"
                            }`}
                        >
                          <RefreshCw className="w-5 h-5 mr-2" />
                          Start Over
                        </Button>
                      </div>

                      <div
                        className={`text-center mt-6 p-4 rounded-xl border transition-colors duration-300 ${isDarkMode ? "bg-purple-900/20 border-purple-700" : "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-100"}`}
                      >
                        <p
                          className={`font-medium transition-colors duration-300 ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}
                        >
                          ✨ Your professional artwork is ready!
                        </p>
                        <p
                          className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}
                        >
                          Download in high quality, create variations, or start a new masterpiece
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className={`px-4 py-20 transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2
                className={`text-4xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Why Choose Xarlex Artify?
              </h2>
              <p className={`text-xl transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Professional AI art generation platform built for modern creators
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div
                className={`text-center p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl group ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <Zap className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>
                <h3
                  className={`text-xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Enterprise Performance
                </h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  State-of-the-art technology delivering professional-grade results in seconds with enterprise-level reliability.
                </p>
              </div>

              <div
                className={`text-center p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl group ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-white group-hover:animate-spin-slow" />
                </div>
                <h3
                  className={`text-xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Always Free Access
                </h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Premium AI technology accessible to everyone. No subscriptions, no hidden fees, unlimited creative potential
                </p>
              </div>

              <div
                className={`text-center p-8 rounded-2xl shadow-lg border transition-all duration-300 hover:scale-105 hover:shadow-xl group ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:animate-pulse-glow transition-all duration-300">
                  <ImageIcon className="w-8 h-8 text-white group-hover:animate-bounce-slow" />
                </div>
                <h3
                  className={`text-xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Privacy First
                </h3>
                <p className={`transition-colors duration-300 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Zero data collection, complete privacy protection. Your creative process remains entirely confidential
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={`border-t px-4 py-8 transition-colors duration-300 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="Xarlex Artify Logo"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
                <span className={`font-bold transition-colors duration-300 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Xarlex Artify
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
                <p className={`transition-colors duration-300 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  © 2025 Xarlex. All rights reserved.
                </p>
                <a
                  href="https://xarlex.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-all duration-300 hover:scale-105 ${isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"}`}
                >
                  xarlex.vercel.app
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
