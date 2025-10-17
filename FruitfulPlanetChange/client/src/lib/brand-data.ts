// Sample brand data for demonstration and testing
export const sampleSectors = [
  {
    id: 1,
    name: "Agriculture & Biotech",
    emoji: "🌱",
    description: "Advanced biotech solutions for sustainable farming",
    brandCount: 84,
    subnodeCount: 190
  },
  {
    id: 2,
    name: "Food, Soil & Farming", 
    emoji: "🥦",
    description: "Food production and soil management systems",
    brandCount: 83,
    subnodeCount: 328
  },
  {
    id: 3,
    name: "Banking & Finance",
    emoji: "🏦", 
    description: "Secure financial services and banking infrastructure",
    brandCount: 136,
    subnodeCount: 136
  },
  {
    id: 4,
    name: "AI, Logic & Grid",
    emoji: "🧠",
    description: "Artificial intelligence and logic systems",
    brandCount: 188,
    subnodeCount: 484
  },
  {
    id: 5,
    name: "Gaming & Simulation",
    emoji: "🎮",
    description: "Interactive gaming and simulation platforms", 
    brandCount: 10,
    subnodeCount: 30
  }
]

export const integrationTypes = [
  "VaultMesh™",
  "HotStack", 
  "FAA.ZONE™"
]

export const statusTypes = [
  "active",
  "maintenance", 
  "offline"
]

// Utility functions for working with brand data
export function getBrandCountBySector(sectorId: number) {
  const sector = sampleSectors.find(s => s.id === sectorId)
  return sector ? sector.brandCount + sector.subnodeCount : 0
}

export function getTotalBrandCount() {
  return sampleSectors.reduce((total, sector) => 
    total + sector.brandCount + sector.subnodeCount, 0
  )
}

export function getTotalCoreBrands() {
  return sampleSectors.reduce((total, sector) => 
    total + sector.brandCount, 0
  )
}

export function getTotalSubnodes() {
  return sampleSectors.reduce((total, sector) => 
    total + sector.subnodeCount, 0
  )
}
