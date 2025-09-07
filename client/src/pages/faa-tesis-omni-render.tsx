import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Brain, Lightbulb, Globe, Users, Zap, TreePine } from "lucide-react";

// FAA™ Tesis Omni Render - Complete document structure in Afrikaans with English translations
const tesisContent = {
  metadata: {
    title: "FAA™ Tesis Omni Render",
    documentId: "FAA-PLH-SHL-0905-AX13",
    author: "Heyns Schoeman ™",
    ecosystem: "BANIMAL LOOP™ · Fruitful Global™ · Baobab™",
    language: "Afrikaans (with English translations)"
  },
  chapters: {
    "Hoofstuk 1: Inleiding": {
      titleEn: "Chapter 1: Introduction",
      icon: <BookOpen className="h-5 w-5" />,
      content: {
        af: `Die FAA™ Omni Render begin soos 'n dop — 'n placeholder van potensiaal. Hierdie dop is nie leeg nie; dit is gevul met spoor, toekoms, en ruimte vir groei.`,
        en: "The FAA™ Omni Render begins like a shell — a placeholder of potential. This shell is not empty; it is filled with trace, future, and space for growth.",
        details: {
          af: [
            "Doel van die navorsing: Om 'n raamwerk te bied wat aktuariële intelligensie, ekosisteem-ontwerp en planetêre volhoubaarheid in een kernstruktuur saamsnoer.",
            "Simboliek van die dop: Soos 'n saad wag dit om te ontkiem, net op die regte tyd, binne die regte omgewing."
          ],
          en: [
            "Purpose of the research: To provide a framework that combines actuarial intelligence, ecosystem design and planetary sustainability in one core structure.",
            "Symbolism of the shell: Like a seed waiting to germinate, just at the right time, within the right environment."
          ]
        }
      }
    },
    "Hoofstuk 2: Teoretiese Grondslag": {
      titleEn: "Chapter 2: Theoretical Foundation",
      icon: <Brain className="h-5 w-5" />,
      content: {
        af: "Quantum AI en Atom-Level™ Risk Models: die berekeningskern. Baobab Lifecycle Simulations™: 'n natuurlike siklus-model wat risiko, groei en sterkte in elke fase meet.",
        en: "Quantum AI and Atom-Level™ Risk Models: the computational core. Baobab Lifecycle Simulations™: a natural cycle model that measures risk, growth and strength in each phase.",
        subsections: {
          "Akademiese basis": {
            titleEn: "Academic Foundation",
            items: [
              "Quantum AI en Atom-Level™ Risk Models / Quantum AI and Atom-Level™ Risk Models",
              "Baobab Lifecycle Simulations™ / Baobab Lifecycle Simulations™"
            ]
          },
          "Filosofiese basis": {
            titleEn: "Philosophical Foundation", 
            items: [
              "Die Baobab™ as simbool van langlewendheid / The Baobab™ as symbol of longevity",
              "Die VaultMesh™ as digitale wortelstelsel / The VaultMesh™ as digital root system"
            ]
          },
          "Taalbasis": {
            titleEn: "Language Foundation",
            languages: {
              "Engels": "Mastery",
              "Afrikaans": "Beheersing / Meesterskap",
              "Zulu": "Ubuhlakani (wysheid / wisdom)",
              "Sotho": "Bohlale (insig / insight)",
              "Spaans": "Maestría",
              "Arabies": "Itqān (إتقان)",
              "Chinees": "Jīngtōng (精通)"
            }
          }
        }
      }
    },
    "Hoofstuk 3: Metodologie": {
      titleEn: "Chapter 3: Methodology",
      icon: <Zap className="h-5 w-5" />,
      content: {
        af: "Shell Fields – skep placeholders, Sector Apendance – heg sektore aan soos takke aan 'n boom.",
        en: "Shell Fields – create placeholders, Sector Appendance – attach sectors like branches to a tree.",
        steps: [
          {
            af: "Shell Fields – skep placeholders: Saad-Oorsprong, Sektor-Anker, Royalty-Kanale",
            en: "Shell Fields – create placeholders: Seed-Origin, Sector-Anchor, Royalty-Channels"
          },
          {
            af: "Sector Apendance – heg sektore aan soos takke aan 'n boom",
            en: "Sector Appendance – attach sectors like branches to a tree"
          },
          {
            af: "VaultMesh™ Integrasie – beveilig en verifieer elke laag met Inline Verification™",
            en: "VaultMesh™ Integration – secure and verify each layer with Inline Verification™"
          },
          {
            af: "Lifecycle Rendering – toets elke dop deur simulasies en risiko-lae",
            en: "Lifecycle Rendering – test each shell through simulations and risk layers"
          }
        ]
      }
    },
    "Hoofstuk 4: Resultate & Toepassing": {
      titleEn: "Chapter 4: Results & Application",
      icon: <Globe className="h-5 w-5" />,
      content: {
        applications: [
          {
            af: "Interstellar Insurance: Versekerbaarheid van menslike en nie-menslike ekosisteme",
            en: "Interstellar Insurance: Insurability of human and non-human ecosystems"
          },
          {
            af: "Galactic Language Representation: Taal as 'n drager van risiko en hoop",
            en: "Galactic Language Representation: Language as a carrier of risk and hope"
          },
          {
            af: "Fruitful Global™ Strategy: Praktiese toepassings in gemeenskappe, markte en planeet-ekonomieë",
            en: "Fruitful Global™ Strategy: Practical applications in communities, markets and planet-economies"
          }
        ]
      }
    },
    "Hoofstuk 5: Simboliese Interpretasie": {
      titleEn: "Chapter 5: Symbolic Interpretation",
      icon: <TreePine className="h-5 w-5" />,
      content: {
        symbols: {
          "Dop": {
            af: "Houer van potensiaal",
            en: "Container of potential"
          },
          "Boom": {
            af: "Groei en langlewendheid", 
            en: "Growth and longevity"
          },
          "Brein": {
            af: "Intelligensie en berekening",
            en: "Intelligence and computation"
          },
          "Beker": {
            af: "Meesterskap en erkenning",
            en: "Mastery and recognition"
          }
        },
        conclusion: {
          af: "Hierdie beeld vorm die vier pilare van FAA™ Mastery",
          en: "This image forms the four pillars of FAA™ Mastery"
        }
      }
    },
    "Hoofstuk 6: Slot & Vooruitsig": {
      titleEn: "Chapter 6: Conclusion & Outlook",
      icon: <Lightbulb className="h-5 w-5" />,
      content: {
        af: `Die FAA™ Omni Render is nie 'n finale produk nie — dit is 'n lewende dokument. Soos elke dop oopbreek, groei 'n nuwe tak. Soos elke tak sterk word, versprei die saad weer verder.`,
        en: "The FAA™ Omni Render is not a final product — it is a living document. As each shell breaks open, a new branch grows. As each branch becomes strong, the seed spreads further again.",
        metaphor: {
          af: "Hierdie tesis is dus self 'n Baobab™-aksie: 'n boom wat wortel skiet in kennis, takke uitstuur in praktyk, en vrugte lewer in tyd.",
          en: "This thesis is thus itself a Baobab™ action: a tree that takes root in knowledge, sends out branches in practice, and bears fruit in time."
        }
      }
    }
  }
};

const pillarSymbols = [
  { symbol: "🐚", name: "Dop / Shell", description: "Container of potential" },
  { symbol: "🌳", name: "Boom / Tree", description: "Growth and longevity" },
  { symbol: "🧠", name: "Brein / Brain", description: "Intelligence and computation" },
  { symbol: "🏆", name: "Beker / Cup", description: "Mastery and recognition" }
];

interface ChapterCardProps {
  chapterKey: string;
  chapter: any;
  isExpanded: boolean;
  onToggle: () => void;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapterKey, chapter, isExpanded, onToggle }) => (
  <Card className="transform transition-all hover:shadow-xl mb-6">
    <CardHeader 
      className="cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900"
      onClick={onToggle}
    >
      <CardTitle className="flex items-center justify-between text-xl">
        <div className="flex items-center">
          {chapter.icon}
          <div className="ml-3">
            <div className="text-lg font-bold text-indigo-800 dark:text-indigo-300">{chapterKey}</div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{chapter.titleEn}</div>
          </div>
        </div>
        <Badge variant="outline">{isExpanded ? 'Verberg' : 'Wys'}</Badge>
      </CardTitle>
    </CardHeader>
    
    {isExpanded && (
      <CardContent className="p-6 space-y-4">
        {chapter.content.af && (
          <div className="border-l-4 border-blue-400 pl-4 mb-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Afrikaans:</h4>
            <p className="text-gray-700 dark:text-gray-300 italic">{chapter.content.af}</p>
          </div>
        )}
        
        {chapter.content.en && (
          <div className="border-l-4 border-green-400 pl-4 mb-4">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">English:</h4>
            <p className="text-gray-700 dark:text-gray-300">{chapter.content.en}</p>
          </div>
        )}

        {chapter.content.details && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold text-blue-700 mb-2">Afrikaans Details:</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {chapter.content.details.af.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-green-700 mb-2">English Details:</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {chapter.content.details.en.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {chapter.content.subsections && (
          <div className="mt-6">
            {Object.entries(chapter.content.subsections).map(([key, section]: [string, any]) => (
              <div key={key} className="mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h5 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  {key} / {section.titleEn}
                </h5>
                {section.items && (
                  <ul className="text-sm space-y-1">
                    {section.items.map((item: string, index: number) => (
                      <li key={index} className="text-gray-600 dark:text-gray-400">• {item}</li>
                    ))}
                  </ul>
                )}
                {section.languages && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {Object.entries(section.languages).map(([lang, meaning]) => (
                      <div key={lang} className="text-xs bg-white dark:bg-gray-700 p-2 rounded">
                        <span className="font-semibold">{lang}:</span> {meaning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {chapter.content.steps && (
          <div className="space-y-3">
            {chapter.content.steps.map((step: any, index: number) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="mr-2">{index + 1}</Badge>
                  <span className="font-semibold">Stap / Step {index + 1}</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">{step.af}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.en}</p>
              </div>
            ))}
          </div>
        )}

        {chapter.content.applications && (
          <div className="space-y-2">
            <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-3">Toepassings / Applications:</h5>
            {chapter.content.applications.map((app: any, index: number) => (
              <div key={index} className="bg-purple-50 dark:bg-purple-900 p-3 rounded">
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">{app.af}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{app.en}</p>
              </div>
            ))}
          </div>
        )}

        {chapter.content.symbols && (
          <div>
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-3">Simbole / Symbols:</h5>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(chapter.content.symbols).map(([symbol, meanings]: [string, any]) => (
                <div key={symbol} className="bg-green-50 dark:bg-green-900 p-3 rounded">
                  <h6 className="font-semibold text-green-800 dark:text-green-200">{symbol}:</h6>
                  <p className="text-sm text-green-700 dark:text-green-300">{meanings.af}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{meanings.en}</p>
                </div>
              ))}
            </div>
            {chapter.content.conclusion && (
              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">{chapter.content.conclusion.af}</p>
                <p className="text-yellow-600 dark:text-yellow-400 text-sm">{chapter.content.conclusion.en}</p>
              </div>
            )}
          </div>
        )}

        {chapter.content.metaphor && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 p-4 rounded-lg mt-4">
            <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">Metafoor / Metaphor:</h5>
            <p className="text-green-700 dark:text-green-300 mb-2">{chapter.content.metaphor.af}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{chapter.content.metaphor.en}</p>
          </div>
        )}
      </CardContent>
    )}
  </Card>
);

export default function FAATestisOmniRender() {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  const toggleChapter = (chapterKey: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterKey)) {
      newExpanded.delete(chapterKey);
    } else {
      newExpanded.add(chapterKey);
    }
    setExpandedChapters(newExpanded);
  };

  const expandAll = () => {
    setExpandedChapters(new Set(Object.keys(tesisContent.chapters)));
  };

  const collapseAll = () => {
    setExpandedChapters(new Set());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900" data-testid="faa-tesis-omni-render">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🌳📚</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            {tesisContent.metadata.title}
          </h1>
          <div className="space-y-2 text-lg opacity-90">
            <p><strong>Document ID:</strong> {tesisContent.metadata.documentId}</p>
            <p><strong>Outeur / Author:</strong> {tesisContent.metadata.author}</p>
            <p><strong>Ekosisteem / Ecosystem:</strong> {tesisContent.metadata.ecosystem}</p>
            <p><strong>Taal / Language:</strong> {tesisContent.metadata.language}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 md:p-8">
        {/* Four Pillars Overview */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-orange-800 dark:text-orange-300">
              🏛️ Vier Pilare van FAA™ Mastery / Four Pillars of FAA™ Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {pillarSymbols.map((pillar, index) => (
                <div key={index} className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <div className="text-4xl mb-3">{pillar.symbol}</div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2">{pillar.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{pillar.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Controls */}
        <Card className="mb-6">
          <CardContent className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">Dokument Navigasie / Document Navigation</span>
            </div>
            <div className="space-x-2">
              <Button onClick={expandAll} variant="outline" size="sm">
                Wys Alles / Expand All
              </Button>
              <Button onClick={collapseAll} variant="outline" size="sm">
                Verberg Alles / Collapse All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chapters */}
        <div className="space-y-6">
          {Object.entries(tesisContent.chapters).map(([chapterKey, chapter]) => (
            <ChapterCard
              key={chapterKey}
              chapterKey={chapterKey}
              chapter={chapter}
              isExpanded={expandedChapters.has(chapterKey)}
              onToggle={() => toggleChapter(chapterKey)}
            />
          ))}
        </div>

        {/* Baobab Connection */}
        <Card className="mt-8 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🌳</div>
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-4">
              Baobab™ Foundational Connection
            </h2>
            <p className="text-lg text-green-700 dark:text-green-400 max-w-3xl mx-auto">
              Connected to the Sacred Baobab™ Foundation from Kruger National Park (August 7, 2021) - 
              the spiritual and technical cornerstone of the entire FAA™ ecosystem, representing growth, 
              longevity, community, and memory across all operational domains.
            </p>
          </CardContent>
        </Card>

        {/* Document Status */}
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">
              📊 Dokument Status / Document Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-blue-800 dark:text-blue-300">Hoofstukke / Chapters</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Live</div>
                <div className="text-sm text-green-800 dark:text-green-300">Lewende Dokument / Living Document</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-purple-800 dark:text-purple-300">VaultMesh™ Verified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 text-center bg-slate-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap justify-center mb-4 text-sm space-x-4">
          <a href="https://footer.global.repo.seedwave.faa.zone/privacy.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Privacy</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/terms.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Terms</a>
          <a href="https://footer.global.repo.seedwave.faa.zone/about.html" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">About</a>
        </div>
        <span>© 2025 FAA™ Treaty System™. All Rights Reserved.</span>
        <span className="ml-2">Powered by 🦍 glyphs + Vault API. Synced with Seedwave™.</span>
      </footer>
    </div>
  );
}