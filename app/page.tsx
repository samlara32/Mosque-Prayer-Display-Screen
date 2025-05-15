"use client"

import MosqueScreen from "@/components/MosqueScreen/MosqueScreen"
import ServiceWorker from "@/components/ServiceWorker/ServiceWorker"
import {
  getJummahTimes,
  getMetaData,
  getPrayerTimesForToday,
  getPrayerTimesForTomorrow,
} from "@/services/MosqueDataService"

export default async function Home() {
  // Fetch data
  const metadata = await getMetaData()
  const today = await getPrayerTimesForToday()
  const tomorrow = await getPrayerTimesForTomorrow()
  const jummahTimes = await getJummahTimes()

  return (
    <>
      <ServiceWorker />
      <MosqueScreen 
        today={today} 
        tomorrow={tomorrow} 
        metadata={metadata} 
        jummahTimes={jummahTimes} 
      />
    </>
  )
}