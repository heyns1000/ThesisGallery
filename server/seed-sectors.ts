import { type InsertSector } from "@shared/schema";

/**
 * Official FAA.ZONE INDEX Sector Data
 * Source: Seedwave™ Admin Portal Specification
 * 
 * 13 Active Sectors
 * 1406 Total Core Brands
 * 6437 Total Nodes
 */

export const officialSectorData: InsertSector[] = [
  // 13 Main Active Sectors (from FAA.ZONE INDEX)
  {
    sectorName: "Retail, Vendor & Trade",
    glyph: "🧺",
    coreBrands: 183,
    totalNodes: 1098,
    region: "Div A-F",
    tier: "A+",
    monthlyFee: "$88",
    annualFee: "$888",
    isActive: true,
    sortOrder: 1,
  },
  {
    sectorName: "AI, Logic & Grid Systems",
    glyph: "🧠",
    coreBrands: 188,
    totalNodes: 752,
    region: "Global",
    tier: "A+",
    monthlyFee: "$104",
    annualFee: "$1,050",
    isActive: true,
    sortOrder: 2,
  },
  {
    sectorName: "Creative & Design Systems",
    glyph: "🖋️",
    coreBrands: 142,
    totalNodes: 710,
    region: "Div E",
    tier: "A",
    monthlyFee: "$67",
    annualFee: "$720",
    isActive: true,
    sortOrder: 3,
  },
  {
    sectorName: "Finance & Token Yield",
    glyph: "₿",
    coreBrands: 136,
    totalNodes: 680,
    region: "Div A-E",
    tier: "A+",
    monthlyFee: "$125",
    annualFee: "$1,250",
    isActive: true,
    sortOrder: 4,
  },
  {
    sectorName: "Webless Tech & Nodes",
    glyph: "📴",
    coreBrands: 103,
    totalNodes: 515,
    region: "Div D-G",
    tier: "A",
    monthlyFee: "$76",
    annualFee: "$770",
    isActive: true,
    sortOrder: 5,
  },
  {
    sectorName: "Logistics & Packaging",
    glyph: "📦",
    coreBrands: 111,
    totalNodes: 444,
    region: "Div B-F",
    tier: "B+",
    monthlyFee: "$58",
    annualFee: "$595",
    isActive: true,
    sortOrder: 6,
  },
  {
    sectorName: "Food, Soil & Farming",
    glyph: "✿",
    coreBrands: 83,
    totalNodes: 332,
    region: "Rural",
    tier: "B+",
    monthlyFee: "$46",
    annualFee: "$480",
    isActive: true,
    sortOrder: 7,
  },
  {
    sectorName: "Youth & Education",
    glyph: "🧒",
    coreBrands: 66,
    totalNodes: 330,
    region: "Tribal",
    tier: "A",
    monthlyFee: "$39",
    annualFee: "$420",
    isActive: true,
    sortOrder: 8,
  },
  {
    sectorName: "Health & Hygiene",
    glyph: "⚗",
    coreBrands: 93,
    totalNodes: 372,
    region: "Div F",
    tier: "B",
    monthlyFee: "$52",
    annualFee: "$550",
    isActive: true,
    sortOrder: 9,
  },
  {
    sectorName: "Aura, Ritual & Culture",
    glyph: "☯",
    coreBrands: 74,
    totalNodes: 296,
    region: "Div C",
    tier: "A",
    monthlyFee: "$68",
    annualFee: "$725",
    isActive: true,
    sortOrder: 10,
  },
  {
    sectorName: "Housing & Infrastructure",
    glyph: "🏗️",
    coreBrands: 91,
    totalNodes: 364,
    region: "Div A-F",
    tier: "B+",
    monthlyFee: "$59",
    annualFee: "$610",
    isActive: true,
    sortOrder: 11,
  },
  {
    sectorName: "NFT, IP, Ownership Grid",
    glyph: "🔁",
    coreBrands: 58,
    totalNodes: 232,
    region: "FAA IP",
    tier: "A",
    monthlyFee: "$120",
    annualFee: "$1,200",
    isActive: true,
    sortOrder: 12,
  },
  {
    sectorName: "Motion, Media, Sonic",
    glyph: "🌀",
    coreBrands: 78,
    totalNodes: 312,
    region: "Creative",
    tier: "A",
    monthlyFee: "$72",
    annualFee: "$740",
    isActive: true,
    sortOrder: 13,
  },
  
  // Additional Ecosystem Sectors (visible in full PDF)
  {
    sectorName: "Zero Waste",
    glyph: "♻️",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "B",
    isActive: false,
    sortOrder: 14,
  },
  {
    sectorName: "Justice & Ethics",
    glyph: "⚖",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 15,
  },
  {
    sectorName: "Mining & Resources",
    glyph: "⛏️",
    coreBrands: 0,
    totalNodes: 0,
    region: "Div B-D",
    tier: "B+",
    isActive: false,
    sortOrder: 16,
  },
  {
    sectorName: "Fashion & Identity",
    glyph: "✂",
    coreBrands: 0,
    totalNodes: 0,
    region: "Creative",
    tier: "A",
    isActive: false,
    sortOrder: 17,
  },
  {
    sectorName: "Quantum Protocols",
    glyph: "✴️",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A+",
    isActive: false,
    sortOrder: 18,
  },
  {
    sectorName: "Nutrition & Food Chain",
    glyph: "🥗",
    coreBrands: 0,
    totalNodes: 0,
    region: "Rural",
    tier: "A",
    isActive: false,
    sortOrder: 19,
  },
  {
    sectorName: "Micro-Mesh Logistics",
    glyph: "☰",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "B+",
    isActive: false,
    sortOrder: 20,
  },
  {
    sectorName: "Agriculture & Biotech",
    glyph: "🌾",
    coreBrands: 0,
    totalNodes: 0,
    region: "Rural",
    tier: "A",
    isActive: false,
    sortOrder: 21,
  },
  {
    sectorName: "Voice & Audio",
    glyph: "🎙️",
    coreBrands: 0,
    totalNodes: 0,
    region: "Creative",
    tier: "B+",
    isActive: false,
    sortOrder: 22,
  },
  {
    sectorName: "Gaming & Simulation",
    glyph: "🎮",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 23,
  },
  {
    sectorName: "Banking & Finance",
    glyph: "🏦",
    coreBrands: 0,
    totalNodes: 0,
    region: "Div A-E",
    tier: "A+",
    isActive: false,
    sortOrder: 24,
  },
  {
    sectorName: "Payroll Core Systems",
    glyph: "💰",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A+",
    isActive: false,
    sortOrder: 25,
  },
  {
    sectorName: "Education & IP",
    glyph: "📚",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 26,
  },
  {
    sectorName: "Utilities & Energy",
    glyph: "🔋",
    coreBrands: 0,
    totalNodes: 0,
    region: "Div A-F",
    tier: "A+",
    isActive: false,
    sortOrder: 27,
  },
  {
    sectorName: "SaaS & Licensing",
    glyph: "🔑",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 28,
  },
  {
    sectorName: "Creative Tech",
    glyph: "🎨",
    coreBrands: 0,
    totalNodes: 0,
    region: "Creative",
    tier: "A",
    isActive: false,
    sortOrder: 29,
  },
  {
    sectorName: "Trade Systems",
    glyph: "🔄",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 30,
  },
  {
    sectorName: "Professional Services",
    glyph: "🧾",
    coreBrands: 0,
    totalNodes: 0,
    region: "Div A-E",
    tier: "B+",
    isActive: false,
    sortOrder: 31,
  },
  {
    sectorName: "Wildlife Sector",
    glyph: "🦁",
    coreBrands: 0,
    totalNodes: 0,
    region: "Rural",
    tier: "B",
    isActive: false,
    sortOrder: 32,
  },
  {
    sectorName: "Knowledge & Archives",
    glyph: "📖",
    coreBrands: 0,
    totalNodes: 0,
    region: "Global",
    tier: "A",
    isActive: false,
    sortOrder: 33,
  },
];

/**
 * Initialize sectors in storage
 * @param storage - Storage instance
 */
export async function initializeSectors(storage: any) {
  console.log("🌱 Initializing FAA.ZONE sector data...");
  
  // Check if sectors already exist
  const existingSectors = await storage.getSectors();
  
  if (existingSectors.length > 0) {
    console.log(`✅ Sectors already initialized (${existingSectors.length} sectors found)`);
    return existingSectors;
  }
  
  // Create all sectors
  const createdSectors = [];
  for (const sectorData of officialSectorData) {
    const sector = await storage.createSector(sectorData);
    createdSectors.push(sector);
  }
  
  // Calculate totals for verification
  const activeSectors = createdSectors.filter(s => s.isActive);
  const totalCoreBrands = activeSectors.reduce((sum, s) => sum + s.coreBrands, 0);
  const totalNodes = activeSectors.reduce((sum, s) => sum + s.totalNodes, 0);
  
  console.log(`✅ Initialized ${createdSectors.length} total sectors`);
  console.log(`   📊 Active Sectors: ${activeSectors.length}`);
  console.log(`   🏷️  Total Core Brands: ${totalCoreBrands}`);
  console.log(`   📡 Total Nodes: ${totalNodes}`);
  
  // Verify against specification
  if (totalCoreBrands === 1406 && totalNodes === 6437 && activeSectors.length === 13) {
    console.log("   ✅ Sector data matches FAA.ZONE INDEX specification!");
  } else {
    console.warn("   ⚠️  Warning: Sector totals don't match specification");
    console.warn(`   Expected: 1406 brands, 6437 nodes, 13 active sectors`);
    console.warn(`   Got: ${totalCoreBrands} brands, ${totalNodes} nodes, ${activeSectors.length} active sectors`);
  }
  
  return createdSectors;
}
