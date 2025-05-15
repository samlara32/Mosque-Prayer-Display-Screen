"use client"

import { useEffect, useState } from "react"
import { useScreenSize } from "@/components/ScreenSizes/ScreenSizeDetection"

// Component that allows manual overriding of detected screen size
export default function ScreenSizeOverride() {
  const { deviceCategory } = useScreenSize()
  const [override, setOverride] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(false)
  
  // Load override from localStorage on mount
  useEffect(() => {
    const savedOverride = localStorage.getItem("screenSizeOverride")
    if (savedOverride) {
      setOverride(savedOverride)
    }
    
    // Add keyboard shortcut to toggle controls (Ctrl+Shift+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "Z" || e.key === "z")) {
        console.log("Ctrl+Shift+S pressed") // <-- Add this line
        e.preventDefault()
        setShowControls(prev => !prev)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  
  // Save override to localStorage when changed
  useEffect(() => {
    if (override) {
      localStorage.setItem("screenSizeOverride", override)
    } else {
      localStorage.removeItem("screenSizeOverride")
    }
  }, [override])
  
  if (!showControls) return null
  
  return (
    <div className="fixed top-2 right-2 bg-black bg-opacity-80 text-white p-3 rounded z-50">
      <div className="text-sm font-medium mb-2">Screen Size Override</div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="auto"
            name="sizeOverride"
            checked={!override}
            onChange={() => setOverride(null)}
          />
          <label htmlFor="auto" className="text-xs">Auto (Detected: {deviceCategory})</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="small"
            name="sizeOverride"
            checked={override === "small"}
            onChange={() => setOverride("small")}
          />
          <label htmlFor="small" className="text-xs">Small (phones, small tablets)</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="medium"
            name="sizeOverride"
            checked={override === "medium"}
            onChange={() => setOverride("medium")}
          />
          <label htmlFor="medium" className="text-xs">Medium (laptops, monitors)</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="large"
            name="sizeOverride"
            checked={override === "large"}
            onChange={() => setOverride("large")}
          />
          <label htmlFor="large" className="text-xs">Large (large monitors)</label>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="extra-large"
            name="sizeOverride"
            checked={override === "extra-large"}
            onChange={() => setOverride("extra-large")}
          />
          <label htmlFor="extra-large" className="text-xs">Extra Large (TVs, signage)</label>
        </div>
      </div>
      <p className="text-xs mt-2 opacity-75">Press Ctrl+Shift+S to hide</p>
    </div>
  )
}