"use client"

import { useEffect, useState } from "react"

export interface ScreenSize {
  width: number
  height: number
  dpi: number
  physicalWidth: number // in inches
  physicalHeight: number // in inches
  diagonal: number // in inches
  deviceCategory: "small" | "medium" | "large" | "extra-large"
}

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: 0,
    height: 0,
    dpi: 96, // Default DPI
    physicalWidth: 0,
    physicalHeight: 0,
    diagonal: 0,
    deviceCategory: "medium",
  })
  
  // Check for override in localStorage
  const [override, setOverride] = useState<string | null>(null)
  
  useEffect(() => {
    // Check for localStorage override
    const checkOverride = () => {
      const savedOverride = localStorage.getItem("screenSizeOverride")
      if (savedOverride) {
        setOverride(savedOverride)
      } else {
        setOverride(null)
      }
    }
    
    // Initial check
    checkOverride()
    
    // Set up event listener for storage changes (in case override is changed in another tab)
    window.addEventListener("storage", checkOverride)
    
    return () => {
      window.removeEventListener("storage", checkOverride)
    }
  }, [])

  useEffect(() => {
    function updateScreenSize() {
      // Get screen dimensions in pixels (actual physical pixels, not CSS pixels)
      const width = window.screen.width
      const height = window.screen.height
      
      // Detect DPI considering OS scaling
      const dpi = detectDpi()
      
      // Get device pixel ratio (accounts for high-DPI screens and OS scaling)
      const devicePixelRatio = window.devicePixelRatio || 1
      
      // Calculate physical dimensions (inches), accounting for scaling
      const scaledDpi = dpi * devicePixelRatio
      const physicalWidth = width / scaledDpi
      const physicalHeight = height / scaledDpi
      const diagonal = Math.sqrt(physicalWidth * physicalWidth + physicalHeight * physicalHeight)
      
      // For cases where automatic detection might not be accurate (like your 15.6" laptop),
      // let's check if the calculated diagonal is significantly different from expected values
      // for common laptop sizes and adjust if necessary
      let adjustedDiagonal = diagonal
      const aspectRatio = width / height
      
      if (diagonal > 10 && diagonal < 20) {
        // Laptop range - check for common sizes
        const commonLaptopSizes = [13.3, 14, 15.6, 16, 17.3]
        const closestSize = commonLaptopSizes.reduce((prev, curr) => 
          Math.abs(curr - diagonal) < Math.abs(prev - diagonal) ? curr : prev
        )
        
        // If we're within 25% of a common size, adjust to that size
        if (Math.abs(diagonal - closestSize) / closestSize < 0.25) {
          adjustedDiagonal = closestSize
        }
      }
      
      // Determine device category based on diagonal size
      let deviceCategory: "small" | "medium" | "large" | "extra-large" = "medium"
      
      if (adjustedDiagonal < 13) {
        deviceCategory = "small" // Small screens (phones, small tablets)
      } else if (adjustedDiagonal >= 13 && adjustedDiagonal < 27) {
        deviceCategory = "medium" // Medium screens (laptops, monitors)
      } else if (adjustedDiagonal >= 27 && adjustedDiagonal < 40) {
        deviceCategory = "large" // Large screens (large monitors, small TVs)
      } else {
        deviceCategory = "extra-large" // Extra large screens (large TVs, digital signage)
      }
      
      // Apply override if present
      if (override) {
        deviceCategory = override as "small" | "medium" | "large" | "extra-large"
      }
      
      setScreenSize({
        width,
        height,
        dpi: scaledDpi,
        physicalWidth,
        physicalHeight,
        diagonal: adjustedDiagonal,
        deviceCategory,
      })
    }

    // DPI detection using a technique that works in most browsers
    function detectDpi() {
      // Create a div with a specific physical size in inches
      const div = document.createElement("div")
      div.style.width = "1in"
      div.style.height = "1in"
      div.style.position = "absolute"
      div.style.left = "-100%"
      div.style.top = "-100%"
      document.body.appendChild(div)
      
      // Get the pixel size of this "1 inch" element
      const pixelWidth = div.offsetWidth
      
      // Clean up
      document.body.removeChild(div)
      
      return pixelWidth
    }

    // Initial update
    updateScreenSize()
    
    // Update on window resize
    window.addEventListener("resize", updateScreenSize)
    
    return () => {
      window.removeEventListener("resize", updateScreenSize)
    }
  }, [])

  return screenSize
}

export default function ScreenSizeDetector() {
  const screenSize = useScreenSize()
  
  // Add a debug mode that shows screen information
  const [showDebug, setShowDebug] = useState(false)
  
  useEffect(() => {
    // Add keyboard shortcut to toggle debug mode (Ctrl+Shift+D)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setShowDebug(!showDebug)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [showDebug])
  
  if (!showDebug) return null
  
  return (
    <div className="fixed bottom-2 right-2 bg-black bg-opacity-80 text-white p-2 rounded text-xs z-50">
      <p>Resolution: {screenSize.width}x{screenSize.height} px</p>
      <p>Device Pixel Ratio: {window.devicePixelRatio.toFixed(2)}x</p>
      <p>DPI: {screenSize.dpi.toFixed(1)}</p>
      <p>Physical: {screenSize.physicalWidth.toFixed(1)}″×{screenSize.physicalHeight.toFixed(1)}″</p>
      <p>Diagonal: {screenSize.diagonal.toFixed(1)}″</p>
      <p>Category: {screenSize.deviceCategory}</p>
      <p className="text-xs mt-1 opacity-75">Press Ctrl+Shift+D to hide</p>
    </div>
  )
}