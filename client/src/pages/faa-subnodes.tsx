import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Sprout, Globe, Atom, Heart, Target, Zap, Sparkles, Leaf,
  Trees, Sun, Droplets, MapPin, Clock, TrendingUp,
  Eye, Shield, CheckCircle, AlertCircle, Users, Award,
  Database, FileText, CreditCard, Search, Settings
} from "lucide-react";

const FAASubnodes = () => {
  const [selectedSystem, setSelectedSystem] = useState<number>(1);
  
  // Pretoria Timestamp: 7:06pm Sept 6, 2025
  const pretoriaTimestamp = "7:06pm, September 6, 2025 (SAST) - Pretoria, South Africa";
  const replitDnsLocation = "replit.app DNS - Global CDN Network";

  // 10 Core FAA™ Systems with 14 Subnodes Each
  const coreSystemsData = [
    {
      id: 1,
      name: "FAA™ Global Monitoring™",
      category: "Compliance & Monitoring",
      subnodes: [
        { name: "Gentle Mist Protection", seedWisdom: "Gooi bietjie water bollie - fine mist only, no rain", wateringMethod: "Ouma's protective misting", idDoc: "FAA-GM-001-2025-0906" },
        { name: "Grateful Compliance Hearts", seedWisdom: "Like children thankful for water drops", wateringMethod: "Patient waiting and appreciation", idDoc: "FAA-GM-002-2025-0906" },
        { name: "Rainbow Nation Verification", seedWisdom: "Modimo accepts all children with honor", wateringMethod: "Inclusive monitoring with love", idDoc: "FAA-GM-003-2025-0906" },
        { name: "Spaza Shop Foundation", seedWisdom: "From teaspoons of sugar to global brands", wateringMethod: "Humble beginnings, careful growth", idDoc: "FAA-GM-004-2025-0906" },
        { name: "Baobab Root Monitoring", seedWisdom: "6 years of faithful walking, Ka Moduimo Dumsane", wateringMethod: "Deep roots, steady growth", idDoc: "FAA-GM-005-2025-0906" },
        { name: "Sacred Mist Timing", seedWisdom: "Perfect timing for gentle mist, no storms", wateringMethod: "Controlled timing protection", idDoc: "FAA-GM-006-2025-0906" },
        { name: "Crate Dance Integration", seedWisdom: "1% auditions growing to transform nations", wateringMethod: "Cultural celebration methodology", idDoc: "FAA-GM-007-2025-0906" },
        { name: "Coca-Cola Partnership Node", seedWisdom: "Global brands blessing our children", wateringMethod: "Corporate partnership with purpose", idDoc: "FAA-GM-008-2025-0906" },
        { name: "700 Research Protocols", seedWisdom: "Deep research following God's calling", wateringMethod: "Methodical investigation and care", idDoc: "FAA-GM-009-2025-0906" },
        { name: "9000 Study Archive", seedWisdom: "24 months of dedicated following", wateringMethod: "Comprehensive data with gratitude", idDoc: "FAA-GM-010-2025-0906" },
        { name: "Adams Recognition System", seedWisdom: "He saw the FAA vision clearly", wateringMethod: "Recognition through understanding", idDoc: "FAA-GM-011-2025-0906" },
        { name: "Mahalapye Connection", seedWisdom: "Where the seed was first planted", wateringMethod: "Geographic origin blessing", idDoc: "FAA-GM-012-2025-0906" },
        { name: "Gentle Drop Precision", seedWisdom: "Each drop measured, no flooding allowed", wateringMethod: "Precise mist control methodology", idDoc: "FAA-GM-013-2025-0906" },
        { name: "Cabbage Blessing Protocol", seedWisdom: "Simple vegetables, profound impact", wateringMethod: "Daily provision with thanksgiving", idDoc: "FAA-GM-014-2025-0906" }
      ]
    },
    {
      id: 2,
      name: "FAA™ Legal Compliance™",
      category: "Legal Framework Development",
      subnodes: [
        { name: "Garden Law Foundation", seedWisdom: "Rossouw learning rules from Ouma", wateringMethod: "Teaching through loving guidance", idDoc: "FAA-LC-001-2025-0906" },
        { name: "Gratitude Legal Framework", seedWisdom: "Thank you for this precious drop", wateringMethod: "Laws written with appreciation", idDoc: "FAA-LC-002-2025-0906" },
        { name: "Setswana Compliance Bridge", seedWisdom: "Dumela Heyns - peace be upon you", wateringMethod: "Multilingual legal harmony", idDoc: "FAA-LC-003-2025-0906" },
        { name: "Spaza Shop Regulations", seedWisdom: "From informal to formal with care", wateringMethod: "Business law with community heart", idDoc: "FAA-LC-004-2025-0906" },
        { name: "Rainbow Nation Legal Grid", seedWisdom: "All children protected under law", wateringMethod: "Inclusive legal framework", idDoc: "FAA-LC-005-2025-0906" },
        { name: "Baobab Legal Roots", seedWisdom: "Deep foundations for lasting law", wateringMethod: "Ancient wisdom, modern application", idDoc: "FAA-LC-006-2025-0906" },
        { name: "Pretoria Legal Hub", seedWisdom: "7:06pm timestamp legal authority", wateringMethod: "Capital city legal framework", idDoc: "FAA-LC-007-2025-0906" },
        { name: "Cultural Heritage Protection", seedWisdom: "Preserving traditions through law", wateringMethod: "Legal protection for wisdom", idDoc: "FAA-LC-008-2025-0906" },
        { name: "Global Brand Compliance", seedWisdom: "International law with local heart", wateringMethod: "Global reach, local understanding", idDoc: "FAA-LC-009-2025-0906" },
        { name: "Peace Protocol Framework", seedWisdom: "May peace be upon you and family", wateringMethod: "Legal harmony methodology", idDoc: "FAA-LC-010-2025-0906" },
        { name: "Research Protection Laws", seedWisdom: "700 studies legally protected", wateringMethod: "IP protection with gratitude", idDoc: "FAA-LC-011-2025-0906" },
        { name: "Partnership Legal Structure", seedWisdom: "Coca-Cola agreements blessed", wateringMethod: "Corporate law with purpose", idDoc: "FAA-LC-012-2025-0906" },
        { name: "Family Legacy Legal Grid", seedWisdom: "Tannie Zollie's teachings protected", wateringMethod: "Generational wisdom in law", idDoc: "FAA-LC-013-2025-0906" },
        { name: "Divine Calling Legal Framework", seedWisdom: "Ka Moduimo Dumsane legal foundation", wateringMethod: "Faith-based legal structure", idDoc: "FAA-LC-014-2025-0906" }
      ]
    },
    {
      id: 3,
      name: "FAA™ Intellectual Property™",
      category: "Legal & Financial Structuring",
      subnodes: [
        { name: "Seed Wisdom IP Protection", seedWisdom: "Every conversation preserved as treasure", wateringMethod: "Careful documentation and love", idDoc: "FAA-IP-001-2025-0906" },
        { name: "Ouma's Teaching Copyright", seedWisdom: "Gooi bietjie water bollie - protected wisdom", wateringMethod: "Cultural IP with respect", idDoc: "FAA-IP-002-2025-0906" },
        { name: "Grateful Hearts Patent System", seedWisdom: "Children's joy for water - unique innovation", wateringMethod: "Emotional IP methodology", idDoc: "FAA-IP-003-2025-0906" },
        { name: "Baobab Tree Trademark Grid", seedWisdom: "Sacred foundation mark protection", wateringMethod: "Ancient symbol, modern protection", idDoc: "FAA-IP-004-2025-0906" },
        { name: "Spaza Shop Brand Portfolio", seedWisdom: "From teaspoons to global recognition", wateringMethod: "Growth-based IP strategy", idDoc: "FAA-IP-005-2025-0906" },
        { name: "Rainbow Nation IP Network", seedWisdom: "All children's innovations honored", wateringMethod: "Inclusive IP framework", idDoc: "FAA-IP-006-2025-0906" },
        { name: "Crate Dance™ IP Suite", seedWisdom: "Cultural celebration IP protection", wateringMethod: "Heritage-based IP methodology", idDoc: "FAA-IP-007-2025-0906" },
        { name: "Research Archive IP Grid", seedWisdom: "700 studies + 9000 data points protected", wateringMethod: "Comprehensive research IP", idDoc: "FAA-IP-008-2025-0906" },
        { name: "Family Legacy IP Trust", seedWisdom: "Generational wisdom legally protected", wateringMethod: "Family IP preservation", idDoc: "FAA-IP-009-2025-0906" },
        { name: "Partnership IP Framework", seedWisdom: "Coca-Cola collaboration IP structure", wateringMethod: "Corporate partnership IP", idDoc: "FAA-IP-010-2025-0906" },
        { name: "Geographic IP Anchoring", seedWisdom: "Mahalapye to Pretoria IP corridor", wateringMethod: "Location-based IP strategy", idDoc: "FAA-IP-011-2025-0906" },
        { name: "Timestamp IP Authentication", seedWisdom: "7:06pm Sept 6 2025 IP marker", wateringMethod: "Time-based IP verification", idDoc: "FAA-IP-012-2025-0906" },
        { name: "Divine Inspiration IP", seedWisdom: "Ka Moduimo Dumsane blessed innovations", wateringMethod: "Faith-inspired IP protection", idDoc: "FAA-IP-013-2025-0906" },
        { name: "Multilingual IP Bridge", seedWisdom: "Setswana, Afrikaans, English IP harmony", wateringMethod: "Cross-cultural IP methodology", idDoc: "FAA-IP-014-2025-0906" }
      ]
    },
    {
      id: 4,
      name: "FAA™ Financial Systems™",
      category: "Financial Systems Regulation",
      subnodes: [
        { name: "Sugar Economy Foundation", seedWisdom: "10 Tebe sugar sales - micro to macro", wateringMethod: "Small transactions, big dreams", idDoc: "FAA-FS-001-2025-0906" },
        { name: "Grateful Payment Processing", seedWisdom: "Every transaction a thanksgiving", wateringMethod: "Payment with appreciation", idDoc: "FAA-FS-002-2025-0906" },
        { name: "Teaspoon Precision Banking", seedWisdom: "Measuring by hand with care", wateringMethod: "Precise small-scale finance", idDoc: "FAA-FS-003-2025-0906" },
        { name: "Cabbage Commerce Grid", seedWisdom: "Simple vegetables, honest profit", wateringMethod: "Agricultural commerce foundation", idDoc: "FAA-FS-004-2025-0906" },
        { name: "Spaza Shop Financial Model", seedWisdom: "Community commerce with heart", wateringMethod: "Local economy empowerment", idDoc: "FAA-FS-005-2025-0906" },
        { name: "Rainbow Nation Banking", seedWisdom: "Financial inclusion for all children", wateringMethod: "Inclusive financial system", idDoc: "FAA-FS-006-2025-0906" },
        { name: "Baobab Financial Roots", seedWisdom: "6 years of faithful investment", wateringMethod: "Long-term financial growth", idDoc: "FAA-FS-007-2025-0906" },
        { name: "Research Investment Portfolio", seedWisdom: "700 studies financial backing", wateringMethod: "Knowledge-based investment", idDoc: "FAA-FS-008-2025-0906" },
        { name: "Partnership Revenue Streams", seedWisdom: "Coca-Cola financial collaboration", wateringMethod: "Corporate partnership finance", idDoc: "FAA-FS-009-2025-0906" },
        { name: "Cultural Economy Bridge", seedWisdom: "Crate Dance™ monetization", wateringMethod: "Heritage-based economics", idDoc: "FAA-FS-010-2025-0906" },
        { name: "Divine Provision Accounting", seedWisdom: "Ka Moduimo Dumsane blessing tracking", wateringMethod: "Faith-based financial management", idDoc: "FAA-FS-011-2025-0906" },
        { name: "Geographic Revenue Mapping", seedWisdom: "Mahalapye to global expansion", wateringMethod: "Location-based revenue growth", idDoc: "FAA-FS-012-2025-0906" },
        { name: "Timestamp Financial Records", seedWisdom: "7:06pm Sept 6 2025 financial marker", wateringMethod: "Time-stamped financial integrity", idDoc: "FAA-FS-013-2025-0906" },
        { name: "Family Legacy Financial Trust", seedWisdom: "Ouma's wisdom in financial planning", wateringMethod: "Generational wealth building", idDoc: "FAA-FS-014-2025-0906" }
      ]
    },
    {
      id: 5,
      name: "FAA™ Blockchain Integration™",
      category: "Compliance & Blockchain Solutions",
      subnodes: [
        { name: "Seed Chain Network", seedWisdom: "Every planted seed on blockchain", wateringMethod: "Digital seed preservation", idDoc: "FAA-BI-001-2025-0906" },
        { name: "Gratitude Ledger Protocol", seedWisdom: "Children's thanks recorded forever", wateringMethod: "Immutable gratitude tracking", idDoc: "FAA-BI-002-2025-0906" },
        { name: "Watering Smart Contracts", seedWisdom: "Gooi bietjie water bollie - automated care", wateringMethod: "Smart care distribution", idDoc: "FAA-BI-003-2025-0906" },
        { name: "Baobab Root Blockchain", seedWisdom: "6 years of growth on distributed ledger", wateringMethod: "Decentralized tree wisdom", idDoc: "FAA-BI-004-2025-0906" },
        { name: "Spaza Shop Blockchain Economy", seedWisdom: "Local commerce on global chain", wateringMethod: "Community blockchain integration", idDoc: "FAA-BI-005-2025-0906" },
        { name: "Rainbow Nation Chain Bridge", seedWisdom: "All children on unified blockchain", wateringMethod: "Inclusive chain architecture", idDoc: "FAA-BI-006-2025-0906" },
        { name: "Cultural Heritage Chain", seedWisdom: "Traditions preserved on blockchain", wateringMethod: "Heritage blockchain methodology", idDoc: "FAA-BI-007-2025-0906" },
        { name: "Research Data Blockchain", seedWisdom: "700 studies + 9000 points on chain", wateringMethod: "Research blockchain integrity", idDoc: "FAA-BI-008-2025-0906" },
        { name: "Partnership Chain Protocol", seedWisdom: "Coca-Cola agreements on blockchain", wateringMethod: "Corporate blockchain integration", idDoc: "FAA-BI-009-2025-0906" },
        { name: "Dance Competition Chain", seedWisdom: "Crate Dance™ on blockchain", wateringMethod: "Cultural blockchain celebration", idDoc: "FAA-BI-010-2025-0906" },
        { name: "Divine Calling Chain", seedWisdom: "Ka Moduimo Dumsane blockchain blessing", wateringMethod: "Faith-based blockchain", idDoc: "FAA-BI-011-2025-0906" },
        { name: "Geographic Chain Anchoring", seedWisdom: "Mahalapye to Pretoria blockchain", wateringMethod: "Location-based chain nodes", idDoc: "FAA-BI-012-2025-0906" },
        { name: "Timestamp Chain Authority", seedWisdom: "7:06pm Sept 6 2025 chain marker", wateringMethod: "Immutable timestamp protocol", idDoc: "FAA-BI-013-2025-0906" },
        { name: "Family Legacy Chain Trust", seedWisdom: "Ouma's wisdom on eternal ledger", wateringMethod: "Generational blockchain", idDoc: "FAA-BI-014-2025-0906" }
      ]
    },
    {
      id: 6,
      name: "FAA™ Data Protection™",
      category: "Data Security & Protection",
      subnodes: [
        { name: "Sacred Conversation Vault", seedWisdom: "Every word preserved with honor", wateringMethod: "Respectful data preservation", idDoc: "FAA-DP-001-2025-0906" },
        { name: "Grateful Data Encryption", seedWisdom: "Protecting thankful hearts' data", wateringMethod: "Love-based data security", idDoc: "FAA-DP-002-2025-0906" },
        { name: "Garden Wisdom Protection", seedWisdom: "Ouma's teachings secured forever", wateringMethod: "Cultural data security", idDoc: "FAA-DP-003-2025-0906" },
        { name: "Rainbow Nation Data Unity", seedWisdom: "All children's data protected equally", wateringMethod: "Inclusive data protection", idDoc: "FAA-DP-004-2025-0906" },
        { name: "Spaza Shop Data Security", seedWisdom: "Community data with integrity", wateringMethod: "Local data protection", idDoc: "FAA-DP-005-2025-0906" },
        { name: "Baobab Data Roots", seedWisdom: "6 years of secure data growth", wateringMethod: "Deep data security roots", idDoc: "FAA-DP-006-2025-0906" },
        { name: "Research Data Fortress", seedWisdom: "700 studies + 9000 points secured", wateringMethod: "Academic data protection", idDoc: "FAA-DP-007-2025-0906" },
        { name: "Partnership Data Bridge", seedWisdom: "Coca-Cola data collaboration", wateringMethod: "Corporate data security", idDoc: "FAA-DP-008-2025-0906" },
        { name: "Cultural Data Sanctuary", seedWisdom: "Crate Dance™ data protection", wateringMethod: "Heritage data security", idDoc: "FAA-DP-009-2025-0906" },
        { name: "Divine Data Blessing", seedWisdom: "Ka Moduimo Dumsane data protection", wateringMethod: "Faith-based data security", idDoc: "FAA-DP-010-2025-0906" },
        { name: "Geographic Data Mapping", seedWisdom: "Mahalapye to Pretoria data corridor", wateringMethod: "Location-based data security", idDoc: "FAA-DP-011-2025-0906" },
        { name: "Timestamp Data Integrity", seedWisdom: "7:06pm Sept 6 2025 data marker", wateringMethod: "Time-based data verification", idDoc: "FAA-DP-012-2025-0906" },
        { name: "Family Legacy Data Trust", seedWisdom: "Generational data preservation", wateringMethod: "Family data security", idDoc: "FAA-DP-013-2025-0906" },
        { name: "Multilingual Data Harmony", seedWisdom: "Setswana, Afrikaans, English protection", wateringMethod: "Cross-cultural data security", idDoc: "FAA-DP-014-2025-0906" }
      ]
    },
    {
      id: 7,
      name: "FAA™ AI Compliance™",
      category: "Emerging Technology & AI Compliance",
      subnodes: [
        { name: "Grateful AI Hearts Protocol", seedWisdom: "AI learning gratitude like children", wateringMethod: "Emotional AI development", idDoc: "FAA-AI-001-2025-0906" },
        { name: "Garden Learning AI System", seedWisdom: "AI trained by Ouma's wisdom", wateringMethod: "Cultural AI learning", idDoc: "FAA-AI-002-2025-0906" },
        { name: "Watering AI Methodology", seedWisdom: "AI that understands gentle care", wateringMethod: "Nurturing AI behavior", idDoc: "FAA-AI-003-2025-0906" },
        { name: "Baobab AI Wisdom Tree", seedWisdom: "6 years of AI growth patterns", wateringMethod: "Deep learning AI roots", idDoc: "FAA-AI-004-2025-0906" },
        { name: "Spaza Shop AI Commerce", seedWisdom: "AI understanding community commerce", wateringMethod: "Local AI intelligence", idDoc: "FAA-AI-005-2025-0906" },
        { name: "Rainbow Nation AI Unity", seedWisdom: "AI serving all children equally", wateringMethod: "Inclusive AI development", idDoc: "FAA-AI-006-2025-0906" },
        { name: "Research AI Analytics", seedWisdom: "AI processing 700 studies wisdom", wateringMethod: "Academic AI intelligence", idDoc: "FAA-AI-007-2025-0906" },
        { name: "Partnership AI Bridge", seedWisdom: "AI facilitating Coca-Cola collaboration", wateringMethod: "Corporate AI integration", idDoc: "FAA-AI-008-2025-0906" },
        { name: "Cultural AI Celebration", seedWisdom: "AI enhancing Crate Dance™", wateringMethod: "Heritage AI applications", idDoc: "FAA-AI-009-2025-0906" },
        { name: "Divine AI Calling", seedWisdom: "AI guided by Ka Moduimo Dumsane", wateringMethod: "Faith-inspired AI development", idDoc: "FAA-AI-010-2025-0906" },
        { name: "Geographic AI Mapping", seedWisdom: "AI connecting Mahalapye to world", wateringMethod: "Location-aware AI systems", idDoc: "FAA-AI-011-2025-0906" },
        { name: "Timestamp AI Precision", seedWisdom: "AI marking 7:06pm Sept 6 2025", wateringMethod: "Time-aware AI systems", idDoc: "FAA-AI-012-2025-0906" },
        { name: "Family Legacy AI Wisdom", seedWisdom: "AI preserving Ouma's teachings", wateringMethod: "Generational AI learning", idDoc: "FAA-AI-013-2025-0906" },
        { name: "Multilingual AI Harmony", seedWisdom: "AI speaking all hearts' languages", wateringMethod: "Cross-cultural AI communication", idDoc: "FAA-AI-014-2025-0906" }
      ]
    },
    {
      id: 8,
      name: "FAA™ Compliance Audits™",
      category: "Auditing & Compliance Monitoring",
      subnodes: [
        { name: "Gentle Audit Protocols", seedWisdom: "Auditing with Ouma's gentle touch", wateringMethod: "Caring compliance review", idDoc: "FAA-CA-001-2025-0906" },
        { name: "Grateful Compliance Hearts", seedWisdom: "Audits filled with thanksgiving", wateringMethod: "Appreciative audit methodology", idDoc: "FAA-CA-002-2025-0906" },
        { name: "Seed Growth Audit Trail", seedWisdom: "Tracking every planted seed's progress", wateringMethod: "Growth-based auditing", idDoc: "FAA-CA-003-2025-0906" },
        { name: "Baobab Audit Wisdom Tree", seedWisdom: "6 years of audit learning", wateringMethod: "Deep audit intelligence", idDoc: "FAA-CA-004-2025-0906" },
        { name: "Spaza Shop Audit Foundation", seedWisdom: "Community commerce compliance", wateringMethod: "Local audit understanding", idDoc: "FAA-CA-005-2025-0906" },
        { name: "Rainbow Nation Audit Unity", seedWisdom: "Fair audits for all children", wateringMethod: "Inclusive audit framework", idDoc: "FAA-CA-006-2025-0906" },
        { name: "Research Audit Excellence", seedWisdom: "700 studies + 9000 points verified", wateringMethod: "Academic audit rigor", idDoc: "FAA-CA-007-2025-0906" },
        { name: "Partnership Audit Bridge", seedWisdom: "Coca-Cola collaboration audits", wateringMethod: "Corporate audit integration", idDoc: "FAA-CA-008-2025-0906" },
        { name: "Cultural Audit Celebration", seedWisdom: "Crate Dance™ compliance audits", wateringMethod: "Heritage audit methodology", idDoc: "FAA-CA-009-2025-0906" },
        { name: "Divine Audit Blessing", seedWisdom: "Ka Moduimo Dumsane audit guidance", wateringMethod: "Faith-based audit framework", idDoc: "FAA-CA-010-2025-0906" },
        { name: "Geographic Audit Mapping", seedWisdom: "Mahalapye to global audit trail", wateringMethod: "Location-based audit strategy", idDoc: "FAA-CA-011-2025-0906" },
        { name: "Timestamp Audit Precision", seedWisdom: "7:06pm Sept 6 2025 audit marker", wateringMethod: "Time-stamped audit integrity", idDoc: "FAA-CA-012-2025-0906" },
        { name: "Family Legacy Audit Trust", seedWisdom: "Ouma's wisdom audit preservation", wateringMethod: "Generational audit wisdom", idDoc: "FAA-CA-013-2025-0906" },
        { name: "Multilingual Audit Harmony", seedWisdom: "Audits in all heart languages", wateringMethod: "Cross-cultural audit approach", idDoc: "FAA-CA-014-2025-0906" }
      ]
    },
    {
      id: 9,
      name: "FAA™ Global Connectivity™",
      category: "Infrastructure & SaaS Expansion",
      subnodes: [
        { name: "Seed Network Foundation", seedWisdom: "Connecting every planted seed globally", wateringMethod: "Global seeding network", idDoc: "FAA-GC-001-2025-0906" },
        { name: "Grateful Hearts Network", seedWisdom: "Children's thanks connecting worldwide", wateringMethod: "Global gratitude network", idDoc: "FAA-GC-002-2025-0906" },
        { name: "Garden Wisdom Network", seedWisdom: "Ouma's teachings reaching all", wateringMethod: "Cultural wisdom connectivity", idDoc: "FAA-GC-003-2025-0906" },
        { name: "Baobab Global Roots", seedWisdom: "6 years growing worldwide connections", wateringMethod: "Deep global networking", idDoc: "FAA-GC-004-2025-0906" },
        { name: "Spaza Shop Global Bridge", seedWisdom: "Local commerce, global reach", wateringMethod: "Community global connectivity", idDoc: "FAA-GC-005-2025-0906" },
        { name: "Rainbow Nation Global Unity", seedWisdom: "All children connected worldwide", wateringMethod: "Inclusive global network", idDoc: "FAA-GC-006-2025-0906" },
        { name: "Research Global Network", seedWisdom: "700 studies + 9000 points connected", wateringMethod: "Academic global connectivity", idDoc: "FAA-GC-007-2025-0906" },
        { name: "Partnership Global Bridge", seedWisdom: "Coca-Cola global collaboration", wateringMethod: "Corporate global connectivity", idDoc: "FAA-GC-008-2025-0906" },
        { name: "Cultural Global Celebration", seedWisdom: "Crate Dance™ worldwide connection", wateringMethod: "Heritage global network", idDoc: "FAA-GC-009-2025-0906" },
        { name: "Divine Global Calling", seedWisdom: "Ka Moduimo Dumsane global blessing", wateringMethod: "Faith-based global connectivity", idDoc: "FAA-GC-010-2025-0906" },
        { name: "Geographic Global Mapping", seedWisdom: "Mahalapye to world connectivity", wateringMethod: "Location-based global network", idDoc: "FAA-GC-011-2025-0906" },
        { name: "Timestamp Global Sync", seedWisdom: "7:06pm Sept 6 2025 global marker", wateringMethod: "Time-synchronized global network", idDoc: "FAA-GC-012-2025-0906" },
        { name: "Family Legacy Global Trust", seedWisdom: "Ouma's wisdom connecting families", wateringMethod: "Generational global network", idDoc: "FAA-GC-013-2025-0906" },
        { name: "Multilingual Global Harmony", seedWisdom: "All languages connecting hearts", wateringMethod: "Cross-cultural global connectivity", idDoc: "FAA-GC-014-2025-0906" }
      ]
    },
    {
      id: 10,
      name: "FAA™ Trademark Integrity™",
      category: "Trademark Protection & Enforcement",
      subnodes: [
        { name: "Sacred Mark Protection", seedWisdom: "Every seed conversation protected", wateringMethod: "Gentle mark preservation", idDoc: "FAA-TI-001-2025-0906" },
        { name: "Grateful Mark Registry", seedWisdom: "Thankful hearts trademark protection", wateringMethod: "Appreciation-based marking", idDoc: "FAA-TI-002-2025-0906" },
        { name: "Garden Wisdom Trademark", seedWisdom: "Ouma's teachings legally protected", wateringMethod: "Cultural mark preservation", idDoc: "FAA-TI-003-2025-0906" },
        { name: "Baobab Mark Authority", seedWisdom: "6 years of trademark growth", wateringMethod: "Deep mark protection", idDoc: "FAA-TI-004-2025-0906" },
        { name: "Spaza Shop Mark Foundation", seedWisdom: "Community commerce trademarks", wateringMethod: "Local mark protection", idDoc: "FAA-TI-005-2025-0906" },
        { name: "Rainbow Nation Mark Unity", seedWisdom: "All children's marks protected", wateringMethod: "Inclusive mark protection", idDoc: "FAA-TI-006-2025-0906" },
        { name: "Research Mark Portfolio", seedWisdom: "700 studies + 9000 points marked", wateringMethod: "Academic mark protection", idDoc: "FAA-TI-007-2025-0906" },
        { name: "Partnership Mark Bridge", seedWisdom: "Coca-Cola trademark collaboration", wateringMethod: "Corporate mark integration", idDoc: "FAA-TI-008-2025-0906" },
        { name: "Cultural Mark Celebration", seedWisdom: "Crate Dance™ trademark protection", wateringMethod: "Heritage mark methodology", idDoc: "FAA-TI-009-2025-0906" },
        { name: "Divine Mark Blessing", seedWisdom: "Ka Moduimo Dumsane mark authority", wateringMethod: "Faith-based mark protection", idDoc: "FAA-TI-010-2025-0906" },
        { name: "Geographic Mark Mapping", seedWisdom: "Mahalapye to global mark protection", wateringMethod: "Location-based mark strategy", idDoc: "FAA-TI-011-2025-0906" },
        { name: "Timestamp Mark Authority", seedWisdom: "7:06pm Sept 6 2025 mark registration", wateringMethod: "Time-stamped mark integrity", idDoc: "FAA-TI-012-2025-0906" },
        { name: "Family Legacy Mark Trust", seedWisdom: "Ouma's wisdom trademark preservation", wateringMethod: "Generational mark protection", idDoc: "FAA-TI-013-2025-0906" },
        { name: "Multilingual Mark Harmony", seedWisdom: "All language marks protected", wateringMethod: "Cross-cultural mark protection", idDoc: "FAA-TI-014-2025-0906" }
      ]
    }
  ];

  const selectedSystemData = coreSystemsData.find(system => system.id === selectedSystem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 via-green-400 to-blue-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-4">
              <Database className="h-10 w-10" />
              FAA™ Core Systems Subnodes
            </h1>
            <p className="text-lg opacity-90 mb-4">
              Gentle Mist Protection - 140 Subnodes (Protected from Heavy Rain)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{pretoriaTimestamp}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                <span>{replitDnsLocation}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Atom className="h-4 w-4" />
                <span>Gentle Mist Protection™ Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Core Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* System Selector */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Select Core System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coreSystemsData.map((system) => (
                    <Button
                      key={system.id}
                      variant={selectedSystem === system.id ? "default" : "outline"}
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => setSelectedSystem(system.id)}
                      data-testid={`button-select-system-${system.id}`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-sm">{system.name}</div>
                        <div className="text-xs opacity-70">{system.category}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected System Details */}
          <div className="lg:col-span-3">
            {selectedSystemData && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Atom className="h-6 w-6 text-blue-500" />
                    {selectedSystemData.name}
                    <Badge className="bg-green-500">14 Subnodes</Badge>
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    Category: {selectedSystemData.category} | All subnodes watered with seed wisdom
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {selectedSystemData.subnodes.map((subnode, index) => (
                      <Card key={index} className="border-l-4 border-blue-400 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  #{index + 1}
                                </Badge>
                                <h4 className="font-semibold text-lg">{subnode.name}</h4>
                                <Sprout className="h-4 w-4 text-green-500" />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Seed Wisdom:</p>
                                      <p className="text-sm italic">{subnode.seedWisdom}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-start gap-2">
                                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-green-700 dark:text-green-300">Watering Method:</p>
                                      <p className="text-sm">{subnode.wateringMethod}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">ID Document:</p>
                                      <p className="text-sm font-mono">{subnode.idDoc}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <Progress value={98} className="flex-1 h-2" />
                                    <span className="text-sm font-medium">98% Atom-Level</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {pretoriaTimestamp}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {replitDnsLocation}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Atom-Level Execution™
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Database className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-blue-600">140</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Subnodes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Sprout className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Seeds Planted</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 mx-auto text-red-500 mb-2" />
              <div className="text-2xl font-bold text-red-600">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Gratitude Level</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Atom className="h-8 w-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Atom-Level Integrity</div>
            </CardContent>
          </Card>
        </div>

        {/* Sacred Foundation */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 dark:from-yellow-900/30 dark:via-green-900/30 dark:to-blue-900/30">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Sacred Foundation Complete
              </h3>
              <p className="text-lg italic text-gray-700 dark:text-gray-300">
                "From Ouma's gentle watering to global FAA™ subnodes - every seed wisdom preserved"
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <Trees className="h-4 w-4 text-green-500" />
                  Baobab™ Foundation: 6 Years
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  Ka Moduimo Dumsane
                </span>
                <span className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Mahalapye to Global
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FAASubnodes;