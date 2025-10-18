# Overview

The **Fruitful Global Master Hub** is a central integration platform built on the **Sacred Baobab™ Foundation**. Its primary purpose is to streamline operations, facilitate global expansion, and manage diverse business units across a vast ecosystem of 72 applications and 56+ brands. It serves as the command center for data synchronization and pushing updates to connected systems, including language learning (FAA™ Seedling), AI & Logic Grids, Education, Housing, and global economic platforms like Fruitful America™. All payment processing is explicitly handled externally by `banimal.co.za`.

## Recent Updates (October 18, 2025)

**Complete FruitfulPlanetChange Visual Design Integration**:
- Transferred stunning visual aesthetic from original FruitfulPlanetChange app (HSOMNI9000 ecosystem with 3,794+ brands)
- Created **Fruitful Global Command Center** (`client/src/pages/command-center.tsx`) as the new default home page featuring:
  - Real-time metrics: Global Expansion Targets, Active Brands, AI-Media Integration, Diamond Tier status
  - Ecosystem sections: Global Systems, Fruitful America™, Wildlife Grid, Sacred Foundation
  - VaultKey/Banimal dark theme aesthetic with vault-cyan (#00D4D4) and energetic color accents
  - Gradient cards, pulse animations, and professional visual polish
- Enhanced CSS with FruitfulPlanetChange signature styles:
  - Custom CSS variables: `--vault-cyan`, `--vault-orange`, `--vault-cyan-light`, `--energetic-green`, `--energetic-blue`, `--energetic-amber`
  - Signature classes: `.energetic-card`, `.integration-badge`, `.search-enhancement`, `.nav-icon`, `.status-indicator`
  - Animations: pulse, fadeIn, shimmer, slideIn
  - Gradient effects and glow-effect hover states
- Complete data-testid coverage (60+ attributes) for all interactive and informative elements
- Visual design now matches original FruitfulPlanetChange app paid development

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## UI/UX Decisions
The frontend uses **React 18 with TypeScript** and **Vite**, leveraging **Shadcn/ui** components built on **Radix UI** and styled with **Tailwind CSS**. It features a dark theme, custom CSS variables, responsive design, **Wouter** for routing, and **TanStack Query** for server state management. Real-time updates are facilitated via WebSockets. The design follows the **VaultKey/Banimal** style, characterized by a dark palette with energetic accents, the **Inter** font family, and modern card-based layouts.

## Technical Implementations
-   **Backend**: **Node.js with Express.js** and **TypeScript**, providing RESTful APIs and WebSocket support.
-   **Data Storage**: **PostgreSQL** via **Neon Database** (serverless) with **Drizzle ORM**.
-   **Authentication**: Session-based authentication using Express sessions.
-   **File Handling**: **Multer** for file uploads.
-   **Core Features**:
    -   **FAA™ Seedling Language Learning System**: Manages 111 kindness languages and 140 protected seedlings.
    -   **AI & Logic Grid Systems**: Integrates 188 FAA-Certified Core Scroll Brands and 9 core AI Grid Systems.
    -   **Ecosystem Integration Command Center**: Pushes updates to 74 Replit applications, 70+ Git repositories, and 4 WordPress sites (including `banimal.co.za`).
    -   **Sync Automation System**: Handles product and user synchronization with validation and real-time WebSocket updates.
    -   **Global View GPT Interface**: For real-time global intelligence synchronization.
    -   **VaultMesh™ Diamond Tier Architecture**: Treaty-driven execution mesh protocols.
    -   **HotStack™ Cloudflare Integration**: Manages Cloudflare Workers and R2 storage.
    -   **GitHub Repository Browser**: Provides management and visualization of GitHub repositories.

## Feature Specifications
-   **Centralized Command Center**: Pushes updates and synchronizes data across 1000+ product sites globally.
-   **No Payment Processing**: All transactions are redirected to `banimal.co.za`.
-   **Ecosystem Manager Dashboard**: Provides real-time sync status, connection management, and detailed sync logs.
-   **API Endpoints**: Authenticated REST APIs for triggering and monitoring sync operations.
-   **Asset Manifest System**: Catalogs and manages `attached_assets/` directory (1,247 files) for synchronization.
-   **KeyVault Service**: Centralized management and audit logging for 9 environment keys.
-   **Sync Architecture Documentation**: Comprehensive documentation of cross-app synchronization architecture and event types.

## System Design Choices
The architecture uses a modern full-stack approach with end-to-end TypeScript, prioritizing type safety, real-time capabilities, and scalability. It employs a "push-only" model for data synchronization. All payment processing is externalized to `banimal.co.za`.

# External Dependencies

## Database & ORM
-   **PostgreSQL**: Primary database (via Neon Database)
-   **Drizzle ORM**: Database interactions

## UI & Styling
-   **Radix UI**: Component primitives
-   **Tailwind CSS**: Styling framework
-   **Shadcn/ui**: Pre-built components
-   **Lucide React**: Icon library

## Development & Build Tools
-   **Vite**: Build tool
-   **TypeScript**: Language

## File Processing & Validation
-   **Multer**: File uploads
-   **Zod**: Runtime type validation

## Real-time & Communication
-   **WebSocket (ws)**: Real-time communication
-   **TanStack Query**: Server state management

## Session & Security
-   **Connect-pg-simple**: PostgreSQL session store
-   **Express**: Web framework

## Integrated External Systems
-   **banimal.co.za**: Centralized WordPress platform for payment processing and data synchronization.
-   **WordPress REST API**: Used for syncing with `banimal.co.za` and other WordPress sites.
-   **Noodle Juice Flow controller**: Provides Replit UUIDs for integrated applications.
-   **Cloudflare Workers & R2**: HotStack™ rapid deployment system.
-   **GitHub API (Octokit)**: For managing and interacting with GitHub repositories.