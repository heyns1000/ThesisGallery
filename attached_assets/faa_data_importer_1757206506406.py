import logging
from typing import List, Dict
from services.database_service import DatabaseService
from models import Sector, Brand, SubNode

logger = logging.getLogger(__name__)

class FAADataImporter:
    """Import FAA.ZONE ecosystem data into the database"""
    
    @staticmethod
    def import_faa_sectors() -> Dict:
        """Import all 31+ FAA.ZONE sectors with their structure"""
        try:
            # FAA.ZONE Core Sectors with glyph, brands, and subnodes
            faa_sectors = [
                {
                    "name": "Agriculture & Biotech",
                    "slug": "agriculture-biotech",
                    "glyph": "🌱",
                    "description": "Agricultural technology, biotechnology, and sustainable farming solutions",
                    "brands": [
                        {"name": "AgriTech Solutions", "slug": "agritech-solutions", "monthly_fee": 299.99, "annual_fee": 3299.99},
                        {"name": "BioHarvest Systems", "slug": "bioharvest-systems", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "Smart Farming Hub", "slug": "smart-farming-hub", "monthly_fee": 199.99, "annual_fee": 2199.99},
                        {"name": "Precision Agriculture", "slug": "precision-agriculture", "monthly_fee": 499.99, "annual_fee": 5499.99},
                        {"name": "Crop Intelligence", "slug": "crop-intelligence", "monthly_fee": 349.99, "annual_fee": 3849.99}
                    ]
                },
                {
                    "name": "Food, Soil & Farming",
                    "slug": "food-soil-farming",
                    "glyph": "🥦",
                    "description": "Food production, soil management, and sustainable farming practices",
                    "brands": [
                        {"name": "Soil Health Analytics", "slug": "soil-health-analytics", "monthly_fee": 249.99, "annual_fee": 2749.99},
                        {"name": "Farm Management Pro", "slug": "farm-management-pro", "monthly_fee": 179.99, "annual_fee": 1979.99},
                        {"name": "Organic Yield Optimizer", "slug": "organic-yield-optimizer", "monthly_fee": 329.99, "annual_fee": 3629.99},
                        {"name": "Sustainable Food Chain", "slug": "sustainable-food-chain", "monthly_fee": 449.99, "annual_fee": 4949.99}
                    ]
                },
                {
                    "name": "Banking & Finance",
                    "slug": "banking-finance",
                    "glyph": "🏦",
                    "description": "Financial services, banking solutions, and fintech platforms",
                    "brands": [
                        {"name": "Digital Banking Suite", "slug": "digital-banking-suite", "monthly_fee": 999.99, "annual_fee": 10999.99},
                        {"name": "Payment Processing Hub", "slug": "payment-processing-hub", "monthly_fee": 599.99, "annual_fee": 6599.99},
                        {"name": "Financial Analytics Pro", "slug": "financial-analytics-pro", "monthly_fee": 749.99, "annual_fee": 8249.99},
                        {"name": "Investment Management", "slug": "investment-management", "monthly_fee": 1299.99, "annual_fee": 14299.99},
                        {"name": "Risk Assessment Tools", "slug": "risk-assessment-tools", "monthly_fee": 549.99, "annual_fee": 6049.99}
                    ]
                },
                {
                    "name": "Creative Tech",
                    "slug": "creative-tech",
                    "glyph": "🖋️",
                    "description": "Creative technology, design tools, and digital content creation",
                    "brands": [
                        {"name": "Design Studio Pro", "slug": "design-studio-pro", "monthly_fee": 199.99, "annual_fee": 2199.99},
                        {"name": "Content Creation Suite", "slug": "content-creation-suite", "monthly_fee": 299.99, "annual_fee": 3299.99},
                        {"name": "Digital Art Platform", "slug": "digital-art-platform", "monthly_fee": 149.99, "annual_fee": 1649.99},
                        {"name": "Video Production Tools", "slug": "video-production-tools", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "3D Modeling Studio", "slug": "3d-modeling-studio", "monthly_fee": 499.99, "annual_fee": 5499.99}
                    ]
                },
                {
                    "name": "Logistics & Packaging",
                    "slug": "logistics-packaging",
                    "glyph": "📦",
                    "description": "Supply chain management, logistics optimization, and packaging solutions",
                    "brands": [
                        {"name": "Supply Chain Optimizer", "slug": "supply-chain-optimizer", "monthly_fee": 599.99, "annual_fee": 6599.99},
                        {"name": "Smart Packaging Systems", "slug": "smart-packaging-systems", "monthly_fee": 349.99, "annual_fee": 3849.99},
                        {"name": "Delivery Management Pro", "slug": "delivery-management-pro", "monthly_fee": 449.99, "annual_fee": 4949.99},
                        {"name": "Warehouse Intelligence", "slug": "warehouse-intelligence", "monthly_fee": 799.99, "annual_fee": 8799.99}
                    ]
                },
                {
                    "name": "Education & IP",
                    "slug": "education-ip",
                    "glyph": "📚",
                    "description": "Educational technology, intellectual property management, and learning platforms",
                    "brands": [
                        {"name": "Learning Management System", "slug": "learning-management-system", "monthly_fee": 299.99, "annual_fee": 3299.99},
                        {"name": "IP Protection Suite", "slug": "ip-protection-suite", "monthly_fee": 549.99, "annual_fee": 6049.99},
                        {"name": "Educational Analytics", "slug": "educational-analytics", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "Online Course Platform", "slug": "online-course-platform", "monthly_fee": 199.99, "annual_fee": 2199.99}
                    ]
                },
                {
                    "name": "Fashion & Identity",
                    "slug": "fashion-identity",
                    "glyph": "✂",
                    "description": "Fashion technology, identity solutions, and style platforms",
                    "brands": [
                        {"name": "Fashion Design Studio", "slug": "fashion-design-studio", "monthly_fee": 249.99, "annual_fee": 2749.99},
                        {"name": "Style Recommendation Engine", "slug": "style-recommendation-engine", "monthly_fee": 179.99, "annual_fee": 1979.99},
                        {"name": "Virtual Fitting Room", "slug": "virtual-fitting-room", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "Identity Verification", "slug": "identity-verification", "monthly_fee": 499.99, "annual_fee": 5499.99}
                    ]
                },
                {
                    "name": "Gaming & Simulation",
                    "slug": "gaming-simulation",
                    "glyph": "🎮",
                    "description": "Gaming platforms, simulation software, and interactive entertainment",
                    "brands": [
                        {"name": "Game Development Suite", "slug": "game-development-suite", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "Simulation Platform Pro", "slug": "simulation-platform-pro", "monthly_fee": 599.99, "annual_fee": 6599.99},
                        {"name": "VR Gaming Studio", "slug": "vr-gaming-studio", "monthly_fee": 799.99, "annual_fee": 8799.99},
                        {"name": "Interactive Media Tools", "slug": "interactive-media-tools", "monthly_fee": 299.99, "annual_fee": 3299.99}
                    ]
                },
                {
                    "name": "Health & Hygiene",
                    "slug": "health-hygiene",
                    "glyph": "🧠",
                    "description": "Healthcare technology, hygiene solutions, and wellness platforms",
                    "brands": [
                        {"name": "Healthcare Management", "slug": "healthcare-management", "monthly_fee": 749.99, "annual_fee": 8249.99},
                        {"name": "Hygiene Monitoring Systems", "slug": "hygiene-monitoring-systems", "monthly_fee": 349.99, "annual_fee": 3849.99},
                        {"name": "Wellness Analytics", "slug": "wellness-analytics", "monthly_fee": 449.99, "annual_fee": 4949.99},
                        {"name": "Telemedicine Platform", "slug": "telemedicine-platform", "monthly_fee": 599.99, "annual_fee": 6599.99}
                    ]
                },
                {
                    "name": "Housing & Infrastructure",
                    "slug": "housing-infrastructure",
                    "glyph": "🏗️",
                    "description": "Construction technology, infrastructure management, and smart building solutions",
                    "brands": [
                        {"name": "Smart Building Systems", "slug": "smart-building-systems", "monthly_fee": 899.99, "annual_fee": 9899.99},
                        {"name": "Construction Management Pro", "slug": "construction-management-pro", "monthly_fee": 649.99, "annual_fee": 7149.99},
                        {"name": "Infrastructure Analytics", "slug": "infrastructure-analytics", "monthly_fee": 799.99, "annual_fee": 8799.99},
                        {"name": "Property Management Suite", "slug": "property-management-suite", "monthly_fee": 549.99, "annual_fee": 6049.99}
                    ]
                },
                {
                    "name": "Justice & Ethics",
                    "slug": "justice-ethics",
                    "glyph": "⚖",
                    "description": "Legal technology, ethics compliance, and justice system solutions",
                    "brands": [
                        {"name": "Legal Case Management", "slug": "legal-case-management", "monthly_fee": 699.99, "annual_fee": 7699.99},
                        {"name": "Ethics Compliance Suite", "slug": "ethics-compliance-suite", "monthly_fee": 549.99, "annual_fee": 6049.99},
                        {"name": "Justice Analytics", "slug": "justice-analytics", "monthly_fee": 799.99, "annual_fee": 8799.99},
                        {"name": "Legal Research Tools", "slug": "legal-research-tools", "monthly_fee": 399.99, "annual_fee": 4399.99}
                    ]
                },
                {
                    "name": "Knowledge & Archives",
                    "slug": "knowledge-archives",
                    "glyph": "📖",
                    "description": "Knowledge management, digital archives, and information systems",
                    "brands": [
                        {"name": "Knowledge Base Pro", "slug": "knowledge-base-pro", "monthly_fee": 299.99, "annual_fee": 3299.99},
                        {"name": "Digital Archive System", "slug": "digital-archive-system", "monthly_fee": 449.99, "annual_fee": 4949.99},
                        {"name": "Information Management", "slug": "information-management", "monthly_fee": 399.99, "annual_fee": 4399.99},
                        {"name": "Search Engine Pro", "slug": "search-engine-pro", "monthly_fee": 599.99, "annual_fee": 6599.99}
                    ]
                },
                {
                    "name": "AI, Logic & Grid",
                    "slug": "ai-logic-grid",
                    "glyph": "🧠",
                    "description": "Artificial intelligence, logic systems, and grid computing solutions",
                    "brands": [
                        {"name": "AI Development Platform", "slug": "ai-development-platform", "monthly_fee": 999.99, "annual_fee": 10999.99},
                        {"name": "Logic Processing Engine", "slug": "logic-processing-engine", "monthly_fee": 749.99, "annual_fee": 8249.99},
                        {"name": "Grid Computing Suite", "slug": "grid-computing-suite", "monthly_fee": 1299.99, "annual_fee": 14299.99},
                        {"name": "Machine Learning Tools", "slug": "machine-learning-tools", "monthly_fee": 899.99, "annual_fee": 9899.99}
                    ]
                }
                # Add more sectors as needed to reach 31+
            ]
            
            imported_sectors = 0
            imported_brands = 0
            errors = []
            
            for sector_data in faa_sectors:
                try:
                    # Create or get sector
                    sector = DatabaseService.get_or_create_sector(
                        name=sector_data["name"],
                        slug=sector_data["slug"],
                        glyph=sector_data["glyph"],
                        description=sector_data["description"]
                    )
                    
                    if sector:
                        imported_sectors += 1
                        logger.info(f"Imported sector: {sector.name}")
                        
                        # Import brands for this sector
                        for brand_data in sector_data.get("brands", []):
                            try:
                                brand = DatabaseService.get_or_create_brand(
                                    sector_id=str(sector.id),
                                    name=brand_data["name"],
                                    slug=brand_data["slug"],
                                    monthly_fee=brand_data.get("monthly_fee"),
                                    annual_fee=brand_data.get("annual_fee"),
                                    payout_tier="enterprise",
                                    region="global"
                                )
                                
                                if brand:
                                    imported_brands += 1
                                    logger.info(f"Imported brand: {brand.name}")
                                    
                            except Exception as e:
                                error_msg = f"Error importing brand {brand_data['name']}: {str(e)}"
                                errors.append(error_msg)
                                logger.error(error_msg)
                        
                except Exception as e:
                    error_msg = f"Error importing sector {sector_data['name']}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            logger.info(f"FAA.ZONE data import completed: {imported_sectors} sectors, {imported_brands} brands")
            
            return {
                "success": True,
                "imported_sectors": imported_sectors,
                "imported_brands": imported_brands,
                "errors": errors
            }
            
        except Exception as e:
            logger.error(f"FAA.ZONE data import failed: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "imported_sectors": 0,
                "imported_brands": 0
            }
    
    @staticmethod
    def get_all_brand_ids_for_paypal() -> List[str]:
        """Get all brand IDs that need PayPal integration"""
        try:
            brands = DatabaseService.get_brands_for_paypal_processing(limit=10000)
            return [str(brand.id) for brand in brands]
        except Exception as e:
            logger.error(f"Error getting brand IDs: {str(e)}")
            return []