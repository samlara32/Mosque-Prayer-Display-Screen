"use client"

import { useEffect, useState } from "react"
import Clock from "@/components/Clock/Clock"
import Date from "@/components/Date/Date"
import MosqueMetadata from "@/components/MosqueMetadata/MosqueMetadata"
import Notice from "@/components/Notice/Notice"
import PrayerTimes from "@/components/PrayerTimes/PrayerTimes"
import SunriseJummahTiles from "@/components/SunriseJummahTiles/SunriseJummahTiles"
import ScreenSizeDetector, { useScreenSize } from "@/components/ScreenSizes/ScreenSizeDetection"
import ResponsiveLayout from "@/components/ResponsiveLayout/ResponsiveLayout"
import { DailyPrayerTime } from "@/types/DailyPrayerTimeType"
import { JummahTimes } from "@/types/JummahTimesType"
import { MosqueMetadataType } from "@/types/MosqueDataType"
import Blackout from "@/components/Blackout/Blackout"
import ScreenSizeOverride from "../ScreenSizeOverride"

export default function MosqueScreen({
  today,
  tomorrow,
  metadata,
  jummahTimes,
}: {
  today: DailyPrayerTime
  tomorrow: DailyPrayerTime
  metadata: MosqueMetadataType
  jummahTimes: JummahTimes
}) {
  const { deviceCategory } = useScreenSize()
  
  // Layout for small screens (phones, small tablets)
  const SmallScreenLayout = (
    <div className="bg-mosqueGreen min-h-screen flex flex-col text-white p-4">
      <div className="mb-8">
        <MosqueMetadata metadata={metadata} />
      </div>
      <div className="mb-8">
        <Clock darkMode={true} />
        <Date />
      </div>
      <div className="mb-6">
        <SunriseJummahTiles sunrise={today.sunrise_start} jummahTimes={jummahTimes} />
      </div>
      <div className="flex-grow">
        <PrayerTimes today={today} tomorrow={tomorrow} />
      </div>
      <div className="mt-4">
        <Notice />
      </div>
    </div>
  )
  
  // Layout for medium screens (laptops, monitors)
  const MediumScreenLayout = (
    <div className="bg-mosqueGreen min-h-screen flex flex-col text-white p-6">
      <div className="flex justify-between items-center mb-8">
        <MosqueMetadata metadata={metadata} />
        <div>
          <Clock darkMode={true} />
          <Date />
        </div>
      </div>
      <div className="mb-8">
        <SunriseJummahTiles sunrise={today.sunrise_start} jummahTimes={jummahTimes} />
      </div>
      <div className="flex-grow">
        <PrayerTimes today={today} tomorrow={tomorrow} />
      </div>
      <div className="mt-6">
        <Notice />
      </div>
    </div>
  )
  
  // Layout for large screens (large monitors, small TVs)
  const LargeScreenLayout = (
    <div className="bg-mosqueGreen min-h-screen flex flex-col text-white p-8">
      <div className="flex justify-between items-center mb-10">
        <MosqueMetadata metadata={metadata} />
        <div className="flex items-center gap-10">
          <Clock darkMode={true} />
          <Date />
        </div>
      </div>
      <div className="mb-10">
        <SunriseJummahTiles sunrise={today.sunrise_start} jummahTimes={jummahTimes} />
      </div>
      <div className="flex-grow">
        <PrayerTimes today={today} tomorrow={tomorrow} />
      </div>
      <div className="mt-8 flex justify-end">
        <Notice />
      </div>
    </div>
  )
  
  // Layout for extra large screens (large TVs, digital signage)
  const ExtraLargeScreenLayout = (
    <div className="bg-mosqueGreen min-h-screen flex flex-col text-white p-10">
      <div className="flex justify-between items-center mb-12">
        <div className="flex-1">
          <MosqueMetadata metadata={metadata} />
        </div>
        <div className="flex-1 flex justify-center">
          <Clock darkMode={true} />
        </div>
        <div className="flex-1 flex justify-end">
          <Date />
        </div>
      </div>
      <div className="mb-12">
        <SunriseJummahTiles sunrise={today.sunrise_start} jummahTimes={jummahTimes} />
      </div>
      <div className="flex-grow">
        <PrayerTimes today={today} tomorrow={tomorrow} />
      </div>
      <div className="mt-10 flex justify-between items-center">
        <div className="flex-1">
          {/* Additional content for extra large screens */}
          <div className="text-2xl">Next prayer highlighted above</div>
        </div>
        <div className="flex-1 flex justify-end">
          <Notice />
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      <Blackout prayerTimeToday={today} />
      <ScreenSizeDetector />
      <ScreenSizeOverride />
      
      <ResponsiveLayout
        small={SmallScreenLayout}
        medium={MediumScreenLayout}
        large={LargeScreenLayout}
        extraLarge={ExtraLargeScreenLayout}
      >
        {/* Default layout if no match */}
        {MediumScreenLayout}
      </ResponsiveLayout>
    </>
  )
}