"use client"

import CitySearchForm from "@/components/cities/CitySearchForm"

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">🔍 Explore Cities</h1>
        <p className="text-gray-500 mt-1">
          Search any city in the world and see its current air quality data.
        </p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl text-black p-6">
        <CitySearchForm />
      </div>
    </div>
  )
}