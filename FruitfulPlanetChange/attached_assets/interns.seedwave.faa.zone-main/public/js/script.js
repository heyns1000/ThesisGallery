const allSectorsData = {
            "agriculture": { name: "🌱 Agriculture & Biotech", repoName: "agriculture-seedwave-admin", baseUrl: "heyns1000/agriculture.seedwave.faa.zone", brands: [] },
            "fsf": { name: "🥦 Food, Soil & Farming", repoName: "fsf-seedwave-admin", baseUrl: "heyns1000/fsf.seedwave.faa.zone", brands: [] },
            "banking": { name: "🏦 Banking & Finance", repoName: "banking-seedwave-admin", baseUrl: "heyns1000/banking.seedwave.faa.zone", brands: [] },
            "creative": { name: "🖋️ Creative Tech", repoName: "creative-seedwave-admin", baseUrl: "heyns1000/creative.seedwave.faa.zone", brands: [] },
            "logistics": { name: "📦 Logistics & Packaging", repoName: "logistics-seedwave-admin", baseUrl: "heyns1000/logistics.seedwave.faa.zone", brands: [] },
            "education-ip": { name: "📚 Education & IP", repoName: "education-ip-seedwave-admin", baseUrl: "heyns1000/education-ip.seedwave.faa.zone", brands: [] },
            "fashion": { name: "✂ Fashion & Identity", repoName: "fashion-seedwave-admin", baseUrl: "heyns1000/fashion.seedwave.faa.zone", brands: [] },
            "gaming": { name: "🎮 Gaming & Simulation", repoName: "gaming-seedwave-admin", baseUrl: "heyns1000/gaming.seedwave.faa.zone", brands: [] },
            "health": { name: "🧠 Health & Hygiene", repoName: "health-seedwave-admin", baseUrl: "heyns1000/health.seedwave.faa.zone", brands: [] },
            "housing": { name: "🏗️ Housing & Infrastructure", repoName: "housing-seedwave-admin", baseUrl: "heyns1000/housing.seedwave.faa.zone", brands: [] },
            "justice": { name: "⚖ Justice & Ethics", repoName: "justice-seedwave-admin", baseUrl: "heyns1000/justice.seedwave.faa.zone", brands: [] },
            "knowledge": { name: "📖 Knowledge & Archives", repoName: "knowledge-seedwave-admin", baseUrl: "heyns1000/knowledge.seedwave.faa.zone", brands: [] },
            "micromesh": { name: "☰ Micro-Mesh Logistics", repoName: "micromesh-seedwave-admin", baseUrl: "heyns1000/micromesh.seedwave.faa.zone", brands: [] },
            "media": {
                name: "🎬 Motion, Media & Sonic",
                repoName: "media-sonic-seedwave-admin",
                baseUrl: "heyns1000/media-sonic.seedwave.faa.zone",
                brands: [
                    { name: "Sonic Grid", subnodes: ["WullVision", "Aude Drap", "Visudan", "Handere", "Mationa", "Ciprode", "Soundbeard", "Medatsce", "MelonDies"] },
                    { name: "VisualFlow", subnodes: ["RenderEngine", "MotionPath", "ColorSync"] },
                    { name: "AudioPulse", subnodes: ["SoundscapeGen", "VoiceID", "MixMaster"] }
                ]
            },
            "nutrition": { name: "✿ Nutrition & Food Chain", repoName: "nutrition-seedwave-admin", baseUrl: "heyns1000/nutrition.seedwave.faa.zone", brands: [] },
            "ai-logic": { name: "🧠 AI, Logic & Grid", repoName: "ai-logic-seedwave-admin", baseUrl: "heyns1000/ai-logic.seedwave.faa.zone", brands: [] },
            "packaging": { name: "📦 Packaging & Materials", repoName: "packaging-seedwave-admin", baseUrl: "heyns1000/packaging.seedwave.faa.zone", brands: [] },
            "quantum": { name: "✴️ Quantum Protocols", repoName: "quantum-seedwave-admin", baseUrl: "heyns1000/quantum.seedwave.faa.zone", brands: [] },
            "ritual": { name: "☯ Ritual & Culture", repoName: "ritual-seedwave-admin", baseUrl: "heyns1000/ritual.seedwave.faa.zone", brands: [] },
            "saas": { name: "🔑 SaaS & Licensing", repoName: "saas-seedwave-admin", baseUrl: "heyns1000/saas.seedwave.faa.zone", brands: [] },
            "trade": { name: "🧺 Trade Systems", repoName: "trade-seedwave-admin", baseUrl: "heyns1000/trade.seedwave.faa.zone", brands: [] },
            "utilities": { name: "🔋 Utilities & Energy", repoName: "utilities-seedwave-admin", baseUrl: "heyns1000/utilities.seedwave.faa.zone", brands: [] },
            "voice": { name: "🎙️ Voice & Audio", repoName: "voice-seedwave-admin", baseUrl: "heyns1000/voice.seedwave.faa.zone", brands: [] },
            "webless": { name: "📡 Webless Tech & Nodes", repoName: "webless-seedwave-admin", baseUrl: "heyns1000/webless.seedwave.faa.zone", brands: [] },
            "nft": { name: "🔁 NFT & Ownership", repoName: "nft-seedwave-admin", baseUrl: "heyns1000/nft.seedwave.faa.zone", brands: [] },
            "education-youth": { name: "🎓 Education & Youth", repoName: "education-youth-seedwave-admin", baseUrl: "heyns1000/education-youth.seedwave.faa.zone", brands: [] },
            "zerowaste": { name: "♻️ Zero Waste", repoName: "zerowaste-seedwave-admin", baseUrl: "heyns1000/zerowaste.seedwave.faa.zone", brands: [] },
            "professional": { name: "🧾 Professional Services", repoName: "professional-seedwave-admin", baseUrl: "heyns1000/professional.seedwave.faa.zone", brands: [] },
            "payroll-mining": { name: "🪙 Payroll Mining & Accounting", repoName: "payroll-mining-seedwave-admin", baseUrl: "heyns1000/payroll-mining.seedwave.faa.zone", brands: [] },
            "mining": { name: "⛏️ Mining & Resources", repoName: "mining-seedwave-admin", baseUrl: "heyns1000/mining.seedwave.faa.zone", brands: [] },
            "wildlife": { name: "🦁 Wildlife & Habitat", repoName: "wildlife-seedwave-admin", baseUrl: "heyns1000/wildlife.seedwave.faa.zone", brands: [] },
            "admin-panel": { name: "⚙️ Admin Panel", repoName: "admin-panel-seedwave-admin", baseUrl: "heyns1000/admin-panel.seedwave.faa.zone", brands: [] },
            // Top-level custom domains
            "faa.zone": { name: "FAA.Zone Portal", baseUrl: "heyns1000/faa.zone", brands: [], repoName: "faa-zone-portal" },
            "seedwave": { name: "Seedwave Platform", baseUrl: "heyns1000/seedwave", brands: [], repoName: "seedwave-platform" },
            "vaultmesh": { name: "VaultMesh", baseUrl: "heyns1000/vaultmesh", brands: [], repoName: "vaultmesh-project" },
            "baobab": { name: "Baobab Network", baseUrl: "heyns1000/baobab", brands: [], repoName: "baobab-network" },
            "fruitful": { name: "Fruitful Global", baseUrl: "heyns1000/fruitful", brands: [], repoName: "fruitful-global" },
            "samfox": { name: "SamFox Initiative", baseUrl: "heyns1000/samfox", brands: [], repoName: "samfox-initiative" },
            "tripot": { name: "Tripot Innovations", baseUrl: "heyns1000/tripot", brands: [], repoName: "tripot-innovations" },
            "legal": { name: "Legal & Compliance", baseUrl: "heyns1000/legal", brands: [], repoName: "legal-portal" },
            "omnigrid": { name: "OmniGrid System", baseUrl: "heyns1000/omnigrid", brands: [], repoName: "omnigrid-system" },
            "portal": { name: "Central Portal", baseUrl: "heyns1000/portal", brands: [], repoName: "central-portal" },
            "careers": { name: "Careers at Fruitful", baseUrl: "heyns1000/careers", brands: [], repoName: "careers-portal" },
            "payment": { name: "Secure Payments", baseUrl: "heyns1000/payment", brands: [], repoName: "payment-gateway" },
            "noodle.juice": { name: "Noodle Juice", baseUrl: "heyns1000/noodle.juice", brands: [], repoName: "noodle-juice-app" },
            "astrowind": { name: "AstroWind Platform", baseUrl: "heyns1000/astrowind", brands: [], repoName: "astrowind-project" },
            "cloudflare-docs": { name: "Cloudflare Documentation", baseUrl: "heyns1000/cloudflare-docs", brands: [], repoName: "cloudflare-docs" },
            "faa-vault-ui": { name: "FAA Vault UI", baseUrl: "heyns1000/faa-vault-ui", brands: [], repoName: "faa-vault-ui" },
            "portfolio-responsive-complete": { name: "Portfolio Hub", baseUrl: "heyns1000/portfolio-responsive-complete", brands: [], repoName: "portfolio-hub" },
            "interns": { name: "🧑‍🎓 Interns Program", repoName: "interns-seedwave-admin", baseUrl: "heyns1000/interns.seedwave.faa.zone", brands: [] },
            "api-vault": { name: "🔑 API Vault", repoName: "api-vault-seedwave-admin", baseUrl: "heyns1000/api.vault.seedwave.faa.zone", brands: [] },
            "toynest": { name: "🧸 ToyNest", repoName: "toynest-seedwave-admin", baseUrl: "heyns1000/toynest.seedwave.faa.zone", brands: [] },
            "menu": { name: "☰ Main Menu", repoName: "menu-seedwave-admin", baseUrl: "heyns1000/menu.seedwave.faa.zone", brands: [] }
        };

        // Function to call Gemini API (unchanged from seedwave-menu)
        window.callGeminiAPI = async function(prompt, statusElement, buttonElement, type) {
            console.log(`Calling Gemini API for type: ${type}`);
            if (!statusElement || !buttonElement) {
                console.error("Missing status element or button element for Gemini API call.");
                return null;
            }

            statusElement.textContent = "Generating...";
            statusElement.classList.remove('hidden');
            buttonElement.disabled = true;
            buttonElement.innerHTML = `<span class="inline-block border-4 border-t-blue-500 border-gray-300 rounded-full w-4 h-4 animate-spin"></span>`; // Smaller spinner for button

            try {
                let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                const payload = { contents: chatHistory };
                const apiKey = ""; // Canvas will automatically provide the API key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();
                console.log("Gemini API response:", result);
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    const text = result.candidates[0].content.parts[0].text;
                    statusElement.textContent = "Generation complete!";
                    return text;
                } else {
                    statusElement.textContent = "Error: No content generated by AI.";
                    console.error("Gemini API returned an unexpected structure or no content:", result);
                    return null;
                }
            } catch (error) {
                statusElement.textContent = "Error: API call failed.";
                console.error("Error calling Gemini API:", error);
                return null;
            } finally {
                buttonElement.disabled = false;
                // Restore button text based on 'type'
                let originalButtonText = '';
                if (type === 'Generate Overview') {
                    originalButtonText = 'Generate Overview';
                } else if (type === 'Suggest Integration') {
                    originalButtonText = 'Suggest Integration Steps';
                } else if (type === 'Suggest Slogans') {
                    originalButtonText = 'Suggest Marketing Slogans';
                }
                buttonElement.innerHTML = `<i class="fas fa-magic"></i> ✨ ${originalButtonText}`; // Using magic wand icon
                setTimeout(() => statusElement.classList.add('hidden'), 3000);
            }
        };

        // Function to handle overview generation (unchanged from seedwave-menu)
        window.generateOverview = async function(key, buttonElement) {
            const statusElementId = `overviewStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const statusElement = document.getElementById(statusElementId);
            const sector = allSectorsData[key];

            if (!sector) {
                window.showCustomModal('Error', 'Sector data not found.');
                return;
            }

            const prompt = `Generate a concise (max 80 words), engaging overview for the "${sector.name}" domain/sector (URL: ${sector.baseUrl}). Highlight its primary purpose and key offerings within the heyns1000/Seedwave FAA.Zone ecosystem. Focus on its value proposition.`;
            
            const overviewText = await window.callGeminiAPI(prompt, statusElement, buttonElement, 'Generate Overview');

            if (overviewText) {
                window.showCustomModal(`Overview: ${sector.name}`, overviewText);
            } else {
                window.showCustomModal('Generation Failed', 'Could not generate overview. Please try again.');
            }
        };

        // Function for suggesting integration steps (unchanged from seedwave-menu)
        window.suggestIntegrationSteps = async function(key, buttonElement) {
            const statusElementId = `integrationStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const statusElement = document.getElementById(statusElementId);
            const sector = allSectorsData[key];

            if (!sector) {
                window.showCustomModal('Error', 'Sector data not found for integration steps.');
                return;
            }

            const prompt = `Generate a concise, step-by-step guide (max 150 words, using bullet points for steps) for a new user to integrate with or get started on the "${sector.name}" platform (URL: ${sector.baseUrl}). Include typical initial setup actions, where to find documentation, and who to contact for support. If it's a technical platform, mention API access. If it's content-focused, mention content submission/publishing. Provide only the guide.`;
            
            const integrationStepsText = await window.callGeminiAPI(prompt, statusElement, buttonElement, 'Suggest Integration');

            if (integrationStepsText) {
                window.showCustomModal(`Integration Steps: ${sector.name}`, integrationStepsText);
            } else {
                window.showCustomModal('Integration Suggestion Failed', 'Could not generate integration steps. Please try again.');
            }
        };

        // Function for suggesting marketing slogans (unchanged from seedwave-menu)
        window.suggestMarketingSlogans = async function(key, buttonElement) {
            const statusElementId = `slogansStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}`;
            const statusElement = document.getElementById(statusElementId);
            const sector = allSectorsData[key];

            if (!sector) {
                window.showCustomModal('Error', 'Sector data not found for slogan generation.');
                return;
            }

            const prompt = `Generate 3-5 short, catchy marketing slogans/taglines (max 15 words each, as a bulleted list) for "${sector.name}" (URL: ${sector.baseUrl}). Focus on its unique value proposition and target audience within the heyns1000/Seedwave FAA.Zone ecosystem. Provide only the slogans.`;
            
            const slogansText = await window.callGeminiAPI(prompt, statusElement, buttonElement, 'Suggest Slogans');

            if (slogansText) {
                window.showCustomModal(`Marketing Slogans: ${sector.name}`, slogansText);
            } else {
                window.showCustomModal('Slogan Generation Failed', 'Could not generate marketing slogans. Please try again.');
            }
        };

        // Global functions for custom modal and other utilities (unchanged from seedwave-menu)
        window.showCustomModal = function(title, message) {
            const modal = document.getElementById('customModal');
            const modalMessage = document.getElementById('customModalMessage');
            if (modal && modalMessage) {
                modalMessage.innerHTML = `<strong>${title}</strong><br>${message}`;
                modal.classList.remove('hidden');
                modal.classList.add('active'); // Activate animation
            }
        };

        window.hideCustomModal = function() {
            const modal = document.getElementById('customModal');
            if (modal) {
                modal.classList.remove('active'); // Deactivate animation
                setTimeout(() => modal.classList.add('hidden'), 300);
            }
        };

        // Utility function to toggle section visibility (for ecosystem map) (unchanged from seedwave-menu)
        window.toggleSection = function(id) {
            const element = document.getElementById(id);
            if (element) {
                element.classList.toggle('hidden');
                const icon = element.previousElementSibling.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            }
        };

        // Utility function to copy text to clipboard (unchanged from seedwave-menu)
        window.copyToClipboard = function(buttonElement) {
            const preElement = buttonElement.nextElementSibling; // Get the <pre> tag next to the button
            if (preElement && preElement.tagName === 'PRE') {
                const textToCopy = preElement.textContent.trim();
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    window.showCustomModal('Copied!', 'Text copied to clipboard.', true);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    window.showCustomModal('Copy Failed', 'Failed to copy text. Please try manually.', true);
                }
            }
        };

        // Function to render the dynamic menu (adapted for Central Portal)
        window.renderPortalItems = function(filter = '') {
            const portalItemsContainer = document.getElementById('portalItemsContainer');
            if (!portalItemsContainer) return;

            portalItemsContainer.innerHTML = ''; // Clear existing items

            // Define a more comprehensive order for display, prioritizing top-level items
            const displayOrder = [
                "faa.zone", "seedwave", "fruitful", "omnigrid", "legal",
                "vaultmesh", "baobab", "samfox", "tripot", "astrowind", "cloudflare-docs", 
                "faa-vault-ui", "portfolio-responsive-complete", "careers", "payment", "noodle.juice",
                "interns", "api-vault", "toynest", "menu", // Added interns, toynest and menu here
                // Then sectors
                "agriculture", "ai-logic", "admin-panel", "banking", "creative", "education-ip",
                "education-youth", "fashion", "fsf", "gaming", "health", "housing",
                "justice", "knowledge", "logistics", "media", "micromesh", "mining",
                "nutrition", "nft", "packaging", "payroll-mining", "professional",
                "quantum", "ritual", "saas", "trade", "utilities", "voice", "webless",
                "wildlife", "zerowaste"
            ];
            
            // Map of icon overrides for non-sector links
            const customLinkIcons = {
                "faa.zone": "fas fa-globe",
                "seedwave": "fas fa-seedling",
                "vaultmesh": "fas fa-shield-alt",
                "baobab": "fas fa-tree", 
                "fruitful": "fas fa-apple-alt",
                "samfox": "fas fa-fox",
                "tripot": "fas fa-flask",
                "legal": "fas fa-gavel",
                "omnigrid": "fas fa-braille",
                "portal": "fas fa-portal-enter",
                "careers": "fas fa-briefcase",
                "interns": "fas fa-user-graduate",
                "payment": "fas fa-credit-card",
                "noodle.juice": "fas fa-cocktail",
                "astrowind": "fas fa-wind",
                "cloudflare-docs": "fas fa-cloud",
                "faa-vault-ui": "fas fa-lock",
                "portfolio-responsive-complete": "fas fa-desktop",
                "api-vault": "fas fa-key",
                "toynest": "fas fa-gamepad", // Icon for ToyNest
                "menu": "fas fa-bars" // Icon for Main Menu
            };

            const sortedMenuKeys = Object.keys(allSectorsData).sort((a,b) => {
                const indexA = displayOrder.indexOf(a);
                const indexB = displayOrder.indexOf(b);

                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return a.localeCompare(b);
            });

            const filteredKeys = sortedMenuKeys.filter(key => {
                // Exclude 'portal' and 'faa-demo-dashboard' from the main listing as they have their own sidebar buttons/sections
                if (key === 'portal' || key === 'faa-demo-dashboard') return false; 
                const sector = allSectorsData[key];
                // FIX: Corrected typo from firstToLowerCase to toLowerCase
                return sector.name.toLowerCase().includes(filter.toLowerCase()) ||
                       sector.baseUrl.toLowerCase().includes(filter.toLowerCase());
            });


            if (filteredKeys.length === 0) {
                portalItemsContainer.innerHTML = '<p class="text-center text-gray-400 col-span-full">No matching items found.</p>';
                return;
            }

            filteredKeys.forEach(key => {
                const sector = allSectorsData[key];
                if (!sector) return; 

                const displayName = sector.name; 
                let iconClass = customLinkIcons[key]; 
                if (!iconClass) { 
                    const firstWord = displayName.split(' ')[0].toLowerCase();
                    if (firstWord.includes('motion') || firstWord.includes('media') || firstWord.includes('sonic')) iconClass = 'fas fa-video';
                    else if (firstWord.includes('food') || firstWord.includes('farming')) iconClass = 'fas fa-utensils';
                    else if (firstWord.includes('ai')) iconClass = 'fas fa-brain';
                    else if (firstWord.includes('education')) iconClass = 'fas fa-graduation-cap';
                    else if (firstWord.includes('finance')) iconClass = 'fas fa-sack-dollar';
                    else iconClass = 'fas fa-cube'; 
                }

                const baseUrl = sector.baseUrl; 

                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'border border-gray-700 rounded-lg p-4 mb-4 bg-gray-800';
                sectionDiv.innerHTML = `
                    <button class="toggle-section-btn flex justify-between items-center w-full text-left p-2 -mx-2 -my-2 rounded-md hover:bg-gray-700 transition-colors duration-200" onclick="window.toggleSection('sector-${key.replace(/[^a-zA-Z0-9]/g, '-')}')">
                        <span class="text-blue-400 text-xl font-bold">${displayName} <span class="text-gray-400 text-sm">(${baseUrl})</span></span>
                        <span><i class="fas fa-chevron-down text-gray-400"></i></span>
                    </button>
                    <div id="sector-${key.replace(/[^a-zA-Z0-9]/g, '-')}" class="repo-content-section hidden mt-4">
                        ${sector.brands && sector.brands.length > 0 ? `
                            <h4 class="text-lg font-semibold text-red-400 mb-2 mt-4">Brands & Subnodes:</h4>
                            <div class="space-y-2">
                                ${sector.brands.map(brand => `
                                    <div class="border border-gray-700 rounded-md p-3 bg-gray-700">
                                        <button class="toggle-section-btn !bg-transparent !shadow-none !text-left !px-0 !py-0 !mb-0 flex justify-between items-center w-full hover:bg-gray-600 transition-colors duration-200" onclick="window.toggleSection('brand-${key.replace(/[^a-zA-Z0-9]/g, '-')}-${brand.name.replace(/ /g, '-')}')">
                                            <span class="text-white font-medium">${brand.name}</span> <span><i class="fas fa-chevron-down"></i></span>
                                        </button>
                                        <div id="brand-${key.replace(/[^a-zA-Z0-9]/g, '-')}-${brand.name.replace(/ /g, '-')}" class="repo-content-section !border-none !bg-transparent !p-0 hidden mt-2">
                                            <div class="copy-square">
                                                <button class="copy-button" onclick="window.copyToClipboard(this)">Copy</button>
                                                <pre class="conversation-code-block">${baseUrl}/brands/${encodeURIComponent(brand.name.toLowerCase().replace(/ /g, '-'))}/index</pre>
                                            </div>
                                            ${brand.subnodes.map(subnode => `
                                                <div class="copy-square ml-4 mt-2">
                                                    <button class="copy-button" onclick="window.copyToClipboard(this)">Copy</button>
                                                    <pre class="conversation-code-block">${baseUrl}/brands/${encodeURIComponent(brand.name.toLowerCase().replace(/ /g, '-'))}/${encodeURIComponent(subnode.toLowerCase().replace(/ /g, '-'))}/index</pre>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <h4 class="text-lg font-semibold text-red-400 mb-2 mt-4">Direct Link:</h4>
                        <div class="copy-square">
                            <button class="copy-button" onclick="window.copyToClipboard(this)">Copy</button>
                            <pre class="conversation-code-block">${baseUrl}</pre>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            <!-- Gemini API powered buttons -->
                            <button class="form-action-button text-xs px-2 py-1" onclick="window.generateOverview('${key}', this)">
                                <i class="fas fa-magic"></i> ✨ Generate Overview
                            </button>
                            <button class="form-action-button secondary text-xs px-2 py-1" onclick="window.suggestIntegrationSteps('${key}', this)">
                                <i class="fas fa-lightbulb"></i> ✨ Suggest Integration Steps
                            </button>
                            <button class="form-action-button text-xs px-2 py-1 bg-green-600 hover:bg-green-700" onclick="window.suggestMarketingSlogans('${key}', this)">
                                <i class="fas fa-bullhorn"></i> ✨ Suggest Marketing Slogans
                            </button>
                        </div>
                        <!-- Status messages for Gemini API calls -->
                        <p id="overviewStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}" class="text-xs text-gray-400 mt-1 hidden"></p>
                        <p id="integrationStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}" class="text-xs text-gray-400 mt-1 hidden"></p>
                        <p id="slogansStatus-${key.replace(/[^a-zA-Z0-9]/g, '-')}" class="text-xs text-gray-400 mt-1 hidden"></p>
                    </div>
                `;
                portalItemsContainer.appendChild(sectionDiv);
            });
        };

        // --- SPA Routing Logic ---
        window.showSection = function(sectionId) {
            // Hide all content sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Show the target section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                // If the global payment section is activated, initialize its specific logic
                if (sectionId === 'globalPaymentTemplateSection') {
                    initializeGlobalPaymentSectionLogic();
                } else if (sectionId === 'internsAdminPortalSection') {
                    initializeInternsAdminPortalLogic();
                } else if (sectionId === 'legalIndexSection') {
                    renderLegalDocuments(); // Render legal documents when this section is shown
                }
            }

            // Update active state in sidebar
            document.querySelectorAll('.nav-list a').forEach(link => {
                link.classList.remove('active');
            });
            const activeLink = document.querySelector(`.nav-list a[data-section-id="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        };

        document.addEventListener('DOMContentLoaded', () => {
            // Apply initial theme based on localStorage or default to dark
            const body = document.body;
            const themeToggle = document.getElementById('themeToggle');

            if (localStorage.getItem('theme') === 'light') {
                body.classList.add('light-mode');
                if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }

            if (themeToggle) {
                themeToggle.addEventListener('click', () => {
                    body.classList.toggle('light-mode');
                    const isLightMode = body.classList.contains('light-mode');
                    themeToggle.innerHTML = isLightMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
                    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
                });
            }

            // Initial render of the portal items for the home section
            window.renderPortalItems();

            // Add event listener for search input (only applies to portalHomeSection)
            document.getElementById('searchPortal').addEventListener('input', (event) => {
                window.renderPortalItems(event.target.value);
            });

            // Set initial active section (default to 'portalHomeSection')
            // Check URL hash for initial section, otherwise default to 'portalHomeSection'
            const initialSection = window.location.hash.substring(1) || 'portalHomeSection';
            window.showSection(initialSection);

            // Language data for i18n
            // This is placed here to ensure it's defined before updateFooterLanguage is called
            window.languageData = window.languageData || { 
                en: {
                    // Footer links
                    footerPrivacy: 'Privacy', footerTerms: 'Terms', footerContact: 'Contact',
                    footerCopyrightLink: 'Copyright', footerDevelopers: 'Developers',
                    footerVaultMeshLink: 'VaultMesh', footerFruitfulLink: 'Fruitful',
                    footerFAAZoneLink: 'FAA.Zone', footerAboutLink: 'About',
                    footerAccessibility: 'Accessibility',
                    footerCopyright: '© 2025 FAA™ Treaty System™. All Rights Reserved.',
                    footerPoweredBy: 'Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.',
                    // MineNest specific translations (from global_payment_portal)
                    "minenest_page_title": "🚀 MineNest™ Core Protocol",
                    "minenest_page_description": "A powerful FAA.ZONE framework empowering the ⛏️ Mining & Resources sector with advanced automation and data management. It connects effortlessly to the PulseGrid for optimized workflow and compliance.",
                    "features_title": "🎛️ MineNest™ Key Features",
                    "starter_title": "⚙️ Starter Node", "monthly_tag": "/mo", "annual_tag": "/yr", "starter_desc": "Ideal for small teams and pilot projects. Access essential features and secure basic data synchronization.", "starter_f1": "Essential features", "starter_f2": "Basic data sync", "starter_f3": "Community support",
                    "pro_title": "🚀 Pro Grid", "pro_desc": "Designed for growing firms needing advanced capabilities. Includes 7 core features and enhanced performance.", "pro_f1": "All Starter Features", "pro_f2": "Advanced features", "pro_f3": "High-volume data processing", "pro_f4": "Expanded analytics", "pro_f5": "Priority support",
                    "enterprise_title": "🌐 Enterprise Omni-Sync", "custom_price": "Custom", "enterprise_desc": "For large organizations requiring full VaultMesh access, custom integrations, and dedicated resources.", "enterprise_f1": "All Pro Features", "enterprise_f2": "Full VaultMesh access", "enterprise_f3": "Custom integrations", "enterprise_f4": "Dedicated account management", "enterprise_f5": "24/7 Premium Support",
                    "pricing_title": "💳 MineNest™ Pricing Structure",
                    "feature1_title": "Professional Services Mesh", "feature1_desc": "Direct integration with the FAA 🧾 Professional Services Mesh for seamless workflow and billing.",
                    "feature2_title": "Advanced Data Sync", "feature2_desc": "High-speed, reliable data synchronization with the <strong>NestTrack</strong> subnode for real-time asset tracking.",
                    "feature3_title": "Real-time Compliance", "feature3_desc": "Continuous compliance validation via <strong>VaultLink™</strong>, specifically tailored for the mining industry's strict regulations.",
                    "feature4_title": "Scalable Architecture", "feature4_desc": "Robust infrastructure designed for massive scalability, supporting up to x18 node expansion.",
                    "feature5_title": "Predictive Analytics", "feature5_desc": "Leverage our advanced predictive analytics module to forecast performance and maintenance needs.",
                    "feature6_title": "Seamless API Access", "feature6_desc": "Full API access ensures seamless interoperability with your existing systems and third-party tools.",
                    "gemini_title": "Discover MineNest™ for Your Operation",
                    "gemini_desc": "Enter your type of mining operation below (e.g., \"underground gold mine\", \"surface coal operation\") to see a custom-generated use case of how MineNest™ can benefit you.",
                    "gemini_placeholder": "e.g., Open-pit copper mine",
                    "gemini_button": "✨ Generate Use Case",
                    "gemini_result_placeholder": "Your personalized use case will appear here...",

                    // Internal Portal specific translations (from global_payment_portal)
                    "internal_page_title": "Welcome to the Fruitful Global Payment & SSO Portal",
                    "internal_page_description": "Your central hub for secure access to company resources and streamlined payment information. This portal ensures a seamless experience for all interns, developers, and staff.",
                    "sso_title": "🔐 Single Sign-On (SSO) Explained",
                    "sso1_title": "Enhanced Security",
                    "sso1_desc": "SSO reduces password fatigue and strengthens security by minimizing the number of credentials you need to manage, making it harder for unauthorized access.",
                    "sso2_title": "Simplified Access",
                    "sso2_desc": "Access all your Fruitful applications and services with a single set of credentials, saving you time and improving your daily workflow efficiency.",
                    "sso3_title": "Streamlined Onboarding",
                    "sso3_desc": "New team members can get up and running faster with simplified account setup across all necessary internal systems, reducing setup time.",
                    "payment_title": "💰 Internal Payment Information",
                    "payment1_title": "Expense Reimbursement",
                    "payment1_desc": "Submit and track your business expenses for reimbursement through our integrated finance portal. Ensure all receipts are attached for quick processing.",
                    "payment2_title": "Corporate Card Management",
                    "payment2_desc": "Information on managing your corporate credit card, including policies, spending limits, and reporting procedures. Contact finance for new card requests.",
                    "payment3_title": "Payroll & Benefits",
                    "payment3_3_desc": "Access your pay stubs, tax documents, and benefits information securely. Details on compensation cycles and benefit enrollment are available here.",
                    "internal_gemini_title": "Ask Our AI Assistant",
                    "internal_gemini_desc": "Enter your query below to get instant information. For specific Fruitful internal data, please contact the relevant department.",
                    "internal_gemini_placeholder": "e.g., How do I request time off?",
                    "internal_gemini_button": "✨ Get Info",
                    "internal_gemini_result_placeholder": "Your answer will appear here...",

                    // Currency Converter translations (from global_payment_portal)
                    "currency_converter_title": "💱 Global Currency Converter",
                    "currency_converter_desc": "Convert any currency globally using real-time exchange rates. Please note, this tool is for informational purposes only and uses a third-party API.",
                    "amount_placeholder": "Amount",
                    "convert_button": "Convert",
                    "currency_result_placeholder": "Converted amount will appear here...",
                    "error_fetch_currencies": "Error fetching currencies. Please try again later.",
                    "error_conversion": "Error performing conversion. Please check your input and try again.",
                    "invalid_amount": "Please enter a valid amount.",
                    "currency_not_found": "Currency data not found.",
                    "monthly_option_text": "Monthly",
                    "annual_option_text": "Annual (15% off)",
                    "select_currency_label": "Display Prices In:"
                },
                es: {
                    footerPrivacy: 'Privacidad', footerTerms: 'Términos', footerContact: 'Contacto',
                    footerCopyrightLink: 'Derechos de Autor', footerDevelopers: 'Desarrolladores',
                    footerVaultMeshLink: 'VaultMesh', footerFruitfulLink: 'Fruitful',
                    footerFAAZoneLink: 'FAA.Zone', footerAboutLink: 'Nosotros',
                    footerAccessibility: 'Accesibilidad',
                    footerCopyright: '© 2025 FAA™ Treaty System™. Todos los derechos reservados.',
                    footerPoweredBy: 'Impulsado por 🦍 glifos + API de Bóveda. Sincronizado con Seedwave™.',
                    // MineNest specific translations (from global_payment_portal)
                    "minenest_page_title": "🚀 MineNest™ Protocolo Central",
                    "minenest_page_description": "Un potente marco FAA.ZONE que empodera al sector de ⛏️ Minería y Recursos con automatización avanzada y gestión de datos. Se conecta sin esfuerzo a PulseGrid para un flujo de trabajo optimizado y cumplimiento.",
                    "features_title": "🎛️ MineNest™ Características Clave",
                    "starter_title": "⚙️ Nodo de Inicio", "monthly_tag": "/mes", "annual_tag": "/año", "starter_desc": "Ideal para equipos pequeños y proyectos piloto. Acceda a funciones esenciales y sincronización básica de datos segura.", "starter_f1": "Funciones esenciales", "starter_f2": "Sincronización básica de datos", "starter_f3": "Soporte comunitario",
                    "pro_title": "🚀 Cuadrícula Pro", "pro_desc": "Diseñado para empresas en crecimiento que necesitan capacidades avanzadas. Incluye 7 funciones principales y rendimiento mejorado.", "pro_f1": "Todas las funciones de inicio", "pro_f2": "Funciones avanzadas", "pro_f3": "Procesamiento de datos de alto volumen", "pro_f4": "Análisis expandido", "pro_f5": "Soporte prioritario",
                    "enterprise_title": "🌐 Omni-Sincronización Empresarial", "custom_price": "Personalizado", "enterprise_desc": "Para grandes organizaciones que requieren acceso completo a VaultMesh, integraciones personalizadas y recursos dedicados.", "enterprise_f1": "Todas las funciones Pro", "enterprise_f2": "Acceso completo a VaultMesh", "enterprise_f3": "Integraciones personalizadas", "enterprise_f4": "Gestión de cuentas dedicada", "enterprise_f5": "Soporte Premium 24/7",
                    "pricing_title": "💳 MineNest™ Estructura de Precios",
                    "feature1_title": "Malla de Servicios Profesionales", "feature1_desc": "Integración directa con la Malla de Servicios Profesionales de FAA 🧾 para un flujo de trabajo y facturación sin interrupciones.",
                    "feature2_title": "Sincronización Avanzada de Datos", "feature2_desc": "Sincronización de datos de alta velocidad y confiable con el subnodo <strong>NestTrack</strong> para el seguimiento de activos en tiempo real.",
                    "feature3_title": "Cumplimiento en Tiempo Real", "feature3_desc": "Validación continua del cumplimiento a través de <strong>VaultLink™</strong>, adaptada específicamente para las estrictas regulaciones de la industria minera.",
                    "feature4_title": "Arquitectura Escalable", "feature4_desc": "Infraestructura robusta diseñada para una escalabilidad masiva, soportando hasta x18 la expansión de nodos.",
                    "feature5_title": "Análisis Predictivo", "feature5_5_desc": "Aproveche nuestro módulo avanzado de análisis predictivo para pronosticar el rendimiento y las necesidades de mantenimiento.",
                    "feature6_title": "Acceso API Sin Problemas", "feature6_desc": "El acceso completo a la API garantiza una interoperabilidad perfecta con sus sistemas existentes y herramientas de terceros.",
                    "gemini_title": "Descubra MineNest™ para su Operación",
                    "gemini_desc": "Ingrese su tipo de operación minera a continuación (por ejemplo, \"mina de oro subterránea\", \"operación de carbón a cielo abierto\") para ver un caso de uso generado a medida de cómo MineNest™ puede beneficiarlo.",
                    "gemini_placeholder": "ej. Mina de cobre a cielo abierto",
                    "gemini_button": "✨ Generar Caso de Uso",
                    "gemini_result_placeholder": "Su caso de uso personalizado aparecerá aquí...",

                    // Internal Portal specific translations (from global_payment_portal)
                    "internal_page_title": "Bienvenido al Portal Global de Pagos y SSO de Fruitful",
                    "internal_page_description": "Su centro central para un acceso seguro a los recursos de la empresa e información de pago optimizada. Este portal garantiza una experiencia perfecta para todos los pasantes, desarrolladores y personal.",
                    "sso_title": "🔐 Inicio de Sesión Único (SSO) Explicado",
                    "sso1_title": "Seguridad Mejorada",
                    "sso1_desc": "SSO reduce la fatiga de la contraseña y fortalece la seguridad al minimizar la cantidad de credenciales que necesita administrar, lo que dificulta el acceso no autorizado.",
                    "sso2_title": "Acceso Simplificado",
                    "sso2_desc": "Acceda a todas sus aplicaciones y servicios de Fruitful con un único conjunto de credenciales, lo que le ahorra tiempo y mejora la eficiencia de su flujo de trabajo diario.",
                    "sso3_title": "Incorporación Optimizada",
                    "sso3_desc": "Los nuevos miembros del equipo pueden ponerse en marcha más rápido con una configuración de cuenta simplificada en todos los sistemas internos necesarios, lo que reduce el tiempo de configuración.",
                    "payment_title": "💰 Información de Pago Interna",
                    "payment1_title": "Reembolso de Gastos",
                    "payment1_desc": "Envíe y realice un seguimiento de sus gastos comerciales para su reembolso a través de nuestro portal financiero integrado. Asegúrese de que todos los recibos estén adjuntos para un procesamiento rápido.",
                    "payment2_title": "Gestión de Tarjetas Corporativas",
                    "payment2_desc": "Información sobre la gestión de su tarjeta de crédito corporativa, incluidas las políticas, los límites de gasto y los procedimientos de informes. Póngase en contacto con finanzas para nuevas solicitudes de tarjetas.",
                    "payment3_title": "Nómina y Beneficios",
                    "payment3_desc": "Acceda a sus recibos de pago, documentos fiscales e información de beneficios de forma segura. Los detalles sobre los ciclos de compensación y la inscripción en beneficios están disponibles aquí.",
                    "internal_gemini_title": "Pregunte a nuestro Asistente de IA",
                    "internal_gemini_desc": "Ingrese su consulta a continuación para obtener información instantánea. Para datos internos específicos de Fruitful, comuníquese con el departamento correspondiente.",
                    "internal_gemini_placeholder": "ej. ¿Cómo solicito tiempo libre?",
                    "internal_gemini_button": "✨ Obtener información",
                    "internal_gemini_result_placeholder": "Su respuesta aparecerá aquí...",

                    // Currency Converter translations (from global_payment_portal)
                    "currency_converter_title": "💱 Convertidor de Moneda Global",
                    "currency_converter_desc": "Convierta cualquier moneda a nivel mundial utilizando tipos de cambio en tiempo real. Tenga en cuenta que esta herramienta es solo para fines informativos y utiliza una API de terceros.",
                    "amount_placeholder": "Cantidad",
                    "convert_button": "Convertir",
                    "currency_result_placeholder": "La cantidad convertida aparecerá aquí...",
                    "error_fetch_currencies": "Error al obtener monedas. Vuelva a intentarlo más tarde.",
                    "error_conversion": "Error al realizar la conversión. Verifique su entrada y vuelva a intentarlo.",
                    "invalid_amount": "Ingrese una cantidad válida.",
                    "currency_not_found": "Datos de moneda no encontrados.",
                    "monthly_option_text": "Mensual",
                    "annual_option_text": "Anual (15% de descuento)",
                    "select_currency_label": "Mostrar precios en:"
                },
                fr: {
                    footerPrivacy: 'Confidentialité',
                    footerTerms: 'Conditions',
                    footerContact: 'Contact',
                    footerCopyrightLink: 'Droits d\'Auteur',
                    footerDevelopers: 'Développeurs',
                    footerVaultMeshLink: 'VaultMesh',
                    footerFruitfulLink: 'Fruitful',
                    footerFAAZoneLink: 'FAA.Zone',
                    footerAboutLink: 'À Propos',
                    footerAccessibility: 'Accessibilité',
                    footerCopyright: '© 2025 FAA™ Treaty System™. Tous droits réservés.',
                    footerPoweredBy: 'Propulsé par 🦍 glyphes + API du Coffre. Synchronisé avec Seedwave™.',
                    // MineNest specific translations (from global_payment_portal)
                    "minenest_page_title": "🚀 MineNest™ Protocole Central",
                    "minenest_page_description": "Un cadre puissant FAA.ZONE qui renforce le secteur ⛏️ Minier & Ressources avec une automatisation avancée et une gestion des données. Il se connecte sans effort à PulseGrid pour un flux de travail optimisé et la conformité.",
                    "features_title": "🎛️ MineNest™ Fonctionnalités Clés",
                    "starter_title": "⚙️ Nœud de Démarrage", "monthly_tag": "/mois", "annual_tag": "/an", "starter_desc": "Idéal pour les petites équipes et les projets pilotes. Accédez aux fonctionnalités essentielles et à la synchronisation de données de base sécurisée.", "starter_f1": "Fonctionnalités essentielles", "starter_f2": "Synchronisation de données de base", "starter_f3": "Support communautaire",
                    "pro_title": "🚀 Grille Pro", "pro_desc": "Conçu pour les entreprises en croissance ayant besoin de capacités avancées. Comprend 7 fonctionnalités principales et des performances améliorées.", "pro_f1": "Toutes les fonctionnalités de démarrage", "pro_f2": "Fonctionnalités avancées", "pro_f3": "Traitement de données à grand volume", "pro_f4": "Analyse étendue", "pro_f5": "Support prioritaire",
                    "enterprise_title": "🌐 Omni-Synchronisation Entreprise", "custom_price": "Personnalisé", "enterprise_desc": "Pour les grandes organisations nécessitant un accès complet à VaultMesh, des intégrations personnalisées et des ressources dédiées.", "enterprise_f1": "Toutes les fonctionnalités Pro", "enterprise_f2": "Accès complet à VaultMesh", "enterprise_f3": "Intégrations personnalisées", "enterprise_f4": "Gestion de compte dédiée", "enterprise_f5": "Support Premium 24/7",
                    "pricing_title": "💳 MineNest™ Structure Tarifaire",
                    "feature1_title": "Maille de Services Professionnels", "feature1_desc": "Intégration directe avec la Maille de Services Professionnels FAA 🧾 pour un flux de travail et une facturation fluides.",
                    "feature2_title": "Synchronisation Avancée des Données", "feature2_desc": "Synchronisation de données haute vitesse et fiable avec le sous-nœud <strong>NestTrack</strong> pour le suivi des actifs en temps réel.",
                    "feature3_title": "Conformité en Temps Réel", "feature3_desc": "Validation continue de la conformité via <strong>VaultLink™</strong>, spécifiquement adaptée aux réglementations strictes de l'industrie minière.",
                    "feature4_title": "Architecture Évolutive", "feature4_desc": "Infra structure robuste conçue pour une évolutivité massive, supportant jusqu'à x18 l'extension de nœuds.",
                    "feature5_title": "Analyse Prédictive", "feature5_desc": "Tirez parti de notre module d'analyse prédictive avancé pour prévoir les performances et les besoins de maintenance.",
                    "feature6_title": "Accès API Transparent", "feature6_desc": "Un accès API complet assure une interopérabilité transparente avec vos systèmes existants et les outils tiers.",
                    "gemini_title": "Découvrez MineNest™ pour votre Opération",
                    "gemini_desc": "Entrez votre type d'opération minière ci-dessous (par exemple, \"mine d'or souterraine\", \"opération de charbon à ciel ouvert\") pour voir un cas d'utilisation généré sur mesure de la façon dont MineNest™ peut vous être bénéfique.",
                    "gemini_placeholder": "ex. Mine de cuivre à ciel ouvert",
                    "gemini_button": "✨ Générer un cas d'utilisation",
                    "gemini_result_placeholder": "Votre cas d'utilisation personnalisé apparaîtra ici...",

                    // Internal Portal specific translations (from global_payment_portal)
                    "internal_page_title": "Bienvenue sur le Portail Global de Paiement et SSO Fruitful",
                    "internal_page_description": "Votre hub central pour un accès sécurisé aux ressources de l'entreprise et des informations de paiement rationalisées. Ce portail assure une expérience fluide pour tous les stagiaires, développeurs et le personnel.",
                    "sso_title": "🔐 Authentification Unique (SSO) Expliquée",
                    "sso1_title": "Sécurité Améliorée",
                    "sso1_desc": "Le SSO réduit la fatigue des mots de passe et renforce la sécurité en minimisant le nombre de justificatifs que vous devez gérer, rendant l'accès non autorisé plus difficile.",
                    "sso2_title": "Accès Simplifié",
                    "sso2_desc": "Accédez à toutes vos applications et services Fruitful avec un seul ensemble de justificatifs, ce qui vous fait gagner du temps et améliore l'efficacité de votre flux de travail quotidien.",
                    "sso3_title": "Intégration Simplifiée",
                    "sso3_desc": "Les nouveaux membres de l'équipe peuvent être opérationnels plus rapidement grâce à une configuration de compte simplifiée sur tous les systèmes internes nécessaires, réduisant ainsi le temps de configuration.",
                    "payment_title": "💰 Informations de Paiement Internes",
                    "payment1_title": "Remboursement des Dépenses",
                    "payment1_desc": "Soumettez et suivez vos dépenses professionnelles pour remboursement via notre portail financier intégré. Assurez-vous que tous les reçus sont joints pour un traitement rapide.",
                    "payment2_title": "Gestion des Cartes d'Entreprise",
                    "payment2_desc": "Informations sur la gestion de votre carte de crédit d'entreprise, y compris les politiques, les limites de dépenses et les procédures de rapport. Contactez les finances pour les nouvelles demandes de cartes.",
                    "payment3_title": "Paie et Avantages Sociaux",
                    "payment3_desc": "Accédez à vos fiches de paie, documents fiscaux et informations sur les avantages sociaux en toute sécurité. Les détails sur les cycles de rémunération et l'inscription aux avantages sont disponibles ici.",
                    "internal_gemini_title": "Demandez à notre Assistant IA",
                    "internal_gemini_desc": "Entrez votre requête ci-dessous pour obtenir des informations instantanées. Pour des données internes spécifiques à Fruitful, veuillez contacter le service concerné.",
                    "internal_gemini_placeholder": "ex. Comment demander un congé ?",
                    "internal_gemini_button": "✨ Obtenir des infos",
                    "internal_gemini_result_placeholder": "Votre réponse apparaîtra ici...",

                    // Currency Converter translations (from global_payment_portal)
                    "currency_converter_title": "💱 Convertisseur de Devises Global",
                    "currency_converter_desc": "Convertissez n'importe quelle devise dans le monde en utilisant des taux de change en temps réel. Veuillez noter que cet outil est uniquement à des fins d'information et utilise une API tierce.",
                    "amount_placeholder": "Montant",
                    "convert_button": "Convertir",
                    "currency_result_placeholder": "Le montant converti apparaîtra ici...",
                    "error_fetch_currencies": "Erreur lors de la récupération des devises. Veuillez réessayer plus tard.",
                    "error_conversion": "Erreur lors de la conversion. Veuillez vérifier votre saisie et réessayer.",
                    "invalid_amount": "Veuillez entrer un montant valide.",
                    "currency_not_found": "Données de devise introuvables.",
                    "monthly_option_text": "Mensuel",
                    "annual_option_text": "Annuel (15% de réduction)",
                    "select_currency_label": "Afficher les prix en:"
                },
                ar: {
                    footerPrivacy: 'الخصوصية',
                    footerTerms: 'الشروط',
                    footerContact: 'اتصل بنا',
                    footerCopyrightLink: 'حقوق النشر',
                    footerDevelopers: 'المطورون',
                    footerVaultMeshLink: 'شبكة الكهف',
                    footerFruitfulLink: 'مثمر',
                    footerFAAZoneLink: 'FAA.Zone',
                    footerAboutLink: 'حول',
                    footerAccessibility: 'إمكانية الوصول',
                    footerCopyright: '© 2025 نظام معاهدة FAA™. جميع الحقوق محفوظة.',
                    footerPoweredBy: 'مدعوم بواسطة 🦍 الرموز + واجهة برمجة تطبيقات Vault. متزامن مع Seedwave™.',
                    // MineNest specific translations (from global_payment_portal)
                    "minenest_page_title": "🚀 بروتوكول MineNest™ الأساسي",
                    "minenest_page_description": "إطار عمل FAA.ZONE قوي يمكّن قطاع ⛏️ التعدين والموارد من خلال الأتمتة المتقدمة وإدارة البيانات. يتصل بسهولة بـ PulseGrid لسير عمل محسّن والامتثال.",
                    "features_title": "🎛️ ميزات MineNest™ الرئيسية",
                    "starter_title": "⚙️ عقدة البدء", "monthly_tag": "/شهر", "annual_tag": "/سنة", "starter_desc": "مثالي للفرق الصغيرة والمشاريع التجريبية. الوصول إلى الميزات الأساسية ومزامنة البيانات الأساسية الآمنة.", "starter_f1": "ميزات أساسية", "starter_f2": "مزامنة بيانات أساسية", "starter_f3": "دعم المجتمع",
                    "pro_title": "🚀 شبكة برو", "pro_desc": "مصمم للشركات النامية التي تحتاج إلى إمكانيات متقدمة. يتضمن 7 ميزات أساسية وأداء محسن.", "pro_f1": "جميع ميزات البدء", "pro_f2": "ميزات متقدمة", "pro_f3": "معالجة بيانات عالية الحجم", "pro_f4": "تحليلات موسعة", "pro_f5": "دعم ذو أولوية",
                    "enterprise_title": "🌐 مزامنة أومني للمؤسسات", "custom_price": "مخصص", "enterprise_desc": "للمؤسسات الكبيرة التي تتطلب وصولاً كاملاً إلى VaultMesh، وتكاملات مخصصة، وموارد مخصصة.", "enterprise_f1": "جميع ميزات برو", "enterprise_f2": "وصول كامل إلى VaultMesh", "enterprise_f3": "تكاملات مخصصة", "enterprise_f4": "إدارة حساب مخصصة", "enterprise_f5": "دعم ممتاز 24/7",
                    "pricing_title": "💳 هيكل تسعير MineNest™",
                    "feature1_title": "شبكة الخدمات المهنية", "feature1_desc": "تكامل مباشر مع شبكة الخدمات المهنية FAA 🧾 لسير عمل سلس وفواتير.",
                    "feature2_title": "مزامنة البيانات المتقدمة", "feature2_2_desc": "مزامنة بيانات عالية السرعة وموثوقة مع العقدة الفرعية <strong>NestTrack</strong> لتتبع الأصول في الوقت الفعلي.",
                    "feature3_title": "الامتثال في الوقت الفعلي", "feature3_desc": "التحقق المستمر من الامتثال عبر <strong>VaultLink™</strong>، المصمم خصيصًا للوائح الصارمة لصناعة التعدين.",
                    "feature4_title": "هندسة معمارية قابلة للتوسع", "feature4_desc": "بنية تحتية قوية مصممة لقابلية التوسع الهائلة، تدعم ما يصل إلى 18 ضعفًا لتوسع العقدة.",
                    "feature5_title": "التحليلات التنبؤية", "feature5_desc": "استفد من وحدة التحليلات التنبؤية لدينا للتنبؤ بالأداء واحتياجات الصيانة.",
                    "feature6_title": "وصول API سلس", "feature6_desc": "يضمن الوصول الكامل إلى API قابلية التشغيل البيني السلس مع أنظمتك الحالية وأدوات الطرف الثالث.",
                    "gemini_title": "اكتشف MineNest™ لعمليتك",
                    "gemini_desc": "أدخل نوع عملية التعدين الخاصة بك أدناه (على سبيل المثال، \"منجم ذهب تحت الأرض\"، \"عملية فحم سطحية\") لرؤية حالة استخدام تم إنشاؤها خصيصًا لكيفية استفادة MineNest™ من عمليتك.",
                    "gemini_placeholder": "مثال: منجم نحاس مفتوح",
                    "gemini_button": "✨ إنشاء حالة استخدام",
                    "gemini_result_placeholder": "ستظهر حالة الاستخدام المخصصة لك هنا...",

                    // Internal Portal specific translations (from global_payment_portal)
                    "internal_page_title": "مرحبًا بكم في بوابة Fruitful العالمية للدفع وتسجيل الدخول الموحد (SSO)",
                    "internal_page_description": "مركزك المركزي للوصول الآمن إلى موارد الشركة ومعلومات الدفع المبسطة. تضمن هذه البوابة تجربة سلسة لجميع المتدربين والمطورين والموظفين.",
                    "sso_title": "🔐 شرح تسجيل الدخول الموحد (SSO)",
                    "sso1_title": "أمان محسن",
                    "sso1_desc": "يقلل تسجيل الدخول الموحد (SSO) من إرهاق كلمة المرور ويعزز الأمان عن طريق تقليل عدد بيانات الاعتماد التي تحتاج إلى إدارتها، مما يجعل الوصول غير المصرح به أكثر صعوبة.",
                    "sso2_title": "وصول مبسط",
                    "sso2_desc": "يمكنك الوصول إلى جميع تطبيقات وخدمات Fruitful الخاصة بك باستخدام مجموعة واحدة من بيانات الاعتماد، مما يوفر لك الوقت ويحسن كفاءة سير عملك اليومي.",
                    "sso3_title": "تأهيل مبسط",
                    "sso3_desc": "يمكن لأعضاء الفريق الجدد البدء في العمل بشكل أسرع من خلال إعداد حساب مبسط عبر جميع الأنظمة الداخلية الضرورية، مما يقلل من وقت الإعداد.",
                    "payment_title": "💰 معلومات الدفع الداخلية",
                    "payment1_title": "تعويض المصاريف",
                    "payment1_desc": "يمكنك إرسال وتتبع نفقات عملك لاستردادها من خلال بوابة التمويل المتكاملة الخاصة بنا. تأكد من إرفاق جميع الإيصالات للمعالجة السريعة.",
                    "payment2_title": "إدارة بطاقات الشركات",
                    "payment2_desc": "معلومات حول إدارة بطاقة الائتمان الخاصة بشركتك، بما في ذلك السياسات وحدود الإنفاق وإجراءات الإبلاغ. اتصل بالمالية لطلبات البطاقات الجديدة.",
                    "payment3_title": "كشوف المرتبات والمزايا",
                    "payment3_desc": "يمكنك الوصول إلى كشوف المرتبات والوثائق الضريبية ومعلومات المزايا الخاصة بك بأمان. تتوفر هنا تفاصيل حول دورات التعويض والتسجيل في المزايا.",
                    "internal_gemini_title": "اسأل مساعدنا الذكي",
                    "internal_gemini_desc": "أدخل استفسارك أدناه للحصول على معلومات فورية. للحصول على بيانات داخلية محددة لـ Fruitful، يرجى الاتصال بالقسم المختص.",
                    "internal_gemini_placeholder": "مثال: كيف أطلب إجازة؟",
                    "internal_gemini_button": "✨ الحصول على معلومات",
                    "internal_gemini_result_placeholder": "ستظهر إجابتك هنا...",

                    // Currency Converter translations (from global_payment_portal)
                    "currency_converter_title": "💱 محول العملات العالمي",
                    "currency_converter_desc": "حوّل أي عملة عالميًا باستخدام أسعار الصرف في الوقت الفعلي. يرجى ملاحظة أن هذه الأداة مخصصة لأغراض إعلامية فقط وتستخدم واجهة برمجة تطبيقات (API) تابعة لجهة خارجية.",
                    "amount_placeholder": "المبلغ",
                    "convert_button": "تحويل",
                    "currency_result_placeholder": "سيظهر المبلغ المحول هنا...",
                    "error_fetch_currencies": "خطأ في جلب العملات. يرجى المحاولة مرة أخرى لاحقًا.",
                    "error_conversion": "خطأ في إجراء التحويل. يرجى التحقق من إدخالك والمحاولة مرة أخرى.",
                    "invalid_amount": "الرجاء إدخال مبلغ صالح.",
                    "currency_not_found": "لم يتم العثور على بيانات العملة.",
                    "monthly_option_text": "شهري",
                    "annual_option_text": "سنوي (خصم 15%)",
                    "select_currency_label": "عرض الأسعار بـ:"
                },
                zh: {
                    footerPrivacy: '隐私',
                    footerTerms: '条款',
                    footerContact: '联系',
                    footerCopyrightLink: '版权',
                    footerDevelopers: '开发者',
                    footerVaultMeshLink: '金库网格',
                    footerFruitfulLink: '丰硕',
                    footerFAAZoneLink: 'FAA.Zone',
                    footerAboutLink: '关于',
                    footerAccessibility: '无障碍',
                    footerCopyright: '© 2025 FAA™ 条约系统™。保留所有权利。',
                    footerPoweredBy: '由 🦍 符文 + 金库 API 提供支持。与 Seedwave™ 同步。',
                    // MineNest specific translations (from global_payment_portal)
                    "minenest_page_title": "🚀 MineNest™ 核心协议",
                    "minenest_page_description": "一个功能强大的FAA.ZONE框架，为⛏️采矿与资源领域提供先进的自动化和数据管理支持。它可轻松连接到PulseGrid，以优化工作流程和合规性。",
                    "features_title": "🎛️ MineNest™ 主要特点",
                    "starter_title": "⚙️ 入门节点", "monthly_tag": "/月", "annual_tag": "/年", "starter_desc": "适用于小型团队和试点项目。访问基本功能并确保基本数据同步。", "starter_f1": "基本功能", "starter_f2": "基本数据同步", "starter_f3": "社区支持",
                    "pro_title": "🚀 专业网格", "pro_desc": "专为需要高级功能的成长型公司设计。包括7个核心功能和增强性能。", "pro_f1": "所有入门功能", "pro_f2": "高级功能", "pro_f3": "高容量数据处理", "pro_f4": "扩展分析", "pro_f5": "优先支持",
                    "enterprise_title": "🌐 企业全同步", "custom_price": "定制", "enterprise_desc": "适用于需要完整VaultMesh访问、自定义集成和专用资源的大型组织。", "enterprise_f1": "所有专业功能", "enterprise_f2": "完整VaultMesh访问", "enterprise_f3": "自定义集成", "enterprise_f4": "专用客户管理", "enterprise_f5": "24/7高级支持",
                    "pricing_title": "💳 MineNest™ 定价结构",
                    "feature1_title": "专业服务网格", "feature1_desc": "与FAA 🧾 专业服务网格直接集成，实现无缝工作流程和计费。",
                    "feature2_title": "高级数据同步", "feature2_desc": "通过<strong>NestTrack</strong>子节点实现高速、可靠的数据同步，用于实时资产跟踪。",
                    "feature3_title": "实时合规性", "feature3_desc": "通过<strong>VaultLink™</strong>持续进行合规性验证，专为采矿行业严格的法规量身定制。",
                    "feature4_title": "可扩展架构", "feature4_desc": "专为大规模可扩展性设计的强大基础设施，支持多达18个节点的扩展。",
                    "feature5_title": "预测分析", "feature5_desc": "利用我们先进的预测分析模块，预测性能和维护需求。",
                    "feature6_title": "无缝API访问", "feature6_desc": "完整的API访问确保与您现有系统和第三方工具的无缝互操作性。",
                    "gemini_title": "为您的运营发现 MineNest™",
                    "gemini_desc": "在下方输入您的采矿运营类型（例如：“地下金矿”、“地表煤矿”）以查看MineNest™如何使您的运营受益的定制用例。",
                    "gemini_placeholder": "例如：露天铜矿",
                    "gemini_button": "✨ 生成用例",
                    "gemini_result_placeholder": "您的个性化用例将显示在此处...",
                    // Internal Portal specific translations (from global_payment_portal)
                    "internal_page_title": "欢迎来到 Fruitful 全球支付与单点登录门户",
                    "internal_page_description": "您安全访问公司资源和简化支付信息的中心枢纽。此门户可确保所有实习生、开发人员和员工获得无缝体验。",
                    "sso_title": "🔐 单点登录 (SSO) 解释",
                    "sso1_title": "增强安全性",
                    "sso1_desc": "SSO 减少了密码疲劳，并通过最小化您需要管理的凭据数量来增强安全性，从而使未经授权的访问变得更加困难。",
                    "sso2_title": "简化访问",
                    "sso2_desc": "使用一组凭据即可访问所有 Fruitful 应用程序和服务，从而节省您的时间并提高日常工作流程效率。",
                    "sso3_title": "简化入职流程",
                    "sso3_desc": "新团队成员可以通过简化所有必要内部系统的帐户设置来更快地启动和运行，从而减少设置时间。",
                    "payment_title": "💰 内部支付信息",
                    "payment1_title": "费用报销",
                    "payment1_desc": "通过我们的集成财务门户提交和跟踪您的业务费用以进行报销。请确保附上所有收据以加快处理速度。",
                    "payment2_title": "公司卡管理",
                    "payment2_desc": "有关管理公司信用卡的详细信息，包括政策、支出限额和报告程序。请联系财务部门申请新卡。",
                    "payment3_title": "工资与福利",
                    "payment3_desc": "安全访问您的工资单、税务文件和福利信息。此处提供有关薪酬周期和福利注册的详细信息。",
                    "internal_gemini_title": "询问我们的 AI 助手",
                    "internal_gemini_desc": "在下方输入您的查询以获取即时信息。有关 Fruitful 特定内部数据，请联系相关部门。",
                    "internal_gemini_placeholder": "例如：如何请假？",
                    "internal_gemini_button": "✨ 获取信息",
                    "internal_gemini_result_placeholder": "您的答案将显示在此处...",
                    // Currency Converter translations (from global_payment_portal)
                    "currency_converter_title": "💱 全球货币转换器",
                    "currency_converter_desc": "使用实时汇率在全球范围内转换任何货币。请注意，此工具仅供参考，并使用第三方 API。",
                    "amount_placeholder": "金额",
                    "convert_button": "转换",
                    "currency_result_placeholder": "转换后的金额将显示在此处...",
                    "error_fetch_currencies": "获取货币时出错。请稍后再试。",
                    "error_conversion": "执行转换时出错。请检查您的输入并重试。",
                    "invalid_amount": "请输入有效金额。",
                    "currency_not_found": "未找到货币数据。",
                    "monthly_option_text": "每月",
                    "annual_option_text": "每年（85折）",
                    "select_currency_label": "显示价格为："
                }
            };

            // Language toggle for footer
            const languageToggle = document.getElementById('language-toggle'); 
            const savedLang = localStorage.getItem('language') || 'en';
            if (languageToggle) languageToggle.value = savedLang;
            updateFooterLanguage(savedLang);

            if (languageToggle) {
                languageToggle.addEventListener('change', (event) => {
                    const newLang = event.target.value;
                    localStorage.setItem('language', newLang);
                    updateFooterLanguage(newLang);
                });
            }

            function updateFooterLanguage(lang) {
                const footerElements = document.querySelectorAll('footer [data-i18n]');
                footerElements.forEach(el => {
                    const key = el.getAttribute('data-i18n');
                    // Add a more robust check to ensure language data and key exist
                    if (window.languageData && window.languageData[lang] && window.languageData[lang][key]) {
                        el.innerHTML = window.languageData[lang][key];
                    } else {
                        /* Fallback to English if the specific language or key is missing */
                        console.warn(`Translation key '${key}' not found for language '${lang}'. Falling back to English.`);
                        if (window.languageData.en && window.languageData.en[key]) {
                            el.innerHTML = window.languageData.en[key];
                        } else {
                            console.error(`Critical: English translation for key '${key}' also missing!`);
                        }
                    }
                });
            }

            // --- START Global Payment Portal Specific JavaScript ---
            let exchangeRates = {}; // To store fetched exchange rates
            let selectedPricingCurrency = 'USD'; // Default pricing currency
            let isAnnualPricing = false; // Default to monthly pricing

            const CURRENCY_API_KEY = '40015d117bc7fff9495dcf28'; // Provided API Key
            const BASE_CURRENCY_API_URL = `https://v6.exchangerate-api.com/v6/${CURRENCY_API_KEY}`;

            /**
             * Renders the pricing cards dynamically into the DOM based on selected currency and term.
             * Includes logic for PayPal hosted buttons.
             * @param {string} currentLang - The currently active language code.
             */
            const renderPricingCards = (currentLang) => {
                // Target the MineNest pricing grid specifically
                const pricingGrid = document.querySelector('#minenest-pricing .pricing-grid');
                if (!pricingGrid) return; // Ensure pricing grid exists before trying to render

                pricingGrid.innerHTML = ''; // Clear existing cards before re-rendering

                // Define pricing plans with their details and PayPal Hosted Button IDs
                // Base prices are in USD
                const plans = [
                    { id: 'starter-monthly', type: 'starter-card', titleKey: 'starter_title', basePriceUSD: 83, paypalId: '9KZH38XFK3TX2' },
                    { id: 'pro-monthly', type: 'pro-card', titleKey: 'pro_title', basePriceUSD: 230, paypalId: 'FNGGP5UJ9VYHQ' },
                    { id: 'enterprise-monthly', type: 'enterprise-card', titleKey: 'enterprise_title', basePriceUSD: null, priceKey: 'custom_price', paypalId: 'AL5VLUCCEW586' } // basePriceUSD is null for custom
                ];
                
                const exchangeRate = exchangeRates[selectedPricingCurrency] || 1; // Default to 1 if rate not found (i.e., USD)

                plans.forEach(plan => {
                    const card = document.createElement('div');
                    card.className = `pricing-card ${plan.type}`;
                    
                    // Calculate price based on term and currency
                    let displayPrice = '';
                    let priceDescriptionKey = plan.titleKey.replace('_title', '_desc'); // Always use the base description key
                    let priceTerm = '';

                    if (plan.basePriceUSD !== null) {
                        let calculatedPrice = plan.basePriceUSD;
                        priceTerm = window.languageData[currentLang][isAnnualPricing ? 'annual_tag' : 'monthly_tag'] || window.languageData.en[isAnnualPricing ? 'annual_tag' : 'monthly_tag'];

                        if (isAnnualPricing) {
                            calculatedPrice = (plan.basePriceUSD * 12) * 0.85; // 15% off annually
                        }
                        calculatedPrice *= exchangeRate;
                        displayPrice = `${selectedPricingCurrency} ${calculatedPrice.toFixed(2)}`;
                    } else {
                        displayPrice = window.languageData[currentLang][plan.priceKey] || window.languageData.en[plan.priceKey];
                        priceTerm = ''; // No term for custom price
                    }

                    // Build feature list HTML
                    let featureList = '';
                    // Features are hardcoded in English as they are not dynamic per plan in translations object
                    const featuresMap = {
                        'starter_title': ['Essential features', 'Basic data sync', 'Community support'],
                        'pro_title': ['All Starter Features', 'Advanced features', 'High-volume data processing', 'Expanded analytics', 'Priority support'],
                        'enterprise_title': ['All Pro Features', 'Full VaultMesh access', 'Custom integrations', 'Dedicated account management', '24/7 Premium Support']
                    };
                    const planFeatures = featuresMap[plan.titleKey] || [];
                    planFeatures.forEach(featureText => {
                        // Find the translation for the feature text, or use English directly
                        const translatedFeature = Object.values(window.languageData[currentLang]).find(val => val === featureText) || featureText;
                        featureList += `<li><i class="fas fa-check-circle"></i><span>${translatedFeature}</span></li>`;
                    });


                    card.innerHTML = `
                        <div>
                            <h3>${window.languageData[currentLang][plan.titleKey] || window.languageData.en[currentLang][plan.titleKey]}</h3>
                            <p class="price">${displayPrice}<span class="text-lg font-medium">${priceTerm}</span></p>
                            <p class="price-description">${window.languageData[currentLang][priceDescriptionKey] || window.languageData.en[currentLang][priceDescriptionKey]}</p>
                            <ul>${featureList}</ul>
                        </div>
                        <div class="paypal-button-container" id="paypal-${plan.id}"></div>
                    `;
                    pricingGrid.appendChild(card);

                    // Only render PayPal Hosted Buttons if paypal object is defined and it's not the custom price plan
                    if (plan.basePriceUSD !== null) { // Only for plans with a defined base price
                        // Use a timeout to give PayPal SDK time to load and initialize
                        setTimeout(() => {
                            if (typeof paypal !== 'undefined' && paypal.HostedButtons) {
                                try {
                                    paypal.HostedButtons({ hostedButtonId: plan.paypalId }).render(`#paypal-${plan.id}`);
                                } catch (error) {
                                    console.error(`Error rendering PayPal button for ${plan.id}:`, error);
                                    // Fallback to a direct link if SDK rendering fails in live environment
                                    document.getElementById(`paypal-${plan.id}`).innerHTML = `
                                        <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${plan.paypalId}" target="_blank" rel="noopener noreferrer" class="w-full text-center bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors block">Buy Now (Direct)</a>
                                    `;
                                }
                            } else {
                                // Fallback to a direct link if SDK not available after timeout
                                document.getElementById(`paypal-${plan.id}`).innerHTML = `
                                    <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${plan.paypalId}" target="_blank" rel="noopener noreferrer" class="w-full text-center bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors block">Buy Now (Direct)</a>
                                `;
                            }
                        }, 1000); // Increased timeout to 1 second
                    } else {
                        document.getElementById(`paypal-${plan.id}`).innerHTML = `<a href="#" class="w-full text-center bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors block">Contact Sales</a>`;
                    }
                });
            };

            // Function to fetch and populate currency dropdowns and exchange rates
            async function populateCurrenciesAndRates() {
                try {
                    // Fetch supported currency codes
                    const codesResponse = await fetch(`${BASE_CURRENCY_API_URL}/codes`);
                    const codesData = await codesResponse.json();

                    if (codesData.result === 'success' && codesData.supported_codes) {
                        const currencies = codesData.supported_codes;
                        const fromCurrencySelect = document.getElementById('from-currency-select');
                        const toCurrencySelect = document.getElementById('to-currency-select');
                        const pricingCurrencySelect = document.getElementById('pricing-currency-select');

                        // Clear existing options before populating
                        fromCurrencySelect.innerHTML = '';
                        toCurrencySelect.innerHTML = '';
                        pricingCurrencySelect.innerHTML = '';

                        currencies.forEach(currency => {
                            const [code, name] = currency;
                            // For general converter
                            const optionFrom = document.createElement('option');
                            optionFrom.value = code;
                            optionFrom.textContent = `${code} - ${name}`;
                            fromCurrencySelect.appendChild(optionFrom);

                            const optionTo = document.createElement('option');
                            optionTo.value = code;
                            optionTo.textContent = `${code} - ${name}`;
                            toCurrencySelect.appendChild(optionTo);

                            // For pricing currency selector
                            const optionPricing = document.createElement('option');
                            optionPricing.value = code;
                            optionPricing.textContent = `${code} - ${name}`;
                            pricingCurrencySelect.appendChild(optionPricing);
                        });

                        // Set default selected currencies
                        fromCurrencySelect.value = 'USD';
                        toCurrencySelect.value = 'EUR';
                        pricingCurrencySelect.value = 'USD'; // Default for pricing

                        // Fetch latest exchange rates with USD as base
                        const ratesResponse = await fetch(`${BASE_CURRENCY_API_URL}/latest/USD`);
                        const ratesData = await ratesResponse.json();

                        if (ratesData.result === 'success' && ratesData.conversion_rates) {
                            exchangeRates = ratesData.conversion_rates;
                            updatePricingDisplay(); // Initial render of pricing cards with default currency
                        } else {
                            console.error("Currency API Error (rates):", ratesData);
                            // Fallback for pricing display if rates cannot be fetched
                            updatePricingDisplay(); 
                        }

                    } else {
                        console.error("Currency API Error (codes):", codesData);
                    }
                } catch (error) {
                    console.error("Fetch Currencies and Rates Error:", error);
                }
            }

            // Function to update pricing display based on selected currency and term
            const updatePricingDisplay = () => {
                const currentLang = localStorage.getItem('language') || 'en'; // Use main portal's language
                renderPricingCards(currentLang);
            };

            // Internal Gemini API Logic for Global Payment section
            const initializeGlobalPaymentGemini = () => {
                const internalGeminiButton = document.getElementById('internal-gemini-button');
                const internalGeminiInput = document.getElementById('internal-gemini-input');
                const internalGeminiResultText = document.getElementById('internal-gemini-result-text');

                if (internalGeminiButton) {
                    internalGeminiButton.addEventListener('click', async () => {
                        const userQuery = internalGeminiInput.value.trim();
                        if (!userQuery) {
                            internalGeminiResultText.textContent = window.languageData[localStorage.getItem('language') || 'en'].internal_gemini_placeholder;
                            return;
                        }

                        internalGeminiResultText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'; // Show loading indicator
                        internalGeminiButton.disabled = true; // Disable button during generation

                        // Construct the prompt for the Gemini API, now focused on internal Fruitful operations
                        const prompt = `You are an internal knowledge base assistant for Fruitful Inc. Employees (interns, developers, staff) are using this portal. They might ask questions about company policies, internal processes, or general information. Answer the following query concisely and professionally, drawing on common company knowledge: "${userQuery}". If the query is unclear or requires specific Fruitful internal data you don't have, politely state that you cannot answer it and suggest contacting HR or the relevant department.`;

                        try {
                            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                            const payload = { contents: chatHistory };
                            const apiKey = ""; // API key is automatically provided by the Canvas environment
                            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });

                            const result = await response.json();
                            // Check for valid response structure from Gemini API
                            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                                internalGeminiResultText.textContent = result.candidates[0].content.parts[0].text;
                            } else {
                                internalGeminiResultText.textContent = 'Sorry, I could not generate an answer at this time. Please try again or contact IT support.';
                                console.error("Gemini API Error: Unexpected response structure", result);
                            }
                        } catch (error) {
                            internalGeminiResultText.textContent = 'An error occurred while connecting to the AI. Please check your connection and try again.';
                            console.error("Fetch Error:", error);
                        } finally {
                            internalGeminiButton.disabled = false; // Re-enable button
                        }
                    });
                }
            };

            // MineNest Gemini API Logic for Global Payment section
            const initializeMineNestGemini = () => {
                const minenestGeminiButton = document.getElementById('minenest-gemini-button');
                const minenestGeminiInput = document.getElementById('minenest-gemini-input');
                const minenestGeminiResultText = document.getElementById('minenest-gemini-result-text');

                if (minenestGeminiButton) {
                    minenestGeminiButton.addEventListener('click', async () => {
                        const userQuery = minenestGeminiInput.value.trim();
                        if (!userQuery) {
                            minenestGeminiResultText.textContent = window.languageData[localStorage.getItem('language') || 'en'].gemini_placeholder;
                            return;
                        }

                        minenestGeminiResultText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...'; // Show loading indicator
                        minenestGeminiButton.disabled = true; // Disable button during generation

                        // Construct the prompt for the Gemini API, focused on MineNest use cases
                        const prompt = `You are a marketing expert for a high-tech mining software called MineNest™. MineNest™ offers features like Professional Services Mesh integration, Advanced Data Sync with NestTrack, Real-time Compliance with VaultLink™, Scalable Architecture, Predictive Analytics, and Seamless API Access. A potential customer runs a "${userQuery}" operation. Generate a compelling, paragraph-long use case explaining how MineNest™ would specifically benefit their operation. Highlight 2-3 key features that would be most impactful for them. The tone should be professional and benefit-oriented.`;

                        try {
                            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                            const payload = { contents: chatHistory };
                            const apiKey = ""; // API key is automatically provided by the Canvas environment
                            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(payload)
                            });

                            const result = await response.json();
                            // Check for valid response structure from Gemini API
                            if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
                                minenestGeminiResultText.textContent = result.candidates[0].content.parts[0].text;
                            } else {
                                minenestGeminiResultText.textContent = 'Sorry, we could not generate a use case at this time. Please try again.';
                                console.error("Gemini API Error: Unexpected response structure", result);
                            }
                        } catch (error) {
                            minenestGeminiResultText.textContent = 'An error occurred while connecting to the AI. Please check your connection and try again.';
                            console.error("Fetch Error:", error);
                        } finally {
                            minenestGeminiButton.disabled = false; // Re-enable button
                        }
                    });
                }
            };

            // Currency Converter Logic (for the dedicated converter section)
            async function convertCurrency() {
                const amountInput = document.getElementById('amount-input');
                const fromCurrencySelect = document.getElementById('from-currency-select');
                const toCurrencySelect = document.getElementById('to-currency-select');
                const convertButton = document.getElementById('convert-button');
                const convertedResultText = document.getElementById('converted-result-text');

                const amount = parseFloat(amountInput.value);
                const fromCurrency = fromCurrencySelect.value;
                const toCurrency = toCurrencySelect.value;

                if (isNaN(amount) || amount <= 0) {
                    convertedResultText.textContent = window.languageData[localStorage.getItem('language') || 'en'].invalid_amount;
                    return;
                }

                convertedResultText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Converting...';
                convertButton.disabled = true;

                try {
                    const response = await fetch(`${BASE_CURRENCY_API_URL}/pair/${fromCurrency}/${toCurrency}/${amount}`);
                    const data = await response.json();

                    if (data.result === 'success' && data.conversion_result !== undefined) {
                        convertedResultText.textContent = `${amount} ${fromCurrency} = ${data.conversion_result.toFixed(2)} ${toCurrency}`;
                    } else {
                        convertedResultText.textContent = window.languageData[localStorage.getItem('language') || 'en'].error_conversion;
                        console.error("Conversion API Error:", data);
                    }
                } catch (error) {
                    convertedResultText.textContent = window.languageData[localStorage.getItem('language') || 'en'].error_conversion;
                    console.error("Convert Currency Fetch Error:", error);
                } finally {
                    convertButton.disabled = false;
                }
            }

            // Function to initialize all event listeners and data for the Global Payment section
            function initializeGlobalPaymentSectionLogic() {
                // Dynamically load PayPal SDK
                if (typeof paypal === 'undefined' || !paypal.HostedButtons) {
                    const paypalScript = document.createElement('script');
                    paypalScript.src = "https://www.paypal.com/sdk/js?client-id=BAAGdPecRsf6dw_nIrWqUen0GdW0UsBZapp1Gn62xkPdD-Vqc-4lqWAidKK8LOObXux8pHJGjXknZoar6Q&components=hosted-buttons&disable-funding=venmo&currency=USD";
                    paypalScript.onload = () => {
                        console.log("PayPal SDK loaded dynamically.");
                        // Now that SDK is loaded, attach event listeners and render buttons
                        attachGlobalPaymentListeners();
                    };
                    paypalScript.onerror = (e) => {
                        console.error("Failed to load PayPal SDK:", e);
                        // Fallback logic if SDK fails to load
                        document.querySelectorAll('.paypal-button-container').forEach(container => {
                            const hostedButtonId = container.id.replace('paypal-', '');
                            container.innerHTML = `<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${hostedButtonId}" target="_blank" rel="noopener noreferrer" class="w-full text-center bg-blue-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors block">Buy Now (Direct)</a>`;
                        });
                    };
                    document.head.appendChild(paypalScript); // Append to head
                } else {
                    // If PayPal SDK is already loaded, just attach listeners
                    attachGlobalPaymentListeners();
                }
            }

            // Helper function to attach listeners and render buttons after PayPal SDK is ready
            function attachGlobalPaymentListeners() {
                // Ensure elements exist before attaching listeners
                const monthlyToggleBtn = document.getElementById('monthly-toggle');
                const annualToggleBtn = document.getElementById('annual-toggle');
                const pricingCurrencySelect = document.getElementById('pricing-currency-select');
                const convertButton = document.getElementById('convert-button');

                if (monthlyToggleBtn) {
                    monthlyToggleBtn.addEventListener('click', () => {
                        isAnnualPricing = false;
                        monthlyToggleBtn.classList.add('active');
                        annualToggleBtn.classList.remove('active');
                        updatePricingDisplay();
                    });
                }

                if (annualToggleBtn) {
                    annualToggleBtn.addEventListener('click', () => {
                        isAnnualPricing = true;
                        annualToggleBtn.classList.add('active');
                        monthlyToggleBtn.classList.remove('active');
                        updatePricingDisplay();
                    });
                }

                if (pricingCurrencySelect) {
                    pricingCurrencySelect.addEventListener('change', (e) => {
                        selectedPricingCurrency = e.target.value;
                        updatePricingDisplay();
                    });
                }
                
                if (convertButton) {
                    convertButton.addEventListener('click', convertCurrency);
                }

                // Call initial population and Gemini initializations
                populateCurrenciesAndRates();
                initializeGlobalPaymentGemini();
                initializeMineNestGemini();
            }
            // --- END Global Payment Portal Specific JavaScript ---

            // --- START Interns Admin Portal Specific JavaScript ---
            function initializeInternsAdminPortalLogic() {
                // Add event listeners for the copy code buttons in this section
                document.querySelectorAll('#internsAdminPortalSection .code-block-container .copy-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        window.copyToClipboard(event.target);
                    });
                });
            }
            // --- END Interns Admin Portal Specific JavaScript ---

            // --- START Legal Index Specific JavaScript ---
            const legalDocumentsData = [
                { icon: '🌱', title: 'Agriculture & Biotech PayPal Integration Manual', description: 'Comprehensive guide for PayPal integration within the AgroChain™ framework, covering product offerings and payment processing.', link: '/legal/agriculture-biotech_paypal.html' },
                { icon: '🦊', title: 'Foxed Has Mobiles™ Global Launch & Dev Manual', description: 'Minutes of meeting and development guide for the Foxed Has Mobiles™ project, including visual identities and technical specifications.', link: '/legal/foxed_got_mobiles_setup.html' },
                { icon: '🐑', title: 'Sheep Document: Concentric Borders & Noodle Mountain', description: 'An artistic and technical exploration of concentric borders, Noodle Mountain concepts, and the integration of dynamic visual elements.', link: '/legal/sheep.html' },
                { icon: '🌐', title: 'Global Brands Setup', description: 'Detailed instructions for setting up and configuring new global brands within the Seedwave™ framework.', link: '/seedwave/global_brands_setup.html' },
                { icon: '🎶', title: 'Spotify Integration Setup and Training Manual', description: 'Comprehensive manual for setting up and understanding the Spotify integration within Seedwave™, including OAuth 2.0 security considerations.', link: '/legal/spotify_intergration.html' },
                { icon: '🎧', title: 'Fruitful.Music™ Launch Concept - Integrated Manual & App', description: 'An interactive demonstration and manual showcasing the Fruitful.Music™ platform\'s design, features, and integration of music with aura concepts.', link: '/legal/fruitful_music_spotify.html' },
                { icon: '📚', title: 'Fruitful™ & Seedwave™ Deployment Manual', description: 'Comprehensive guide detailing the design philosophy, visual specifications, Git workflow, file structure, and Node packing strategies for the Fruitful™ & Seedwave™ Global Portal.', link: 'fruitful_seedwave_deployment_manual.html' },
                { icon: '📊', title: 'Xero Integration Setup Minutes', description: 'Detailed setup and troubleshooting for Xero OAuth 2.0 integration with the Seedwave Admin Panel.', link: '/legal/xero_integration_minutes.html' },
                { icon: '🔥', title: 'Firebase Core Setup Minutes', description: 'Minutes documenting the foundational Firebase project setup: Authentication, Cloud Firestore, and Google Analytics.', link: '/legal/firebase_core_minutes.html' },
                { icon: '🚀', title: 'Firebase Scalable Admin Panel (7000 Sites)', description: 'Comprehensive guide for setting up scalable Firebase Authentication, Firestore, and Hosting for a large-scale (7000 sites) admin panel.', link: '/legal/firebase_scale_7000_minutes.html' },
                { icon: '📜', title: 'Fruitful™ Holdings NDA', description: 'Standard Non-Disclosure Agreement for collaborations with Fruitful™ Holdings.', link: '/legal/fruitful_holdings_nda.pdf' },
                { icon: '✍️', title: 'Secure Sign Application', description: 'Portal for securely submitting comprehensive NDA applications with Atom-Level Verification™ Protocols.', link: '/legal/securesign.html' },
                { icon: '💳', title: 'PayPal Subscriptions Setup Manual', description: 'Detailed guide for configuring and deploying PayPal subscription payments within the FAA.ZONE™ Admin Portal.', link: '/legal/paypal_setup.html' },
                { icon: '⚙️', title: 'FAA™ Seedwave Admin Portal Setup Manual', description: 'Comprehensive blueprint for setting up the central Seedwave Admin Portal, detailing serverless architecture and Zoho OAuth integration.', link: '/legal/seedwave.html' },
                { icon: '📖', title: 'NDA SecureSign Portal Setup Manual (Page 1)', description: 'Guide for installing and configuring the local Node.js server for the SecureSign NDA portal.', link: '/legal/setup.html' },
                { icon: '📄', title: 'Setup Guide (Page 2)', description: 'Part 2 of the comprehensive setup instructions for FAA.ZONE systems. (Placeholder)', link: '/legal/setup2.html' },
                { icon: '📃', title: 'Setup Guide (Page 3)', description: 'Part 3 of the comprehensive setup instructions for FAA.ZONE systems. (Placeholder)', link: '/legal/setup3.html' },
                { icon: '📜', title: 'Setup Guide (Page 4)', description: 'Part 4 of the comprehensive setup instructions for FAA.ZONE systems. (Placeholder)', link: '/legal/setup4.html' },
                { icon: '📑', title: 'Setup Guide (Page 5)', description: 'Part 5 of the comprehensive setup instructions for FAA.ZONE systems. (Placeholder)', link: '/legal/setup5.html' },
                { icon: '🇺🇸', title: 'USA Information', description: 'General information pertinent to USA operations and legalities within the FAA.ZONE™ ecosystem.', link: '/legal/usa.html' },
                { icon: '🗺️', title: 'Setup USA Guide', description: 'Specific setup instructions and guidelines for USA-based FAA.ZONE™ operations. (Placeholder)', link: '/legal/setupusa.html' },
                { icon: '🌳', title: 'Baobab Security Network™ Business Package README', description: 'Overview of The Baobab Security Network™ Business Package, including conceptual model and usage instructions.', link: '/legal/baobab.html' },
                { icon: '💰', title: 'King Price™ Pricing & Plans', description: 'Information regarding King Price insurance pricing and various plans offered by the FAA.ZONE™ partner.', link: '/legal/pricing.html' },
                { icon: '📊', title: 'Index Transdata', description: 'A reference document for data transformation and indexing within the FAA.ZONE™ Transdata framework. (Placeholder)', link: '/legal/index_transdata.html' },
            ];

            function renderLegalDocuments() {
                const legalDocumentsContainer = document.getElementById('legalDocumentsContainer');
                if (!legalDocumentsContainer) return;

                legalDocumentsContainer.innerHTML = ''; // Clear existing content

                legalDocumentsData.forEach(doc => {
                    const docItem = document.createElement('div');
                    docItem.className = 'document-item';
                    docItem.innerHTML = `
                        <div class="icon">${doc.icon}</div>
                        <div class="document-item-content">
                            <h3>${doc.title}</h3>
                            <p>${doc.description}</p>
                            <a href="${doc.link}" target="_blank">
                                View Document
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    `;
                    legalDocumentsContainer.appendChild(docItem);
                });
            }
            // --- END Legal Index Specific JavaScript ---
        });