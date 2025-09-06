# -*- coding: utf-8 -*-
import os
import json

# Helper function to convert data to JS string safely
# This function is now defined at the top-level to be globally accessible and consistent
def to_js_str(data):
    """
    Escapes data (typically JSON-serialized) for embedding into JavaScript template literals (backticks).
    Handles backticks (`), dollar signs followed by curly braces (${), and triple single quotes (''').
    """
    # json.dumps handles standard string escaping (quotes, newlines etc.).
    escaped_json = json.dumps(data, indent=4)
    # Replace backticks (`), ${, and also the Python triple-single-quote delimiter (''')
    # to prevent premature termination of the outer f''' string.
    return escaped_json.replace("`", "\\`").replace("${", "\\${").replace("'''", "\\'\\'\\'")

# Helper function to escape a plain string for direct embedding into a JS template literal
def escape_js_template_literal_string(s):
    """
    Escapes a plain Python string for direct embedding into a JavaScript template literal.
    Handles backticks (`), and dollar signs followed by curly braces (${).
    """
    return s.replace("`", "\\`").replace("${", "\\${")


# --- Configuration for HTML Generation ---
# IMPORTANT: Adjust these paths and data structures to match your actual project needs.
# This script is a template; you'll need to customize it.

OUTPUT_DIR = "generated_pages" # Where the HTML files will be saved
BASE_PUBLIC_PATH = "/public/sectors" # Base URL path for serving these files
# Define the absolute path to your main Admin Portal from the web server's root
# Assuming your admin-portal.html is directly under a 'admin' directory in your web server's root
ADMIN_PORTAL_ABSOLUTE_PATH = "/admin/admin-portal.html"


# Mock data definitions (should ideally come from a database/backend in a real app)
# For this script, we'll use a simplified version of your frontend's ALL_SECTOR_DATA_STATIC
# and FAA_ZONE_INDEX_SUMMARY_DATA to demonstrate.

SECTOR_DATA_FOR_GENERATION = {
    "agriculture": {
        "brands": [
            {"name": "CropLink", "brand_icon": "🔗"},
            {"name": "SoilPulse", "brand_icon": "🌱"},
            {"name": "AgriMesh", "brand_icon": "📡"}
        ],
        "subNodes": [["ID", "Vault"], ["Trace", "Data"], ["Route", "Pulse"]],
        "ci_color": "emerald", # Refined corporate green
        "sector_icon": "🌱"
    },
    "banking": {
        "brands": [
            {"name": "FinGrid", "brand_icon": "🔲"},
            {"name": "VaultMaster", "brand_icon": "🔐"},
            {"name": "OmniBank", "brand_icon": "🏦"}
        ],
        "subNodes": [["Ledger", "Router"], ["Lock", "Matrix"], ["NanoPay", "Score"]],
        "ci_color": "indigo", # Corporate blue/purple
        "sector_icon": "🏦"
    },
    "creative": {
        "brands": [
            {"name": "MediaGrid", "brand_icon": "🎬"},
            {"name": "StudioPath", "brand_icon": "🖋️"},
            {"name": "FXStream", "brand_icon": "✨"}
        ],
        "subNodes": [["SceneLink", "FXLayer"], ["StudioSync", "RenderMesh"], ["RenderFX", "LoopFrame"]],
        "ci_color": "purple", # Corporate purple
        "sector_icon": "🖋️"
    },
    "logistics": {
        "brands": [
            {"name": "RouteMesh", "brand_icon": "🌐"}, # Specific icon for RouteMesh
            {"name": "PackChain", "brand_icon": "📦"},
            {"name": "CrateLogic", "brand_icon": "📊"}
        ],
        "subNodes": [["RouteOpt", "DeliveryAI"], ["LabelFlow", "TraceSync"], ["BoxNode", "CrateMap"]],
        "ci_color": "cyan", # Corporate cyan
        "sector_icon": "📦"
    },
    "education-ip": {
        "brands": [
            {"name": "EduNest", "brand_icon": "📚"},
            {"name": "LearnMesh", "brand_icon": "🔗"},
            {"name": "SkillCast", "brand_icon": "🎓"}
        ],
        "subNodes": [["VaultEdu", "Certify"], ["IDTrack", "PupilMesh"], ["YouthForge", "QuizNet"]],
        "ci_color": "teal", # Corporate teal
        "sector_icon": "📚"
    },
    "fashion": {
        "brands": [
            {"name": "StyleForm", "brand_icon": "✂️"},
            {"name": "ChicClaim", "brand_icon": "🏷️"},
            {"name": "GlamRoot", "brand_icon": "💎"}
        ],
        "subNodes": [["FitTrack", "TrendCast"], ["VogueSync", "RunwayPulse"], ["LuxLink", "ModeFrame"]],
        "ci_color": "pink", # Subdued pink
        "sector_icon": "✂"
    },
    "gaming": {
        "brands": [
            {"name": "GameFlow", "brand_icon": "🎮"},
            {"name": "MetaPlay", "brand_icon": "🎲"},
            {"name": "SimulateX", "brand_icon": "🤖"}
        ],
        "subNodes": [["Engine", "AI"], ["Render", "Logic"], ["Virtual", "World"]],
        "ci_color": "blue", # Corporate blue
        "sector_icon": "🎮"
    },
    "health": {
        "brands": [
            {"name": "MedVault", "brand_icon": "⚕️"},
            {"name": "CareNode", "brand_icon": "🏥"},
            {"name": "Hygienix", "brand_icon": "🧼"}
        ],
        "subNodes": [["ScanID", "PatientDrop"], ["SteriMesh", "BioPulse"], ["CleanCast", "SanitiPath"]],
        "ci_color": "emerald", # Corporate green
        "sector_icon": "🧠"
    },
    "housing": {
        "brands": [
            {"name": "BuildNest", "brand_icon": "🏗️"},
            {"name": "InfraGrid", "brand_icon": "🛣️"},
            {"name": "UrbanTrace", "brand_icon": "🏙️"}
        ],
        "subNodes": [["PlotVault", "Permit"], ["Frame", "Struct"], ["LandClaim", "Mesh"]],
        "ci_color": "slate", # Corporate gray
        "sector_icon": "🏗️"
    },
    "justice": {
        "brands": [
            {"name": "LawTrace", "brand_icon": "⚖️"},
            {"name": "RegiSync", "brand_icon": "📜"},
            {"name": "AuditGuard", "brand_icon": "🛡️"}
        ],
        "subNodes": [["CaseFlow", "EthicAI"], ["Compliance", "Ledger"], ["Trail", "Verify"]],
        "ci_color": "rose", # Subdued red/rose
        "sector_icon": "⚖"
    },
    "knowledge": {
        "brands": [
            {"name": "MindLift", "brand_icon": "🧠"},
            {"name": "ArchiveX", "brand_icon": "🗃️"},
            {"name": "KnowledgeGrid", "brand_icon": "🌐"}
        ],
        "subNodes": [["DataNode", "InfoSync"], ["VaultSearch", "ReadLink"], ["MeshIndex", "LearnFlow"]],
        "ci_color": "amber", # Subdued amber
        "sector_icon": "📖"
    },
    "micromesh": {
        "brands": [
            {"name": "MicroLogi", "brand_icon": "🔬"},
            {"name": "GridDrop", "brand_icon": "⬇️"},
            {"name": "FlowStack", "brand_icon": "☰"}
        ],
        "subNodes": [["NanoRoute", "Packet"], ["SensorSync", "Beacon"], ["Trace", "Distro"]],
        "ci_color": "purple", # Corporate purple
        "sector_icon": "☰"
    },
    "media": {
        "brands": [
            {"name": "SonicGrid", "brand_icon": "🎧"},
            {"name": "VoiceLoop", "brand_icon": "🎙️"},
            {"name": "EditMesh", "brand_icon": "🎞️"}
        ],
        "subNodes": [["AudioNode", "QRMix"], ["QRVoice", "ScrollPath"], ["ClipLayer", "TimeSync"]],
        "ci_color": "gray", # Neutral gray
        "sector_icon": "🎬"
    },
    "nutrition": {
        "brands": [
            {"name": "FreshSync", "brand_icon": "🍎"},
            {"name": "CropLoop", "brand_icon": "♻️"},
            {"name": "YieldField", "brand_icon": "🌾"}
        ],
        "subNodes": [["SoilTrace", "PlantLink"], ["HarvestClaim", "GrainVault"], ["RootMap", "FoodProof"]],
        "ci_color": "green", # Corporate green
        "sector_icon": "✿"
    },
    "ai-logic": {
        "brands": [
            {"name": "OmniKey", "brand_icon": "🔑"},
            {"name": "SignalPulse", "brand_icon": "🧠"},
            {"name": "LogicEcho", "brand_icon": "🤖"}
        ],
        "subNodes": [["MeshIndex", "ClaimNode"], ["TokenBoard", "GridCast"], ["VaultGrid", "TraceLoop"]],
        "ci_color": "indigo", # Corporate blue/purple
        "sector_icon": "🧠"
    },
    "packaging": {
        "brands": [
            {"name": "PackChain", "brand_icon": "📦"},
            {"name": "CrateWrap", "brand_icon": "🎁"},
            {"name": "LabelFlow", "brand_icon": "🏷️"}
        ],
        "subNodes": [["SortFleet", "RouteMesh"], ["ColdFleet", "BinLogic"], ["Track", "Dispatch"]],
        "ci_color": "yellow", # Subdued yellow
        "sector_icon": "📦"
    },
    "quantum": {
        "brands": [
            {"name": "QuantumMesh", "brand_icon": "⚛️"},
            {"name": "QubitNest", "brand_icon": "✴️"},
            {"name": "LogicSpin", "brand_icon": "🌀"}
        ],
        "subNodes": [["PulseQ", "EntanglePath"], ["WaveSignal", "PhaseClaim"], ["GridState", "QuantumDrop"]],
        "ci_color": "fuchsia", # Subdued fuchsia
        "sector_icon": "✴️"
    },
    "ritual": {
        "brands": [
            {"name": "RiteNest", "brand_icon": "☯️"},
            {"name": "ClanScroll", "brand_icon": "📜"},
            {"name": "MythLoop", "brand_icon": "✨"}
        ],
        "subNodes": [["PulseSpirit", "AuraDrop"], ["CeremPath", "EchoGlyph"], ["TradVault", "LineageClaim"]],
        "ci_color": "neutral", # Neutral gray
        "sector_icon": "☯"
    },
    "saas": {
        "brands": [
            {"name": "SaaSChain", "brand_icon": "🔗"},
            {"name": "LicenseGrid", "brand_icon": "🔐"},
            {"name": "VaultKey", "brand_icon": "🔑"}
        ],
        "subNodes": [["TokenSaaS", "OmniLicense"], ["ScrollSync", "PulseSaaS"], ["ClaimSuite", "YieldKey"]],
        "ci_color": "sky", # Corporate sky blue
        "sector_icon": "🔑"
    },
    "trade": {
        "brands": [
            {"name": "TradeSys", "brand_icon": "🧺"},
            {"name": "ExchangeLink", "brand_icon": "🤝"},
            {"name": "MarketLoop", "brand_icon": "📈"}
        ],
        "subNodes": [["Contract", "Verify"], ["GlobalRoute", "Audit"], ["Pulse", "Sync"]],
        "ci_color": "orange", # Corporate orange
        "sector_icon": "🧺"
    },
    "utilities": {
        "brands": [
            {"name": "EnergyGrid", "brand_icon": "🔋"},
            {"name": "WaterFlow", "brand_icon": "💧"},
            {"name": "PowerPulse", "brand_icon": "⚡"}
        ],
        "subNodes": [["SmartMeter", "Connect"], ["HydroTech", "PipeNet"], ["SolarSync", "GridTie"]],
        "ci_color": "blue", # Corporate blue
        "sector_icon": "🔋"
    },
    "voice": {
        "brands": [
            {"name": "VoiceFlow", "brand_icon": "🎙️"},
            {"name": "AudioSync", "brand_icon": "🎚️"},
            {"name": "SonicCast", "brand_icon": "📢"}
        ],
        "subNodes": [["SpeechRec", "SynthAI"], ["WaveTrace", "EchoNode"], ["MediaPipe", "AudioGrid"]],
        "ci_color": "indigo", # Corporate blue/purple
        "sector_icon": "🎙️"
    },
    "webless": {
        "brands": [
            {"name": "OmniQR", "brand_icon": "📡"},
            {"name": "MeshSync", "brand_icon": "📶"},
            {"name": "VaultBeacon", "brand_icon": "🚨"}
        ],
        "subNodes": [["TapClaim", "ScrollKey"], ["AirLoop", "DotGrid"], ["VaultTouch", "PouchCast"]],
        "ci_color": "slate", # Corporate gray
        "sector_icon": "📡"
    },
    "nft": {
        "brands": [
            {"name": "ClaimGrid", "brand_icon": "🖼️"},
            {"name": "TokenSync", "brand_icon": "🔁"},
            {"name": "VaultMint", "brand_icon": "🪙"}
        ],
        "subNodes": [["NFTLoop", "ScrollProof"], ["IPTrace", "MintEcho"], ["VaultSeal", "ChainLock"]],
        "ci_color": "fuchsia", # Subdued fuchsia
        "sector_icon": "🔁"
    },
    "education-youth": {
        "brands": [
            {"name": "EduHub", "brand_icon": "🎓"},
            {"name": "YouthLab", "brand_icon": "🧪"},
            {"name": "LearnZone", "brand_icon": "📚"}
        ],
        "subNodes": [["ClassSync", "SkillTrack"], ["MentorLink", "QuizNet"], ["GrowthMap", "IdeaNest"]],
        "ci_color": "emerald", # Corporate green
        "sector_icon": "🎓"
    },
    "zerowaste": {
        "brands": [
            {"name": "EcoLoop", "brand_icon": "♻️"},
            {"name": "CycleSync", "brand_icon": "🔄"},
            {"name": "WasteGrid", "brand_icon": "🗑️"}
        ],
        "subNodes": [["BioDrop", "SustainClaim"], ["Sort", "PulseGreen"], ["YieldTrash", "RecycleMap"]],
        "ci_color": "lime", # Subdued lime green
        "sector_icon": "♻️"
    },
    "professional": {
        "brands": [
            {"name": "LedgerNest", "brand_icon": "🧾"},
            {"name": "OmniBooks", "brand_icon": "💼"},
            {"name": "LawTrace", "brand_icon": "⚖️"}
        ],
        "subNodes": [["QCalc", "SiteProof"], ["ContractCast", "Enginuity"], ["StructVault", "RegiSync"]],
        "ci_color": "indigo", # Corporate blue/purple
        "sector_icon": "🧾"
    },
    "payroll-mining": {
        "brands": [
            {"name": "PayMine", "brand_icon": "🪙"},
            {"name": "AccountCore", "brand_icon": "🧮"},
            {"name": "PayrollSync", "brand_icon": "💵"}
        ],
        "subNodes": [["HashLedger", "BlockTrack"], ["MintClaim", "Audit"], ["CryptoPay", "TaxNode"]],
        "ci_color": "amber", # Subdued amber
        "sector_icon": "🪙"
    },
    "mining": {
        "brands": [
            {"name": "MineNest", "brand_icon": "⛏️"},
            {"name": "DrillCore", "brand_icon": "🔩"},
            {"name": "OreSync", "brand_icon": "🪨"}
        ],
        "subNodes": [["VaultRock", "ClaimMine"], ["TrackShaft", "PulseMine"], ["CoreBeam", "DigEcho"]],
        "ci_color": "orange", # Corporate orange
        "sector_icon": "⛏️"
    },
    "wildlife": {
        "brands": [
            {"name": "HabitatGuard", "brand_icon": "🦁"},
            {"name": "EcoWild", "brand_icon": "🌿"},
            {"name": "ZoneProtect", "brand_icon": "🏞️"}
        ],
        "subNodes": [["TraceCam", "BioShield"], ["TrackFlow", "SanctuaryAI"], ["PreserveNet", "FloraGuard"]],
        "ci_color": "green", # Corporate green
        "sector_icon": "🦁"
    }
}


# Define the 12+ page types for each brand portal
BRAND_PAGE_TYPES = [
    {"file": "index.html", "title_suffix": "Home", "nav_label": "Home", "hero_icon": "🏡"},
    {"file": "dashboard.html", "title_suffix": "Dashboard", "nav_label": "Dashboard", "hero_icon": "📊"},
    {"file": "pricing.html", "title_suffix": "Pricing & Plans", "nav_label": "Pricing", "hero_icon": "💰"},
    {"file": "products.html", "title_suffix": "Solutions & Modules", "nav_label": "Products", "hero_icon": "📦"}, # Enhanced in template
    {"file": "about.html", "title_suffix": "About Us", "nav_label": "About", "hero_icon": "ℹ️"},
    {"file": "features.html", "title_suffix": "Key Features", "nav_label": "Features", "hero_icon": "✨"},
    {"file": "contact.html", "title_suffix": "Contact Support", "nav_label": "Contact", "hero_icon": "📞"},
    {"file": "licensing.html", "title_suffix": "Licensing", "nav_label": "Licensing", "hero_icon": "🔐"},
    {"file": "terms.html", "title_suffix": "Terms of Service", "nav_label": "Terms", "hero_icon": "📜"},
    {"file": "clauses.html", "title_suffix": "Compliance Clauses", "nav_label": "Clauses", "hero_icon": "⚖️"},
    {"file": "auth.html", "title_suffix": "Authentication Portal", "nav_label": "Auth", "hero_icon": "🔑"},
    {"file": "metrics.html", "title_suffix": "Performance Metrics", "nav_label": "Metrics", "hero_icon": "📈"},
    # Add more pages as needed
]

# Mapping for CI colors to Tailwind classes
# Using a more corporate-friendly selection from Tailwind's default palette
CI_COLOR_MAP = {
    "indigo":   {"header_bg": "bg-indigo-800", "accent_text": "text-indigo-400",   "button_bg": "bg-indigo-600", "hover_button_bg": "hover:bg-indigo-700", "accent_500": "indigo-500"},
    "blue":     {"header_bg": "bg-blue-800",   "accent_text": "text-blue-400",     "button_bg": "bg-blue-600",   "hover_button_bg": "hover:bg-blue-700",   "accent_500": "blue-500"},
    "cyan":     {"header_bg": "bg-cyan-800",   "accent_text": "text-cyan-400",     "button_bg": "bg-cyan-600",   "hover_button_bg": "hover:bg-cyan-700",   "accent_500": "cyan-500"},
    "teal":     {"header_bg": "bg-teal-800",   "accent_text": "text-teal-400",     "button_bg": "bg-teal-600",   "hover_button_bg": "hover:bg-teal-700",   "accent_500": "teal-500"},
    "emerald":  {"header_bg": "bg-emerald-800","accent_text": "text-emerald-400",  "button_bg": "bg-emerald-600","hover_button_bg": "hover:bg-emerald-700","accent_500": "emerald-500"},
    "green":    {"header_bg": "bg-green-800",  "accent_text": "text-green-400",    "button_bg": "bg-green-600",  "hover_button_bg": "hover:bg-green-700",  "accent_500": "green-500"},
    "lime":     {"header_bg": "bg-lime-800",   "accent_text": "text-lime-400",     "button_bg": "bg-lime-600",   "hover_button_bg": "hover:bg-lime-700",   "accent_500": "lime-500"},
    "yellow":   {"header_bg": "bg-yellow-800", "accent_text": "text-yellow-400",   "button_bg": "bg-yellow-600", "hover_button_bg": "hover:bg-yellow-700", "accent_500": "yellow-500"},
    "amber":    {"header_bg": "bg-amber-800",  "accent_text": "text-amber-400",    "button_bg": "bg-amber-600",  "hover_button_bg": "hover:bg-amber-700",  "accent_500": "amber-500"},
    "orange":   {"header_bg": "bg-orange-800", "accent_text": "text-orange-400",   "button_bg": "bg-orange-600", "hover_button_bg": "hover:bg-orange-700", "accent_500": "orange-500"},
    "red":      {"header_bg": "bg-red-800",    "accent_text": "text-red-400",      "button_bg": "bg-red-600",    "hover_button_bg": "hover:bg-red-700",    "accent_500": "red-500"},
    "rose":     {"header_bg": "bg-rose-800",   "accent_text": "text-rose-400",     "button_bg": "bg-rose-600",   "hover_button_bg": "hover:bg-rose-700",   "accent_500": "rose-500"},
    "fuchsia":  {"header_bg": "bg-fuchsia-800","accent_text": "text-fuchsia-400",  "button_bg": "bg-fuchsia-600","hover_button_bg": "hover:bg-fuchsia-700","accent_500": "fuchsia-500"},
    "purple":   {"header_bg": "bg-purple-800", "accent_text": "text-purple-400",   "button_bg": "bg-purple-600", "hover_button_bg": "hover:bg-purple-700", "accent_500": "purple-500"},
    "slate":    {"header_bg": "bg-slate-800",  "accent_text": "text-slate-400",    "button_bg": "bg-slate-600",  "hover_button_bg": "hover:bg-slate-700",  "accent_500": "slate-500"},
    "gray":     {"header_bg": "bg-gray-800",   "accent_text": "text-gray-400",     "button_bg": "bg-gray-600",   "hover_button_bg": "hover:bg-gray-700",   "accent_500": "gray-500"},
    "neutral":  {"header_bg": "bg-neutral-800","accent_text": "text-neutral-400",  "button_bg": "bg-neutral-600","hover_button_bg": "hover:bg-neutral-700","accent_500": "neutral-500"}, # A gray-like option
}


# --- HTML Template Functions ---

def generate_html_header(brand_name, page_type_data, ci_classes, main_icon):
    return f"""
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌐 {brand_name}™ {page_type_data['title_suffix']}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body {{
                font-family: 'Inter', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }}
            /* Custom scrollbar for dark theme */
            ::-webkit-scrollbar {{
                width: 8px;
            }}
            ::-webkit-scrollbar-track {{
                background: #2d3748; /* bg-gray-800 */
            }}
            ::-webkit-scrollbar-thumb {{
                background: #4a5568; /* bg-gray-600 */
                border-radius: 4px;
            }}
            ::-webkit-scrollbar-thumb:hover {{
                background: #6b7280; /* bg-gray-500 */
            }}
            /* Custom modal styles for product details */
            .product-modal {{
                display: none; /* Hidden by default */
                position: fixed; /* Stay in place */
                z-index: 1001; /* Sit on top, above other modals */
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.7); /* Darker overlay */
                display: flex;
                align-items: center;
                justify-content: center;
            }}
            .product-modal-content {{
                background-color: #1a202c; /* bg-gray-900 */
                color: #e2e8f0; /* text-gray-200 */
                padding: 30px;
                border: 1px solid #4a5568; /* border-gray-700 */
                width: 90%;
                max-width: 800px;
                border-radius: 0.75rem; /* rounded-xl */
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.25);
                animation-name: animatetop;
                animation-duration: 0.4s;
                position: relative;
                max-height: 90vh; /* Limit height to prevent overflow */
                overflow-y: auto; /* Enable scrolling within modal content */
            }}
            .product-modal-close {{
                color: #cbd5e0; /* text-gray-400 */
                position: absolute;
                top: 15px;
                right: 25px;
                font-size: 36px;
                font-weight: bold;
            }}
            .product-modal-close:hover,
            .product-modal-close:focus {{
                color: #ffffff;
                text-decoration: none;
                cursor: pointer;
            }}
            @keyframes animatetop {{
                from {{top: -300px; opacity: 0}}
                to {{top: 0; opacity: 1}}
            }}
        </style>
    </head>
    <body class="bg-gray-900 text-gray-100 min-h-screen flex flex-col">

        <header class="{ci_classes['header_bg']} shadow-lg py-4 px-6 md:px-10 sticky top-0 z-50">
            <div class="container mx-auto flex items-start justify-between flex-wrap">
                <div class="flex items-center mb-4 md:mb-0">
                    <span class="text-3xl mr-3">{main_icon}</span> <h1 class="text-2xl md:text-3xl font-bold {ci_classes['accent_text']}">
                        FAA.ZONE <span class="text-gray-100">Sovereign Scrolls</span>
                    </h1>
                </div>

                <div class="flex flex-col items-center md:items-end w-full md:w-auto">
                    <span class="text-xl md:text-2xl text-gray-400 mb-2 mt-4 md:mt-0">Global Supply Chain Grid</span>
                    <nav class="w-full md:w-auto">
                        <ul class="flex flex-wrap justify-center md:justify-end space-x-2 md:space-x-4 text-sm md:text-base">
    """

def generate_html_nav_links(sector_slug_for_nav, brand_slug, current_page_file, ci_classes):
    nav_links_html = []
    # Link back to the general sector dashboard (adjust if your sector dashboards are different)
    nav_links_html.append(f"""
                            <li><a href="../../{sector_slug_for_nav.replace('_', '-')}-dashboard.html" class="px-3 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200">Sector Dashboard</a></li>
    """)
    for page in BRAND_PAGE_TYPES:
        # Use ci_classes['accent_500'] for the active link background
        active_class = f"bg-{ci_classes['accent_500']} text-white" if page["file"] == current_page_file else "hover:bg-gray-700 transition-colors duration-200"
        nav_links_html.append(f"""
                            <li><a href="{page['file']}" class="px-3 py-2 rounded-md {active_class}">{page['nav_label']}</a></li>
        """)
    return "".join(nav_links_html)

def generate_html_footer(ci_classes):
    return f"""
                        </ul>
                    </nav>
                </div>
            </div>
        </header>

        <main class="flex-grow container mx-auto px-6 py-8 md:py-12">
            <div id="dynamicContent" class="mb-12">
                {'''
                <p class="text-gray-300 text-center">Content will be loaded here by JavaScript.</p>
                '''}
            </div>
        </main>

        <footer class="bg-gray-800 py-6 px-6 md:px-10 mt-12">
            <div class="container mx-auto text-center text-gray-400 text-sm">
                <p>&copy; 2025 FAA.ZONE Sovereign Scrolls. All rights reserved.</p>
                <p class="mt-2">
                    Part of the Global Supply Chain Grid · Powered by VaultMesh™ & TreatyMesh™ Protocols.
                </p>
                <div class="flex flex-wrap justify-center space-x-4 mt-4">
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Privacy Policy</a>
                    <span class="text-gray-600">|</span>
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Terms of Service</a>
                    <span class="text-gray-600">|</span>
                    <a href="#" class="hover:{ci_classes['accent_text']} transition-colors duration-200">Contact Support</a>
                </div>
            </div>
        </footer>

        <div id="productDetailModal" class="product-modal">
            <div class="product-modal-content">
                <span class="product-modal-close" onclick="hideProductModal()">&times;</span>
                <h3 id="modalProductTitle" class="text-3xl font-bold {ci_classes['accent_text']} mb-4"></h3>
                <p id="modalProductDescription" class="text-gray-300 mb-4 leading-relaxed"></p>
                <div id="modalProductFeatures" class="mb-4">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Key Features:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductSpecs" class="mb-4">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Specifications:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductBenefits" class="mb-4">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Benefits:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <div id="modalProductUseCases" class="mb-4">
                    <h4 class="text-xl font-semibold text-gray-200 mb-2">Use Cases:</h4>
                    <ul class="list-disc list-inside text-gray-300 ml-4"></ul>
                </div>
                <p id="modalProductPricing" class="text-lg font-semibold text-white mt-4"></p>
                <button onclick="hideProductModal()" class="mt-6 {ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-2 px-6 rounded-md">Close</button>
            </div>
        </div>

    </body>
    </html>
    """

def generate_products_html_content(brand_name, ci_classes):
    # This is a conceptual list of products. In a real app, this would be fetched from backend.
    # The 'id' here would map to a backend endpoint for detailed product info.
    conceptual_products_data = [
        {"id": "networkflow", "icon": "🌊", "name": "NetworkFlow™", "description": "Intelligent algorithms for optimizing the flow of goods across your entire network, from regional hubs to last-mile delivery.",
            "benefits": ["Enhanced efficiency", "Reduced transit times", "Lower operational costs"],
            "use_cases": ["Global shipping", "Complex supply chains", "E-commerce logistics"]
        },
        {"id": "predictdisrupt", "icon": "🔮", "name": "PredictDisrupt™", "description": "AI-driven predictive analytics to foresee potential disruptions (weather, traffic, geopolitical events) and proactively suggest alternative strategies.",
            "benefits": ["Proactive risk mitigation", "Improved supply chain resilience", "Reduced disruption impact"],
            "use_cases": ["Disaster preparedness", "Geopolitical risk analysis", "Traffic management"]
        },
        {"id": "lastmileai", "icon": "🏁", "name": "LastMileAI™", "description": "Specialized AI for optimizing the final leg of delivery, enhancing urban logistics and customer satisfaction.",
            "benefits": ["Faster delivery times", "Improved customer satisfaction", "Optimized driver routes"],
            "use_cases": ["Urban delivery networks", "On-demand services", "Retail fulfillment"]
        },
        {"id": "geoflex", "icon": "🌍", "name": "GeoFlex™", "description": "Advanced geospatial analytics for optimizing network design, warehouse placement, and distribution strategies.",
            "benefits": ["Strategic network design", "Optimized facility placement", "Reduced infrastructure costs"],
            "use_cases": ["Warehouse site selection", "New market entry planning", "Distribution network optimization"]
        },
        {"id": "crossmodal", "icon": "🚢✈️🚂", "name": "CrossModal™", "description": "Optimize multi-modal transportation strategies, seamlessly integrating sea, air, rail, and road networks for global efficiency.",
            "benefits": ["Unified global logistics", "Reduced intermodal transfer delays", "Optimized freight costs"],
            "use_cases": ["International trade", "Complex freight forwarding", "Intermodal transport planning"]
        },
        {"id": "vaultmeshconnect", "icon": "🔗", "name": "VaultMesh™ Connect", "description": "Direct integration with FAA.ZONE's VaultMesh™ for secure, immutable recording of all network optimization decisions and outcomes.",
            "benefits": ["Enhanced data security", "Immutable audit trails", "Increased supply chain trust"],
            "use_cases": ["High-value goods tracking", "Compliance reporting", "Secure data sharing"]
        },
    ]
    
    products_html = f"""
    <section class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-extrabold text-white mb-4">
            📦 {brand_name}™ Solutions & Modules
        </h2>
        <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our advanced modules for intelligent network design, real-time optimization, and predictive resilience across your global delivery operations.
        </p>
    </section>

    <section class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Core Network Optimization Modules</h3>
        <div id="productGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <p class="text-gray-400 text-center col-span-full">Loading products...</p>
        </div>
    </section>

    <section id="featuresDeepDive" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Key Features Deep Dive</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="featuresDeepDiveContent">
            <p class="text-gray-400 text-center col-span-full">Loading features...</p>
        </div>
    </section>

    <section id="integrationCapabilities" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Integration Capabilities</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="integrationCapabilitiesContent">
            <p class="text-gray-400 text-center col-span-full">Loading integrations...</p>
        </div>
    </section>

    <section id="useCases" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Use Cases & Industry Applications</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8" id="useCasesContent">
            <p class="text-gray-400 text-center col-span-full">Loading use cases...</p>
        </div>
    </section>

    <section id="techSpecs" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Technical Specifications Summary</h3>
        <div id="techSpecsContent">
            <p class="text-gray-400 text-center">Loading technical specifications...</p>
        </div>
    </section>

    <section id="securityCompliance" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Security & Compliance Highlights</h3>
        <div id="securityComplianceContent">
            <p class="text-gray-400 text-center">Loading security & compliance info...</p>
        </div>
    </section>

    <section id="customerSuccess" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Customer Success & Testimonials</h3>
        <div id="customerSuccessContent">
            <p class="text-gray-400 text-center">Loading testimonials...</p>
        </div>
    </section>

    <section id="supportTraining" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Support & Training</h3>
        <div id="supportTrainingContent">
            <p class="text-gray-400 text-center">Loading support info...</p>
        </div>
    </section>

    <section id="faqSection" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Frequently Asked Questions</h3>
        <div id="faqContent">
            <p class="text-gray-400 text-center">Loading FAQs...</p>
        </div>
    </section>

    <section id="pricingOverview" class="mb-12 bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Pricing Overview</h3>
        <div id="pricingOverviewContent">
            <p class="text-gray-400 text-center">Loading pricing info...</p>
        </div>
    </section>

    <section class="text-center mb-12">
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6">Ready to Transform Your Logistics?</h3>
        <div class="mt-8 flex justify-center space-x-4">
            <a href="contact.html" class="{ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
                Request a Demo
            </a>
            <a href="contact.html" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
                Contact Sales
            </a>
        </div>
    </section>

    <section>
        <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-6 text-center">Strategic Advisory & Custom Solutions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                <h4 class="text-2xl font-semibold text-white mb-2">Network Design & Simulation</h4>
                <p class="text-gray-400 mb-4">Our experts assist in designing and simulating optimal logistics networks, identifying efficiencies and potential vulnerabilities before deployment.</p>
                <p class="text-gray-400 text-sm">Leverage our advanced simulation tools to model various scenarios and predict network performance under different conditions.</p>
            </div>
            <div class="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
                <h4 class="text-2xl font-semibold text-white mb-2">TreatyMesh™ Compliance Integration</h4>
                <p class="text-gray-400 mb-4">Receive tailored support for integrating specific TreatyMesh™ compliance requirements into your {brand_name}™ network optimization strategies.</p>
                <p class="text-gray-400 text-sm">Ensures seamless adherence to international trade agreements and regulatory frameworks within your dynamic delivery network.</p>
            </div>
        </div>
    </section>
    """
    return products_html

def generate_js_for_page(sector_slug, brand_info, page_type_data, sector_details):
    # sector_slug: This is the string key (e.g., "logistics")
    # sector_details: This is the dictionary value for that sector (e.g., {"brands": [...], ...})

    page_file = page_type_data["file"]
    brand_name = brand_info["name"]
    brand_slug_clean = brand_name.lower().replace(' ', '-').replace('™', '')
    
    # Use sector_details for ci_color as it's the dictionary containing it
    ci_classes = CI_COLOR_MAP.get(sector_details.get("ci_color", "gray"), CI_COLOR_MAP["gray"])
    
    # The slug used in JS should be the one from the loop, processed for JS variable names
    sector_slug_for_js = sector_slug.replace('-', '_') 

    js_content = f"""
        // JavaScript for {brand_name}™ {page_type_data['title_suffix']} page
        document.addEventListener('DOMContentLoaded', () => {{
            const brandName = "{brand_name}";
            const sectorSlug = "{sector_slug_for_js}"; // e.g., "logistics_packaging"
            const pageType = "{page_file.replace('.html', '')}"; // e.g., "index", "products"
            const accentColorClass = "{ci_classes['accent_text']}"; // e.g., "text-cyan-400"
            const accentColor500 = "{ci_classes['accent_500']}"; // e.g., "cyan-500"

            console.log(`Loaded ${{brandName}} ${{pageType}} page.`);

            // Function to show the product detail modal
            function showProductModal(product) {{
                document.getElementById('modalProductTitle').textContent = product.name;
                document.getElementById('modalProductDescription').textContent = product.description;

                const featuresUl = document.getElementById('modalProductFeatures').querySelector('ul');
                featuresUl.innerHTML = '';
                (product.features || []).forEach(f => {{ // Ensure features is an array
                    const li = document.createElement('li');
                    li.textContent = f;
                    featuresUl.appendChild(li);
                }});

                const specsUl = document.getElementById('modalProductSpecs').querySelector('ul');
                specsUl.innerHTML = '';
                if (product.specs && Object.keys(product.specs).length > 0) {{
                    for (const key in product.specs) {{
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>${{key}}</strong>: ${{product.specs[key]}}`;
                        specsUl.appendChild(li);
                    }}
                }} else {{
                    specsUl.innerHTML = '<li>No detailed specifications available.</li>';
                }}

                const benefitsDiv = document.getElementById('modalProductBenefits');
                const benefitsUl = benefitsDiv.querySelector('ul') || document.createElement('ul');
                benefitsUl.innerHTML = '';
                benefitsUl.className = 'list-disc list-inside text-gray-300 ml-4';
                if (product.benefits && product.benefits.length > 0) {{
                    benefitsDiv.style.display = 'block';
                    product.benefits.forEach(b => {{
                        const li = document.createElement('li');
                        li.textContent = b;
                        benefitsUl.appendChild(li);
                    }});
                    benefitsDiv.appendChild(benefitsUl);
                }} else {{
                    benefitsDiv.style.display = 'none'; // Hide section if no benefits
                }}

                const useCasesDiv = document.getElementById('modalProductUseCases');
                const useCasesUl = useCasesDiv.querySelector('ul') || document.createElement('ul');
                useCasesUl.innerHTML = '';
                useCasesUl.className = 'list-disc list-inside text-gray-300 ml-4';
                if (product.use_cases && product.use_cases.length > 0) {{
                    useCasesDiv.style.display = 'block';
                    product.use_cases.forEach(uc => {{
                        const li = document.createElement('li');
                        li.textContent = uc;
                        useCasesUl.appendChild(li);
                    }});
                    useCasesDiv.appendChild(useCasesUl);
                }} else {{
                    useCasesDiv.style.display = 'none'; // Hide section if no use cases
                }}
                
                document.getElementById('modalProductPricing').textContent = `Pricing: ${{product.pricing || 'Contact for Quote'}}`;
                document.getElementById('productDetailModal').style.display = 'flex';
            }}

            // Function to hide the product detail modal
            window.hideProductModal = function() {{ // Made global for onclick
                document.getElementById('productDetailModal').style.display = 'none';
            }};

            // Function to simulate fetching product details
            async function fetchProductDetails(productId) {{
                // In a real app, this would be an actual fetch call:
                // const response = await fetch(`http://localhost:5000/api/products/${{productId}}`);
                // const productDetails = await response.json();
                
                // For this demo, we're using the mock data map
                const productDetails = productDetailsMap[productId];
                if (productDetails) {{
                    showProductModal(productDetails);
                }} else {{
                    console.error(`Product details for ID ${{productId}} not found in mock data.`);
                    // In a real app, you might show an error message in the modal or to the user
                    alert('Product details not found.'); // Using alert only for simple demo error
                }}
            }}
        """
    
    # Add page-specific JS logic
    if page_file == "products.html":
        # Mock data for products.html dynamic sections
        products_data_for_js = [
            {"id": "networkflow", "icon": "🌊", "name": "NetworkFlow™", "description": "Intelligent algorithms for optimizing the flow of goods across your entire network, from regional hubs to last-mile delivery." },
            {"id": "predictdisrupt", "icon": "🔮", "name": "PredictDisrupt™", "description": "AI-driven predictive analytics to foresee potential disruptions (weather, traffic, geopolitical events) and proactively suggest alternative strategies." },
            {"id": "lastmileai", "icon": "🏁", "name": "LastMileAI™", "description": "Specialized AI for optimizing the final leg of delivery, enhancing urban logistics and customer satisfaction." },
            {"id": "geoflex", "icon": "🌍", "name": "GeoFlex™", "description": "Advanced geospatial analytics for optimizing network design, warehouse placement, and distribution strategies." },
            {"id": "crossmodal", "icon": "🚢✈️🚂", "name": "CrossModal™", "description": "Optimize multi-modal transportation strategies, seamlessly integrating sea, air, rail, and road networks for global efficiency." },
            {"id": "vaultmeshconnect", "icon": "🔗", "name": "VaultMesh™ Connect", "description": "Direct integration with FAA.ZONE's VaultMesh™ for secure, immutable recording of all network optimization decisions and outcomes." },
        ]
        
        product_details_map_for_js = {
            "networkflow": {
                "name": "NetworkFlow™",
                "description": "NetworkFlow™ is our flagship module for comprehensive logistics optimization. It uses advanced fluid dynamics algorithms combined with real-time data feeds to predict the most efficient paths for goods across complex supply chains. This module is essential for large-scale operations requiring minute-by-minute adjustments.",
                "features": ["Real-time dynamic routing", "Multi-echelon inventory optimization", "Adaptive capacity planning", "Automated re-routing in disruptions"],
                "specs": { "Processing Power": "High-throughput AI-co-processor", "Data Latency": "< 50ms", "Integration": "REST API, MQTT, Custom Adapters" },
                "benefits": ["Enhanced efficiency", "Reduced transit times", "Lower operational costs"],
                "use_cases": ["Global shipping", "Complex supply chains", "E-commerce logistics"],
                "pricing": "Tier 3 Enterprise Module"
            },
            "predictdisrupt": {
                "name": "PredictDisrupt™",
                "description": "PredictDisrupt™ leverages machine learning models to analyze global events, weather patterns, traffic data, and historical disruption records to provide proactive alerts and alternative scenario planning. Stay ahead of potential issues and minimize their impact.",
                "features": ["AI-driven risk scoring", "Scenario simulation dashboard", "Proactive alert system", "Integration with global news feeds"],
                "specs": { "ML Models": "Deep Learning, Random Forest", "Data Sources": "Satellite, Weather, News, Traffic", "Alerts": "SMS, Email, Dashboard" },
                "benefits": ["Proactive risk mitigation", "Improved supply chain resilience", "Reduced disruption impact"],
                "use_cases": ["Disaster preparedness", "Geopolitical risk analysis", "Traffic management"],
                "pricing": "Tier 2 Advanced Module"
            },
            "lastmileai": {
                "name": "LastMileAI™",
                "description": "LastMileAI™ refines the critical final leg of delivery. It optimizes individual delivery routes for efficiency, fuel consumption, and customer satisfaction, incorporating real-time traffic and delivery constraints. It also provides seamless communication channels for drivers and customers.",
                "features": ["Dynamic route sequencing", "Real-time driver GPS guidance", "Customer ETA updates", "Proof-of-delivery capture"],
                "specs": { "GPS Accuracy": "< 3 meters", "Route Optimization": "TSP, VRP algorithms", "Mobile App": "iOS, Android" },
                "benefits": ["Faster delivery times", "Improved customer satisfaction", "Optimized driver routes"],
                "use_cases": ["Urban delivery networks", "On-demand services", "Retail fulfillment"],
                "pricing": "Tier 1 Standard Module"
            },
            "geoflex": {
                "name": "GeoFlex™",
                "description": "GeoFlex™ provides powerful geospatial visualization and analytical tools to help you strategically design and optimize your physical logistics infrastructure. Identify optimal warehouse locations, distribution centers, and shipping lanes based on demand density and geographical advantages.",
                "features": ["Interactive geospatial mapping", "Demand heatmaps", "Optimal facility placement analysis", "Network vulnerability assessment"],
                "specs": { "Map Provider": "OpenStreetMap, Satellite Imagery", "Data Layers": "Population, Traffic, Climate", "Analysis Tools": "Clustering, Voronoi Diagrams" },
                "benefits": ["Strategic network design", "Optimized facility placement", "Reduced infrastructure costs"],
                "use_cases": ["Warehouse site selection", "New market entry planning", "Distribution network optimization"],
                "pricing": "Tier 2 Advanced Module"
            },
            "crossmodal": {
                "name": "CrossModal™",
                "description": "CrossModal™ is designed for global supply chains that utilize multiple modes of transportation. It intelligently orchestrates the seamless transfer of goods between sea, air, rail, and road, minimizing transit times and costs while ensuring customs compliance.",
                "features": ["Multi-modal route planning", "Automated transfer scheduling", "Customs documentation integration", "Real-time cargo tracking across modes"],
                "specs": { "Supported Modes": "Ocean, Air, Rail, Road", "Compliance": "Automated Tariff Codes, Duty Calculation", "Tracking": "Global IoT Integration" },
                "benefits": ["Unified global logistics", "Reduced intermodal transfer delays", "Optimized freight costs"],
                "use_cases": ["International trade", "Complex freight forwarding", "Intermodal transport planning"],
                "pricing": "Tier 3 Enterprise Module"
            },
            "vaultmeshconnect": {
                "name": "VaultMesh™ Connect",
                "description": "VaultMesh™ Connect ensures that every critical decision and transaction within your optimized logistics network is securely and immutably recorded on the FAA.ZONE's distributed ledger. This provides unparalleled data provenance, auditability, and trust across your supply chain.",
                "features": ["Blockchain-verified transaction logging", "Immutable audit trails", "Decentralized data storage", "Smart contract integration for automated payouts"],
                "specs": { "Ledger Type": "FAA.ZONE Private Blockchain", "Consensus": "Proof-of-Authority", "Throughput": "10,000+ Tx/sec", "Security": "Homomorphic Encryption" },
                "benefits": ["Enhanced data security", "Immutable audit trails", "Increased supply chain trust"],
                "use_cases": ["High-value goods tracking", "Compliance reporting", "Secure data sharing"],
                "pricing": "Included with Enterprise FAA.ZONE Subscription"
            },
        }

        # Mock data for other new sections (these can be made specific to brand_name as well)
        features_deep_dive_data_for_js = [
            {"title": "Real-Time Adaptive Routing", "description": "Continuously adjusts routes based on live traffic, weather, and unexpected events.", "icon": "🚦" },
            {"title": "Predictive Demand Forecasting", "description": "Leverages AI to anticipate future demand patterns, optimizing resource allocation proactively.", "icon": "📈" },
            {"title": "Dynamic Capacity Management", "description": "Automatically balances load across your network to prevent bottlenecks and maximize utilization.", "icon": "⚖️" },
            {"title": "Automated Compliance Assurance", "description": "Ensures all logistics operations adhere to regional and international regulations without manual oversight.", "icon": "✅" }
        ]

        integration_capabilities_data_for_js = [
            {"name": "ERP Systems", "description": "Seamless integration with major ERP platforms like SAP, Oracle, and Microsoft Dynamics.", "icon": "💻" },
            {"name": "IoT & Telematics", "description": "Connects with vehicle telematics and IoT sensors for real-time asset tracking and condition monitoring.", "icon": "📡" },
            {"name": "CRM Platforms", "description": "Integrates with CRM systems to provide real-time delivery updates and improve customer service.", "icon": "🤝" },
            {"name": "Custom API & Webhooks", "description": "Flexible APIs and webhooks for bespoke integrations with proprietary or niche systems.", "icon": "🔗" }
        ]

        use_cases_data_for_js = [
            {"title": "E-commerce Fulfillment", "description": "Optimize last-mile delivery for rapid e-commerce order fulfillment and customer satisfaction.", "icon": "🛍️" },
            {"title": "Cold Chain Logistics", "description": "Ensure integrity of temperature-sensitive goods with optimized routes and real-time monitoring.", "icon": "❄️" },
            {"title": "Manufacturing Supply Chains", "description": "Streamline raw material inbound and finished goods outbound logistics for lean manufacturing.", "icon": "🏭" },
            {"title": "Humanitarian Aid Delivery", "description": "Efficiently distribute critical supplies in complex and dynamic environments.", "icon": "❤️" }
        ]

        tech_specs_data_for_js = {
            "Architecture": "Cloud-native, Microservices",
            "Scalability": "Horizontal, auto-scaling",
            "API": "RESTful, GraphQL endpoints",
            "Security": "Multi-factor authentication, end-to-end encryption",
            "Deployment": "SaaS, Hybrid Cloud, On-Premise"
        }

        security_compliance_data_for_js = [
            "ISO 27001 Certified Data Centers",
            "GDPR & CCPA Compliant Data Handling",
            "FAA.ZONE VaultMesh™ for data immutability",
            "Regular Third-Party Security Audits",
            "Role-Based Access Control (RBAC)"
        ]

        customer_success_stories_for_js = [
            {"name": "Global Retailer X", "quote": "RouteMesh reduced our delivery times by 15% and fuel costs by 10% in the first quarter.", "industry": "Retail" },
            {"name": "Pharma Distributor Y", "quote": "The predictive analytics feature saved us from major disruptions multiple times, ensuring critical deliveries.", "industry": "Pharmaceuticals" },
            {"name": "Manufacturing Z", "quote": "Seamless integration with our ERP streamlined our entire supply chain planning process.", "industry": "Manufacturing" }
        ]

        support_training_data_for_js = [
            {"title": "24/7 Premium Support", "description": "Dedicated support team available around the clock for critical issues.", "icon": "📞" },
            {"title": "Comprehensive Documentation", "description": "Access to extensive online knowledge base and API documentation.", "icon": "📚" },
            {"title": "Onboarding & Training Programs", "description": "Tailored training sessions for your team to maximize RouteMesh adoption.", "icon": "🎓" },
            {"title": "Community Forum", "description": "Engage with other users and experts for best practices and troubleshooting.", "icon": "💬" }
        ]

        # Corrected: FAQ data and pricing overview content now correctly interpolate brand_name using f-string syntax in Python
        # The key is to ensure the Python f-string is properly terminated before any embedded string literals that might confuse it.
        # This requires careful handling of quotes and backticks.
        # Using json.dumps to stringify the `answer` values ensures proper escaping for JS.
        faq_data_for_js = [
            {"question": f"What is {brand_name}™?", "answer": f"{brand_name}™ is an AI-powered logistics optimization platform that uses real-time data to dynamically manage and improve delivery networks for global supply chains." },
            {"question": f"How does it ensure compliance?", "answer": f"{brand_name}™ integrates with TreatyMesh™ protocols and offers automated compliance checks and reporting based on predefined regulatory frameworks." },
            {"question": "Is it suitable for small businesses?", "answer": f"While {brand_name}™ is built for enterprise scale, our modular pricing allows smaller businesses to access core features. Contact sales for a tailored plan." }
        ]
        
        # Define pricing_overview_content_for_js using Python's triple quotes
        pricing_overview_content_for_js = f"""
            <p class="text-gray-300 text-lg mb-4">{brand_name}™ offers flexible pricing tiers designed to scale with your business needs, from essential optimization to comprehensive enterprise solutions. All tiers include robust security and basic FAA.ZONE integration.</p>
            <ul class="list-disc list-inside text-gray-300 text-base mb-6">
                <li><strong>Starter Node:</strong> Ideal for pilot projects and small-scale operations.</li>
                <li><strong>Pro Grid:</strong> Advanced features for growing logistics demands.</li>
                <li><strong>Enterprise Omni-Sync:</strong> Full suite of tools, custom integrations, and dedicated support for global enterprises.</li>
            </ul>
            <a href="pricing.html" class="bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-6 rounded-md transition-colors duration-200">View Detailed Pricing Plans</a>
        """

        js_content += f"""
            const productsData = {to_js_str(products_data_for_js)};
            const productDetailsMap = {to_js_str(product_details_map_for_js)};
            const featuresDeepDiveData = {to_js_str(features_deep_dive_data_for_js)};
            const integrationCapabilitiesData = {to_js_str(integration_capabilities_data_for_js)};
            const useCasesData = {to_js_str(use_cases_data_for_js)};
            const techSpecsData = {to_js_str(tech_specs_data_for_js)};
            const securityComplianceData = {to_js_str(security_compliance_data_for_js)};
            const customerSuccessStories = {to_js_str(customer_success_stories_for_js)};
            const supportTrainingData = {to_js_str(support_training_data_for_js)};
            const faqData = {to_js_str(faq_data_for_js)};
            const pricingOverviewContent = `{escape_js_template_literal_string(pricing_overview_content_for_js)}`;
        """

        js_content += """
            // Function to show the product detail modal
            function showProductModal(product) {
                document.getElementById('modalProductTitle').textContent = product.name;
                document.getElementById('modalProductDescription').textContent = product.description;

                const featuresUl = document.getElementById('modalProductFeatures').querySelector('ul');
                featuresUl.innerHTML = '';
                (product.features || []).forEach(f => { // Ensure features is an array
                    const li = document.createElement('li');
                    li.textContent = f;
                    featuresUl.appendChild(li);
                });

                const specsUl = document.getElementById('modalProductSpecs').querySelector('ul');
                specsUl.innerHTML = '';
                if (product.specs && Object.keys(product.specs).length > 0) {
                    for (const key in product.specs) {
                        const li = document.createElement('li');
                        li.innerHTML = `<strong>${key}</strong>: ${product.specs[key]}`;
                        specsUl.appendChild(li);
                    }
                } else {
                    specsUl.innerHTML = '<li>No detailed specifications available.</li>';
                }

                const benefitsDiv = document.getElementById('modalProductBenefits');
                const benefitsUl = benefitsDiv.querySelector('ul') || document.createElement('ul');
                benefitsUl.innerHTML = '';
                benefitsUl.className = 'list-disc list-inside text-gray-300 ml-4';
                if (product.benefits && product.benefits.length > 0) {
                    benefitsDiv.style.display = 'block';
                    product.benefits.forEach(b => {
                        const li = document.createElement('li');
                        li.textContent = b;
                        benefitsUl.appendChild(li);
                    });
                    benefitsDiv.appendChild(benefitsUl);
                } else {
                    benefitsDiv.style.display = 'none'; // Hide section if no benefits
                }

                const useCasesDiv = document.getElementById('modalProductUseCases');
                const useCasesUl = useCasesDiv.querySelector('ul') || document.createElement('ul');
                useCasesUl.innerHTML = '';
                useCasesUl.className = 'list-disc list-inside text-gray-300 ml-4';
                if (product.use_cases && product.use_cases.length > 0) {
                    useCasesDiv.style.display = 'block';
                    product.use_cases.forEach(uc => {
                        const li = document.createElement('li');
                        li.textContent = uc;
                        useCasesUl.appendChild(li);
                    });
                    useCasesDiv.appendChild(useCasesUl);
                } else {
                    useCasesDiv.style.display = 'none'; // Hide section if no use cases
                }
                
                document.getElementById('modalProductPricing').textContent = `Pricing: ${product.pricing || 'Contact for Quote'}`;
                document.getElementById('productDetailModal').style.display = 'flex';
            }

            // Function to hide the product detail modal
            window.hideProductModal = function() { // Made global for onclick
                document.getElementById('productDetailModal').style.display = 'none';
            };

            // Function to simulate fetching product details
            async function fetchProductDetails(productId) {
                // In a real app, this would be an actual fetch call:
                // const response = await fetch(`http://localhost:5000/api/products/${productId}`);
                // const productDetails = await response.json();
                
                // For this demo, we're using the mock data map
                const productDetails = productDetailsMap[productId];
                if (productDetails) {
                    showProductModal(productDetails);
                } else {
                    console.error(`Product details for ID ${productId} not found in mock data.`);
                    // In a real app, you might show an error message in the modal or to the user
                    alert('Product details not found.'); // Using alert only for simple demo error
                }
            }
        """

        js_content += """
            // Fetch product listings (for the products page)
            // Example endpoint: http://localhost:5000/api/sectors/${sectorSlug}/brands/${brand_slug_clean}/products
            fetch(`http://localhost:5000/api/sectors/${sectorSlug}/brands/${brand_slug_clean}/products`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            return { products: productsData, error: 'Products data not found from backend, using mock data. Please set up backend endpoint.' };
                        }
                        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const productGrid = document.getElementById('productGrid');
                    if (data.error) {
                        productGrid.innerHTML = `<p class="text-red-400 text-center col-span-full">Error: ${data.error}</p>`;
                        // Fallback to mock data if backend fails
                        renderProductCards(productsData);
                        console.warn(data.error);
                        return;
                    }

                    if (data.products && data.products.length > 0) {
                        renderProductCards(data.products);
                    } else {
                        productGrid.innerHTML = `<p class="text-gray-400 text-center col-span-full">No products found for ${brandName}.</p>`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching product listings:', error);
                    document.getElementById('productGrid').innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load products for ${brandName}.</p>`;
                    // Fallback to mock data on network error
                    renderProductCards(productsData);
                });

            function renderProductCards(dataToRender) {
                productGrid.innerHTML = ''; // Clear loading message
                dataToRender.forEach(product => {
                    const productCard = document.createElement('div');
                    // Ensure h-full is applied to the card for consistent height
                    productCard.className = `bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-${accentColor500} transition-all duration-300 flex flex-col h-full`;
                    productCard.innerHTML = `
                        <div class="flex-grow flex flex-col justify-between">
                            <div> <span class="text-4xl mb-4 block text-center">${product.icon}</span>
                                <h4 class="text-2xl font-semibold text-white mb-2 text-center">${product.name}</h4>
                                <p class="text-gray-400 text-center">${product.description}</p>
                            </div>
                        </div>
                        <button data-product-id="${product.id}" class="view-details-btn mt-4 ${ci_classes['button_bg']} ${ci_classes['hover_button_bg']} text-white font-bold py-2 px-4 rounded-md w-full">View Details</button>
                    `;
                    productGrid.appendChild(productCard);
                });

                // Add event listeners to the new buttons
                productGrid.querySelectorAll('.view-details-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const productId = event.target.dataset.productId;
                        fetchProductDetails(productId);
                    });
                });
            }

            // --- Render Key Features Deep Dive ---
            const featuresDeepDiveContentDiv = document.getElementById('featuresDeepDiveContent');
            if (featuresDeepDiveData.length > 0) {
                featuresDeepDiveContentDiv.innerHTML = ''; // Clear loading message
                featuresDeepDiveData.forEach(feature => {
                    const featureCard = document.createElement('div');
                    featureCard.className = `bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700`;
                    featureCard.innerHTML = `
                        <span class="text-3xl block mb-2">${feature.icon}</span>
                        <h4 class="text-xl font-semibold text-white mb-2">${feature.title}</h4>
                        <p class="text-gray-400">${feature.description}</p>
                    `;
                    featuresDeepDiveContentDiv.appendChild(featureCard);
                });
            } else {
                featuresDeepDiveContentDiv.innerHTML = `<p class="text-gray-400 text-center col-span-full">No detailed features available.</p>`;
            }

            // --- Render Integration Capabilities ---
            const integrationCapabilitiesContentDiv = document.getElementById('integrationCapabilitiesContent');
            if (integrationCapabilitiesData.length > 0) {
                integrationCapabilitiesContentDiv.innerHTML = '';
                integrationCapabilitiesData.forEach(integration => {
                    const integrationCard = document.createElement('div');
                    integrationCard.className = `bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700`;
                    integrationCard.innerHTML = `
                        <span class="text-3xl block mb-2">${integration.icon}</span>
                        <h4 class="text-xl font-semibold text-white mb-2">${integration.name}</h4>
                        <p class="text-gray-400">${integration.description}</p>
                    `;
                    integrationCapabilitiesContentDiv.appendChild(integrationCard);
                });
            } else {
                integrationCapabilitiesContentDiv.innerHTML = `<p class="text-gray-400 text-center col-span-full">No integration capabilities listed.`;
            }

            // --- Render Use Cases & Industry Applications ---
            const useCasesContentDiv = document.getElementById('useCasesContent');
            if (useCasesData.length > 0) {
                useCasesContentDiv.innerHTML = '';
                useCasesData.forEach(useCase => {
                    const useCaseCard = document.createElement('div');
                    useCaseCard.className = `bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700`;
                    useCaseCard.innerHTML = `
                        <span class="text-3xl block mb-2">${useCase.icon}</span>
                        <h4 class="text-xl font-semibold text-white mb-2">${useCase.title}</h4>
                        <p class="text-gray-400">${useCase.description}</p>
                    `;
                    useCasesContentDiv.appendChild(useCaseCard);
                });
            } else {
                useCasesContentDiv.innerHTML = `<p class="text-gray-400 text-center col-span-full">No use cases available.</p>`;
            }

            // --- Render Technical Specifications Summary ---
            const techSpecsContentDiv = document.getElementById('techSpecsContent');
            techSpecsContentDiv.innerHTML = '';
            if (Object.keys(techSpecsData).length > 0) {
                const techSpecsList = document.createElement('ul');
                techSpecsList.className = 'list-disc list-inside text-gray-300 ml-4';
                for (const spec in techSpecsData) {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${spec}</strong>: ${techSpecsData[spec]}`;
                    techSpecsList.appendChild(li);
                }
                techSpecsContentDiv.appendChild(techSpecsList);
            } else {
                techSpecsContentDiv.innerHTML = `<p class="text-gray-400 text-center">No technical specifications available.`;
            }

            // --- Render Security & Compliance Highlights ---
            const securityComplianceContentDiv = document.getElementById('securityComplianceContent');
            if (securityComplianceData.length > 0) {
                securityComplianceContentDiv.innerHTML = '';
                const securityList = document.createElement('ul');
                securityList.className = 'list-disc list-inside text-gray-300 ml-4';
                securityComplianceData.forEach(highlight => {
                    const li = document.createElement('li');
                    li.textContent = highlight;
                    securityList.appendChild(li);
                });
                securityComplianceContentDiv.appendChild(securityList);
            } else {
                securityComplianceContentDiv.innerHTML = `<p class="text-gray-400 text-center">No security and compliance highlights available.`;
            }

            // --- Render Customer Success & Testimonials ---
            const customerSuccessContentDiv = document.getElementById('customerSuccessContent');
            if (customerSuccessStories.length > 0) {
                customerSuccessContentDiv.innerHTML = '';
                const testimonialsGrid = document.createElement('div');
                testimonialsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
                customerSuccessStories.forEach(story => {
                    const testimonialCard = document.createElement('div');
                    testimonialCard.className = `bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700`;
                    testimonialCard.innerHTML = `
                        <p class="text-gray-300 italic mb-3">"${story.quote}"</p>
                        <p class="text-white font-semibold">- ${story.name}, <span class="text-gray-400">${story.industry}</span></p>
                    `;
                    testimonialsGrid.appendChild(testimonialCard);
                });
                customerSuccessContentDiv.appendChild(testimonialsGrid);
            } else {
                customerSuccessContentDiv.innerHTML = `<p class="text-gray-400 text-center">No customer success stories available.`;
            }

            // --- Render Support & Training ---
            const supportTrainingContentDiv = document.getElementById('supportTrainingContent');
            if (supportTrainingData.length > 0) {
                supportTrainingContentDiv.innerHTML = '';
                const supportGrid = document.createElement('div');
                supportGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
                supportTrainingData.forEach(item => {
                    const supportCard = document.createElement('div');
                    supportCard.className = `bg-gray-900 rounded-lg shadow-md p-5 border border-gray-700`;
                    supportCard.innerHTML = `
                        <span class="text-3xl block mb-2">${item.icon}</span>
                        <h4 class="text-xl font-semibold text-white mb-2">${item.title}</h4>
                        <p class="text-gray-400">${item.description}</p>
                    `;
                    supportGrid.appendChild(supportCard);
                });
                supportTrainingContentDiv.appendChild(supportGrid);
            } else {
                supportTrainingContentDiv.innerHTML = `<p class="text-gray-400 text-center">No support and training information available.`;
            }

            // --- Render FAQ ---
            const faqContentDiv = document.getElementById('faqContent');
            if (faqData.length > 0) {
                faqContentDiv.innerHTML = '';
                faqData.forEach(faq => {
                    const faqItem = document.createElement('div');
                    faqItem.className = `bg-gray-900 rounded-lg shadow-md p-5 mb-4 border border-gray-700`;
                    faqItem.innerHTML = `
                        <h4 class="text-xl font-semibold text-white mb-2">${faq.question}</h4>
                        <p class="text-gray-400">${faq.answer}</p>
                    `;
                    faqContentDiv.appendChild(faqItem);
                });
            } else {
                faqContentDiv.innerHTML = `<p class="text-gray-400 text-center">No FAQs available.`;
            }

            // --- Render Pricing Overview ---
            const pricingOverviewContentDiv = document.getElementById('pricingOverviewContent');
            pricingOverviewContentDiv.innerHTML = pricingOverviewContent;
        }});
    </script>
</body>
</html>
"""
    return js_content

# --- Main Generation Logic ---
def generate_brand_portal_pages():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for sector_slug, sector_info in SECTOR_DATA_FOR_GENERATION.items():
        # sector_slug is the key (e.g., "agriculture")
        # sector_info is the value (the dictionary for that sector)

        # Ensure CI color is valid, default to gray if not found
        ci_classes = CI_COLOR_MAP.get(sector_info.get("ci_color", "gray"), CI_COLOR_MAP["gray"])
        
        # Generate pages for each brand within the sector
        for brand in sector_info["brands"]:
            brand_name = brand["name"]
            brand_slug = brand_name.lower().replace(' ', '-').replace('™', '')
            brand_icon = brand["brand_icon"] # Icon specific to the brand

            brand_output_dir = os.path.join(OUTPUT_DIR, sector_slug, brand_slug) # Use sector_slug (the key) here
            os.makedirs(brand_output_dir, exist_ok=True)

            for page_type_data in BRAND_PAGE_TYPES:
                file_name = page_type_data["file"]
                output_file_path = os.path.join(brand_output_dir, file_name)

                # Generate header, navigation, and footer
                header_html = generate_html_header(brand_name, page_type_data, ci_classes, brand_icon)
                nav_links_html = generate_html_nav_links(sector_slug, brand_slug, file_name, ci_classes)
                footer_html = generate_html_footer(ci_classes)

                # Determine the main content based on page type
                main_content = ""
                if file_name == "products.html":
                    main_content = generate_products_html_content(brand_name, ci_classes)
                else:
                    # Default content for other pages
                    page_title = page_type_data['title_suffix']
                    hero_icon = page_type_data['hero_icon']
                    main_content = f"""
<section class="text-center mb-12">
    <h2 class="text-5xl md:text-6xl font-extrabold text-white mb-4">
        {hero_icon} {brand_name}™ {page_title}
    </h2>
    <p class="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
        This is the {page_title} page for {brand_name}. Content for this page will be dynamically loaded or expanded here.
    </p>
    <div class="mt-8">
        <a href="dashboard.html" class="{ci_classes['button_bg']} {ci_classes['hover_button_bg']} text-white font-bold py-3 px-8 rounded-md transition-colors duration-200 shadow-lg">
            Go to Dashboard
        </a>
    </div>
</section>
<section class="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
    <h3 class="text-3xl font-semibold {ci_classes['accent_text']} mb-4">Welcome to our {page_title}</h3>
    <p class="text-gray-300 leading-relaxed">
        Detailed information and interactive elements for {brand_name}'s {page_title.lower()} will be available here.
        We are continuously updating our portal to provide the most relevant data and user experience.
    </p>
    <div class="mt-6 text-gray-400">
        <p><strong>Key Areas:</strong></p>
        <ul class="list-disc list-inside ml-4 mt-2">
            <li>Overview of {brand_name} offerings.</li>
            <li>In-depth insights into {page_title.lower()} data.</li>
            <li>Relevant statistics and user-specific information.</li>
        </ul>
    </div>
</section>
                    """
                
                # Assemble the full HTML content using a list of lines for better control over indentation
                html_lines = [
                    "<!DOCTYPE html>",
                    "<html lang=\"en\">",
                    header_html.strip(),
                    nav_links_html.strip(),
                    "                        </ul>", # This line is part of nav_links_html context, keep its original indentation from there
                    "                    </nav>",
                    "                </div>",
                    "            </div>",
                    "        </header>",
                    "", # Empty line for readability
                    "        <main class=\"flex-grow container mx-auto px-6 py-8 md:py-12\">",
                    "            ",
                    "            <div id=\"dynamicContent\" class=\"mb-12\">",
                    # Indent the main_content by 4 spaces for consistency within the div
                    # Adding 4 spaces to each line of main_content
                    "\n".join("    " + line for line in main_content.strip().splitlines()),
                    "            </div>",
                    "        </main>",
                    footer_html.strip(),
                    generate_js_for_page(sector_slug, brand, page_type_data, sector_info).strip(),
                    "</html>"
                ]

                full_html_content = "\n".join(html_lines)


                with open(output_file_path, "w", encoding="utf-8") as f:
                    f.write(full_html_content)
                print(f"Generated: {output_file_path}")

# Run the generation
if __name__ == "__main__":
    generate_brand_portal_pages()