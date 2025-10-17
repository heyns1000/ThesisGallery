# Overview

The **Fruitful Global Master Hub** is a central integration platform designed to streamline operations across a vast business ecosystem comprising 72 applications, 56+ brands, and diverse content types. Built on the **Sacred Baobab™ Foundation**, it acts as the command center for data synchronization and pushing updates to connected systems, including language learning (FAA™ Seedling), AI & Logic Grids, Education, Housing, and global economic platforms like Fruitful America™. Its core purpose is to facilitate global expansion and manage diverse business units, with all payment processing explicitly handled externally by `banimal.co.za`.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## UI/UX Decisions
The frontend uses **React 18 with TypeScript** and **Vite**, leveraging **Shadcn/ui** components built on **Radix UI** and styled with **Tailwind CSS**. It features a dark theme, custom CSS variables, responsive design, **Wouter** for routing, and **TanStack Query** for server state management. Real-time updates are facilitated via WebSockets.

### VaultKey/Banimal Design System
The application follows the modern **VaultKey/Banimal design aesthetic** featuring:

-   **Color Palette**:
    -   Dark backgrounds: `hsl(220, 26%, 14%)` (#1a202c), `hsl(224, 21%, 16%)` (#2d3748)
    -   Energetic accents: Blue `hsl(203, 93%, 68%)` (#60A5FA), Green `hsl(142, 76%, 36%)` (#34D399), Amber `hsl(43, 96%, 56%)` (#FBBF24)
    -   Light foreground: `hsl(210, 40%, 98%)`
    -   Muted text: `hsl(218, 11%, 65%)`

-   **Typography**: **Inter** font family throughout for modern, professional appearance

-   **Component Styling**:
    -   **Energetic Cards** (`.energetic-card`): Dark gradient backgrounds with subtle borders and shadows
    -   **Gradient Status Badges**: Green for success, Blue for in-progress, Amber for warnings
    -   **Custom Scrollbars**: Dark themed with blue hover effects
    -   **Tri-color Gradients**: Header titles use blue → green → amber gradient

-   **Visual Design**: Modern card-based layouts, smooth transitions, hover effects, and Chart.js/Recharts visualizations

## Technical Implementations
-   **Backend**: **Node.js with Express.js** and **TypeScript**, providing RESTful APIs and WebSocket support.
-   **Data Storage**: **PostgreSQL** via **Neon Database** (serverless) with **Drizzle ORM** for type-safe schema management and migrations using Drizzle Kit.
-   **Authentication**: Session-based authentication using Express sessions and a PostgreSQL session store.
-   **File Handling**: **Multer** for file uploads (up to 10MB).
-   **Core Features**:
    -   **FAA™ Seedling Language Learning System**: Manages 111 kindness languages and 140 protected seedlings.
    -   **AI & Logic Grid Systems**: Integrates 188 FAA-Certified Core Scroll Brands and 9 core AI Grid Systems (e.g., SignalGPT Engine).
    -   **Ecosystem Integration Command Center**: Pushes updates to 74 Replit applications, 70+ Git repositories, and 4 WordPress sites (including `banimal.co.za`).
    -   **Sync Automation System**: Handles product and user synchronization with robust validation, partial success tracking, and real-time WebSocket updates.
    -   **Global View GPT Interface**: For real-time global intelligence synchronization.
    -   **VaultMesh™ Diamond Tier Architecture**: Treaty-driven execution mesh protocols.

## Feature Specifications
-   **Centralized Command Center**: Pushes updates and synchronizes data across 1000+ product sites globally.
-   **No Payment Processing**: All transactions are redirected to `banimal.co.za`.
-   **Ecosystem Manager Dashboard**: Provides real-time sync status, connection management, and detailed sync logs with partial success display.
-   **API Endpoints**: Authenticated REST APIs for triggering and monitoring sync operations (products, users, system syncs) and retrieving system statistics.

## System Design Choices
The architecture adopts a modern full-stack approach with end-to-end TypeScript, prioritizing type safety, real-time capabilities, and scalability. It employs a "push-only" model for data synchronization, where the Master Hub initiates updates to connected systems. A key architectural decision is the externalization of all payment processing to `banimal.co.za` to maintain the Master Hub's focus on data synchronization and system integration.

# External Dependencies

## Database & ORM
-   **PostgreSQL**: Primary database (via Neon Database)
-   **Drizzle ORM**: Database interactions
-   **Drizzle Kit**: Schema migrations

## UI & Styling
-   **Radix UI**: Component primitives
-   **Tailwind CSS**: Styling framework
-   **Shadcn/ui**: Pre-built components
-   **Lucide React**: Icon library

## Development & Build Tools
-   **Vite**: Build tool
-   **TypeScript**: Language
-   **ESBuild**: JavaScript bundler
-   **PostCSS**: CSS processing

## File Processing & Validation
-   **Multer**: File uploads
-   **Zod**: Runtime type validation
-   **Date-fns**: Date manipulation

## Real-time & Communication
-   **WebSocket (ws)**: Real-time communication
-   **TanStack Query**: Server state management

## Session & Security
-   **Connect-pg-simple**: PostgreSQL session store
-   **Express**: Web framework

## Integrated External Systems
-   **banimal.co.za**: Centralized WordPress platform for payment processing and data synchronization.
-   **WordPress REST API**: Used for syncing products and users with `banimal.co.za` and other WordPress sites.
-   **Noodle Juice Flow controller**: Provides Replit UUIDs for integrated applications.
-   **Cloudflare Workers & R2**: HotStack™ rapid deployment system for serverless functions and object storage.

# Implementation Reference

## Ecosystem Integration Implementation

### Data Sources
-   **74 Replit Applications**: Complete list with real UUIDs, names, URLs in `server/seed-ecosystem-apps.ts`
-   **Database Schema**: `shared/schema.ts` - ecosystemSystems, ecosystemApps, ecosystemSyncLogs tables
-   **Storage Interface**: `server/storage.ts` - IStorage interface with ecosystem CRUD methods

### Backend Implementation
-   **API Routes** (8 endpoints in `server/routes.ts`):
    -   POST /api/ecosystem/sync/wordpress-products - Sync products to WordPress
    -   POST /api/ecosystem/sync/wordpress-users - Sync users to WordPress
    -   POST /api/ecosystem/sync/system - General system sync (full/incremental)
    -   GET /api/ecosystem/sync/connection-test/:id - Test WordPress connection
    -   GET /api/ecosystem/sync/stats - Sync statistics
    -   GET /api/ecosystem/systems - List system categories
    -   GET /api/ecosystem/apps - List all 74 Replit applications
    -   GET /api/ecosystem/sync-logs - Sync operation history
-   **Sync Service**: `server/ecosystem-sync-service.ts`
    -   pushProductsToWordPress() - WordPress product sync with partial success tracking
    -   pushUsersToWordPress() - WordPress user sync with individual item tracking
    -   syncSystemData() - General system sync
    -   testConnection() - Health check with latency monitoring
    -   Uses inArray() from Drizzle ORM for efficient querying
    -   Validates empty arrays, missing connections before sync
    -   Tracks individual success/failure for each item
    -   Updates connection stats (successfulSyncs, failedSyncs)

### Frontend Implementation
-   **Ecosystem Manager**: `client/src/pages/ecosystem-manager.tsx`
    -   Sync Operations tab with three sync types
    -   Real-time WebSocket listeners for sync events
    -   TanStack Query mutations for API calls
    -   Toast notifications with partial success display
    -   Color-coded sync log table (green=success, red=error, yellow=partial, blue=in-progress)

### WordPress Connection Configuration
-   **Connection Schema** (banimalConnections table):
    -   apiBaseUrl: WordPress REST API base URL (e.g., "https://banimal.co.za/wp-json/custom/v1")
    -   apiKey: Optional API key for X-API-Key header authentication
    -   status: active, inactive, error
    -   Sync stats: totalSyncs, successfulSyncs, failedSyncs, lastSyncAt
-   **Expected WordPress Endpoints**:
    -   POST {apiBaseUrl}/products - Create/update products
    -   POST {apiBaseUrl}/users - Create/update customer profiles
-   **Authentication**: X-API-Key header when apiKey configured

### Real-time Updates
-   **WebSocket Events** (broadcast from routes, handled in frontend):
    -   `ecosystem_sync_started` - Immediate notification when sync begins
    -   `ecosystem_sync_completed` - Final results with success/failure counts
    -   `ecosystem_sync_error` - Error notifications with details
    -   `sync_log_updated` - Live sync log table updates

### Sync Flow Implementation
1.  **Pre-validation** (server/routes.ts):
    -   Validate empty arrays → 400
    -   Validate connection exists using db.select().from(banimalConnections) → 404
    -   Generate sync log ID using nanoid()
2.  **Immediate Broadcast**:
    -   WebSocket broadcast({ type: 'ecosystem_sync_started', ... })
3.  **Service Execution** (server/ecosystem-sync-service.ts):
    -   Create sync log with status='pending'
    -   Fetch records using inArray(table.id, ids)
    -   Loop through items, POST to WordPress API
    -   Track individual success/failure in results array
4.  **Result Processing**:
    -   Update sync log: status, recordsSynced, errorMessage, metadata
    -   Update connection stats using db.update(banimalConnections)
    -   Broadcast ecosystem_sync_completed or ecosystem_sync_error
5.  **UI Update** (client/src/pages/ecosystem-manager.tsx):
    -   Toast notification with partial success details
    -   Sync log table updates via WebSocket listener
    -   Cache invalidation using queryClient.invalidateQueries()

## HotStack™ Cloudflare Integration

HotStack™ is a rapid deployment system built on Cloudflare Workers and R2 object storage, providing serverless compute and scalable storage for the global ecosystem.

### Data Sources
-   **Database Schema**: `shared/schema.ts` - hotstackWorkers, hotstackDeployments, hotstackR2Storage, hotstackStations tables
-   **Cloudflare Service**: `server/cloudflare-service.ts` - API wrapper for Cloudflare Workers and R2

### Backend Implementation
-   **Cloudflare Service** (`server/cloudflare-service.ts`):
    -   `getWorkers()` - Fetch all Cloudflare Workers from account
    -   `getWorkerDetails(scriptName)` - Get specific worker information
    -   `getWorkerDeployments(scriptName)` - Fetch deployment history
    -   `getR2Buckets()` - List all R2 storage buckets
    -   `getR2BucketStats(bucketName)` - Get bucket object count and storage size
    -   `syncWorkersToDb()` - Sync Cloudflare Workers to database (create/update)
    -   `syncR2BucketsToDb()` - Sync R2 bucket stats to database
    -   `trackDeployment()` - Record deployment events
    -   `testConnection()` - Health check with latency monitoring

-   **API Routes** (8 endpoints in `server/routes.ts`):
    -   GET /api/hotstack/test-connection - Test Cloudflare API connection
    -   POST /api/hotstack/sync/workers - Sync Cloudflare Workers to database
    -   POST /api/hotstack/sync/r2 - Sync R2 buckets to database
    -   GET /api/hotstack/workers - Get all workers from database
    -   GET /api/hotstack/deployments - Get deployment history
    -   GET /api/hotstack/r2-storage - Get R2 storage stats
    -   GET /api/hotstack/stations - Get HotStack stations
    -   GET /api/hotstack/stats - Dashboard statistics

### Frontend Implementation
-   **HotStack Dashboard Tab** in Ecosystem Manager (`client/src/pages/ecosystem-manager.tsx`):
    -   Real-time stats cards (Workers, Deployments, R2 Buckets, Storage)
    -   Sync operations (Workers, R2 buckets)
    -   Workers table with status badges and deployment timestamps
    -   R2 Storage table with object counts and storage sizes
    -   Connection test button with latency display

### Cloudflare Configuration
-   **Environment Variables**:
    -   `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID (ad61cfa1a84b27c62ccc5cc9d90720e)
    -   `CLOUDFLARE_API_TOKEN`: API token for authentication (required for API access)
-   **R2 Bucket Configuration**:
    -   Default bucket: `hotstack-bucket`
    -   Public URL: `https://pub-7d6d1bb543d348c03027d25831b8f8.r2.dev`

### Real-time Updates
-   **WebSocket Events**:
    -   `hotstack_sync_started` - Notification when HotStack sync begins
    -   `hotstack_sync_completed` - Results with synced count
    -   `hotstack_sync_error` - Error notifications

### Database Schema
-   **hotstackWorkers**: Tracks Cloudflare Workers (workerId, name, scriptName, status, routes, deploymentUrl)
-   **hotstackDeployments**: Deployment history (deploymentId, version, status, buildLogs, duration)
-   **hotstackR2Storage**: R2 bucket stats (bucketName, objectCount, storageSize, publicUrl)
-   **hotstackStations**: HotStack deployment stations (stationName, location, region, workersCount)