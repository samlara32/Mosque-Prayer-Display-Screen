"use client"

import { ReactNode } from "react"
import { useScreenSize } from "@/components/ScreenSizes/ScreenSizeDetection"

type ResponsiveLayoutProps = {
  children: ReactNode
  small?: ReactNode
  medium?: ReactNode
  large?: ReactNode
  extraLarge?: ReactNode
}

export default function ResponsiveLayout({
  children,
  small,
  medium,
  large,
  extraLarge,
}: ResponsiveLayoutProps) {
  const { deviceCategory } = useScreenSize()
  
  // Return the appropriate layout based on the device category
  switch (deviceCategory) {
    case "small":
      return <>{small || children}</>
    case "medium":
      return <>{medium || children}</>
    case "large":
      return <>{large || children}</>
    case "extra-large":
      return <>{extraLarge || children}</>
    default:
      return <>{children}</>
  }
}