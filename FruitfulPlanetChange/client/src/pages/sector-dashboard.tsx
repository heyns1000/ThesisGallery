import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRoute } from "wouter"
import { SectorDashboardTemplate } from "@/components/portal/sector-dashboard-template"
import { Loader2, AlertTriangle } from "lucide-react"
import type { Sector, Brand } from "@shared/schema"

export default function SectorDashboard() {
  const [, params] = useRoute("/sector/:sectorId")
  const sectorId = params?.sectorId

  const { data: sectors = [] } = useQuery<Sector[]>({
    queryKey: ["/api/sectors"]
  })

  // Find sector by slug or ID
  console.log('Looking for sector:', sectorId)
  console.log('Available sectors:', sectors.map(s => ({ 
    id: s.id, 
    name: s.name, 
    slug: s.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[⚡🌱💼🏢📦🔧🎮🎨🎭🍎♻️🎵💊⚡🏠]/g, '') 
  })))
  
  const sector = sectors.find(s => {
    const sectorSlug = s.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[⚡🌱💼🏢📦🔧🎮🎨🎭🍎♻️🎵💊⚡🏠]/g, '')
    const match = sectorSlug === sectorId || s.id.toString() === sectorId
    console.log(`Comparing: ${sectorSlug} === ${sectorId} OR ${s.id} === ${sectorId} => ${match}`)
    return match
  })

  const sectorLoading = false

  const { data: allBrands = [] } = useQuery<Brand[]>({
    queryKey: ["/api/brands"]
  })

  const brands = sector ? allBrands.filter(brand => brand.sectorId === sector.id) : []
  const brandsLoading = false

  if (sectorLoading || brandsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading sector dashboard...</p>
        </div>
      </div>
    )
  }

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Sector Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested sector dashboard could not be loaded.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Looking for sector ID: {sectorId}</p>
            <p>Available sectors: {sectors.length}</p>
            {sectors.length > 0 && (
              <div className="mt-2">
                {sectors.slice(0, 3).map(s => (
                  <div key={s.id}>
                    {s.name} (ID: {s.id}) - Slug: {s.name.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^[⚡🌱💼🏢📦🔧🎮🎨🎭🍎♻️🎵💊⚡🏠]/g, '')}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <SectorDashboardTemplate 
        sector={sector} 
        brands={brands}
        className="max-w-7xl mx-auto"
      />
    </div>
  )
}