# HSOMNI9000 Global Sync Instructions
*Comprehensive Distributed Creative Ecosystem Integration Guide*

## 🌐 System Overview

HSOMNI9000 is a distributed creative ecosystem integrating 8 core applications with centralized asset management, shared API key distribution, and real-time cross-app synchronization across the Lions deployment architecture.

### Core Applications Architecture

```
HSOMNI9000 Distributed System
├── Fruitful (Main Ecosystem Hub)
├── Samfox (Creative Studio)
├── Banimal (Toys & Charitable Giving)
├── VaultMesh (Trading & Financial Systems)
├── HotStack (Code Hosting & Infrastructure)
├── SecureSign (Legal Document Management)
├── OmniGrid/FAA.Zone (Infrastructure Control)
└── BuildNest (Development & Construction)
```

## 🔑 Centralized API Key Distribution

### Primary Configuration Hub: `shared/api-config.ts`

**Environment Variables Required Across All Apps:**

```typescript
// Core Infrastructure
DATABASE_URL              // PostgreSQL connection
SESSION_SECRET           // Session encryption
REPLIT_DOMAINS          // Deployment domains
REPL_ID                 // Replit app identifier

// Payment Systems (VaultMesh, Fruitful)
PAYPAL_CLIENT_ID        // PayPal integration
PAYPAL_CLIENT_SECRET    // PayPal private key

// Firebase (Omnigrid, Fruitful, SecureSign)
VITE_FIREBASE_API_KEY           // Firebase public key
VITE_FIREBASE_AUTH_DOMAIN       // Firebase auth domain
VITE_FIREBASE_PROJECT_ID        // Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET    // Firebase storage
VITE_FIREBASE_MESSAGING_SENDER_ID // Firebase messaging
VITE_FIREBASE_APP_ID            // Firebase app ID
VITE_FIREBASE_MEASUREMENT_ID    // Firebase analytics

// Music Integration (Samfox, Fruitful)
SPOTIFY_CLIENT_ID       // Spotify API access
SPOTIFY_CLIENT_SECRET   // Spotify private key
SPOTIFY_REDIRECT_URI    // OAuth callback

// Accounting Systems (All Apps)
XERO_CLIENT_ID          // Xero accounting API
XERO_CLIENT_SECRET      // Xero private key
XERO_REDIRECT_URI       // Xero OAuth callback

// Object Storage (Asset Management)
DEFAULT_OBJECT_STORAGE_BUCKET_ID // Asset storage bucket
PRIVATE_OBJECT_DIR              // Private files directory
PUBLIC_OBJECT_SEARCH_PATHS      // Public asset paths

// Database Credentials
PGHOST                  // PostgreSQL host
PGPORT                  // PostgreSQL port
PGUSER                  // PostgreSQL username
PGPASSWORD              // PostgreSQL password
PGDATABASE              // PostgreSQL database name
```

### API Key Distribution Strategy

1. **Central Configuration**: All API keys managed in `shared/api-config.ts`
2. **Environment-Based**: Production vs Sandbox switching
3. **Service Health Monitoring**: Real-time credential validation
4. **Client-Safe Distribution**: Public keys only to frontend

## 📁 Asset Management System

### Current Asset Structure (attached_assets/)

**Organized by Application:**

```
attached_assets/
├── Banimal_*                    # Banimal toys & charity assets
│   ├── Banimal_company_profile_*.pdf
│   ├── Banimal_Soft_toys_BIG_*.pdf
│   ├── Banimal_vinyl_v02_*.pdf
│   └── Banimal_web_banners-01_*.png
├── Sam_fox_logo_v02_*.jpg       # Samfox creative studio branding
├── Samfox_shirts_*.pdf         # Samfox merchandise
├── FRUITFUL_King_Price_*.pdf    # Fruitful insurance documents
├── FAA Quantum Nexus_*.pdf     # OmniGrid/FAA.Zone documentation
├── Baobab_Security_Network_Video_Ready_*.mp4  # Security assets
└── Creative_Assets/             # Shared creative resources
    ├── 1st_eye_*.png            # Eye tracking assets
    ├── Chief_02_*.png           # Character designs
    ├── Monster_01_*.png         # Game assets
    ├── Nikon_*.png              # Equipment assets
    └── Bearly_*.psd             # Design files
```

### Asset Distribution Strategy

**Database Schema Integration:**
- `heritageDocuments`: Legal & historical documents
- `mediaProjects`: Video & audio processing files
- `portfolioProjects`: Creative showcase assets
- `documentTemplates`: Reusable content templates

**Access Patterns:**
- **Public Assets**: Served via `/public-objects/` endpoint
- **Private Assets**: Authenticated access via `/objects/` with ACL
- **Cross-App Assets**: Shared via centralized object storage

## 🔄 Real-Time Synchronization Architecture

### Global Sync Hook: `client/src/hooks/useGlobalSync.ts`

**Synchronization Strategy:**
- **Interval**: 3-second automatic sync cycles
- **Scope**: All critical endpoints across applications
- **Method**: React Query cache invalidation
- **Fallback**: Manual force-sync capability

**Synchronized Endpoints:**
```typescript
const syncEndpoints = [
  '/api/sectors',              // Brand categorization
  '/api/brands',               // Brand database
  '/api/dashboard/stats',      // Real-time metrics
  '/api/system-status',        // Service health
  '/api/admin-panel/stats',    // Administrative data
  '/api/admin-panel/brands',   # Brand management
  '/api/admin-panel/sector-breakdown',  // Sector analytics
  '/api/sync/complete-sync'    // Full system sync
];
```

### Cross-App Communication Flow

```mermaid
graph TD
    A[Fruitful Hub] --> B[Integration Manager]
    B --> C[Samfox Creative]
    B --> D[Banimal Charity]
    B --> E[VaultMesh Trading]
    B --> F[HotStack Infrastructure]
    B --> G[SecureSign Legal]
    B --> H[OmniGrid FAA.Zone]
    B --> I[BuildNest Development]
    
    J[Global Sync Hook] --> B
    K[Shared Database] --> A
    L[Asset Storage] --> All Apps
```

## 🚀 Deployment Instructions by Application

### 1. Fruitful (Main Ecosystem Hub)
**Repository**: Current (main app)
**Dependencies**: All API keys, complete asset access
**Deployment Command**: `npm run dev`
**Port**: 5000 (primary)
**Database**: PostgreSQL with full schema

### 2. Samfox (Creative Studio)
**Purpose**: Creative content generation and design
**Required Assets**: 
- `Sam_fox_logo_v02_*.jpg`
- `Samfox_shirts_*.pdf`
- `Bearly_*.psd`, `Chief_02_*.png`, `Monster_01_*.png`
**API Dependencies**: Firebase, Spotify, Object Storage
**Database Tables**: `artworks`, `studioSettings`, `portfolioProjects`

### 3. Banimal (Toys & Charitable Giving)
**Purpose**: Toy manufacturing and charity management
**Required Assets**:
- `Banimal_*` (all company assets)
- Product design files and marketing materials
**API Dependencies**: PayPal, Xero, Object Storage
**Database Tables**: `banimalTransactions`, `charitableDistributions`

### 4. VaultMesh (Trading & Financial Systems)
**Purpose**: Financial trading and portfolio management
**Required Assets**: Financial documentation, security certificates
**API Dependencies**: PayPal, Xero, Firebase
**Database Tables**: `vaultActions`, `payments`, `financialRecords`

### 5. HotStack (Code Hosting & Infrastructure)
**Purpose**: Code repository hosting and CI/CD
**Required Assets**: Development documentation, deployment guides
**API Dependencies**: Firebase, Object Storage
**Database Tables**: `repositories`, `deployments`, `systemStatus`

### 6. SecureSign (Legal Document Management)
**Purpose**: Legal document processing and NDA management
**Required Assets**: 
- `FRUITFUL_King_Price_*.pdf`
- `Change_*.docx`
- Legal templates and contracts
**API Dependencies**: Firebase, Object Storage
**Database Tables**: `legalDocuments`, `secureSignApiKeys`, `documentTemplates`

### 7. OmniGrid/FAA.Zone (Infrastructure Control)
**Purpose**: Infrastructure monitoring and quantum protocols
**Required Assets**:
- `FAA Quantum Nexus_*.pdf`
- `Baobab_Security_Network_Video_Ready_*.mp4`
**API Dependencies**: All (master control)
**Database Tables**: `sonicGridConnections`, `interstellarNodes`, `globalLogicConfigs`

### 8. BuildNest (Development & Construction)
**Purpose**: Project management and development tools
**Required Assets**: Project documentation, construction plans
**API Dependencies**: Firebase, Xero, Object Storage
**Database Tables**: `projects`, `resources`, `buildPhases`

## 🔧 Integration Manager Service

### Service Health Monitoring

**Integration Manager**: `server/services/integration-manager.ts`

**Monitored Services:**
- PayPal (Payment Processing)
- Firebase (Authentication & Storage)
- Spotify (Music Integration)
- Xero (Accounting & Financial)

**Health Check Endpoints:**
- `/api/services/health` - Overall system health
- `/api/services/paypal/status` - PayPal connectivity
- `/api/services/firebase/status` - Firebase status
- `/api/services/spotify/status` - Spotify API status
- `/api/services/xero/status` - Xero integration status

## 🛠️ Lions Deployment Architecture

### Deployment Sequence

1. **Phase 1**: Deploy Fruitful (Main Hub)
   - Establish database and core services
   - Initialize asset storage and API configurations
   - Verify authentication and core functionality

2. **Phase 2**: Deploy Infrastructure Apps
   - OmniGrid/FAA.Zone (Infrastructure control)
   - HotStack (Code hosting and CI/CD)
   - SecureSign (Legal and security)

3. **Phase 3**: Deploy Creative & Financial Apps
   - Samfox (Creative studio)
   - VaultMesh (Trading systems)
   - BuildNest (Development tools)

4. **Phase 4**: Deploy Specialized Apps
   - Banimal (Toys and charity)

### Cross-Deployment Synchronization

**Shared Resources:**
- Single PostgreSQL database (shared across all apps)
- Centralized object storage (shared asset access)
- Unified authentication (Replit Auth)
- Global API key distribution

**Synchronization Points:**
- Real-time data sync every 3 seconds
- Cross-app authentication sharing
- Shared asset management
- Unified health monitoring

## 📊 Database Schema Dependencies

### Core Tables Shared Across Apps

```sql
-- Authentication (All Apps)
users, sessions

-- Core Business (Fruitful, Samfox, Banimal)
sectors, brands, adminPanelBrands

-- Financial (VaultMesh, Banimal, All)
payments, banimalTransactions, charitableDistributions

-- Legal & Security (SecureSign, All)
legalDocuments, secureSignApiKeys, documentTemplates

-- Creative & Media (Samfox, Fruitful)
artworks, portfolioProjects, studioSettings, mediaProjects

-- Infrastructure (OmniGrid, HotStack)
systemStatus, repositories, sonicGridConnections, interstellarNodes

-- Development (BuildNest, HotStack)
processingEngines, globalLogicConfigs

-- Heritage & Family (Specialized)
familyMembers, heritageDocuments, familyEvents, heritageMetrics
```

## 🔐 Security & Access Control

### Authentication Flow
1. **Replit Auth**: Single sign-on across all applications
2. **Session Sharing**: Unified session management
3. **API Key Security**: Environment-based secret management
4. **Asset Access**: ACL-based file permissions

### Data Protection
- **Database**: PostgreSQL with connection pooling
- **Assets**: Object storage with access control
- **API Keys**: Environment variable isolation
- **Sessions**: Database-backed session store

## 🚦 Monitoring & Health Checks

### System Status Monitoring
- **Service Health**: Real-time API connectivity
- **Database Status**: Connection and performance
- **Asset Availability**: Storage system health
- **Sync Status**: Cross-app synchronization monitoring

### Error Handling
- **Graceful Degradation**: Service failure handling
- **Retry Logic**: Automatic retry mechanisms
- **Error Logging**: Comprehensive error tracking
- **Alert System**: Critical failure notifications

## 🎯 Implementation Checklist

### Pre-Deployment
- [ ] Environment variables configured for all services
- [ ] Database schema synchronized across environments
- [ ] Asset storage buckets created and configured
- [ ] API keys validated and tested
- [ ] Health check endpoints verified

### Deployment Verification
- [ ] All applications deploy successfully
- [ ] Cross-app authentication working
- [ ] Real-time sync functioning (3-second intervals)
- [ ] Asset access verified across all apps
- [ ] Financial integrations tested (PayPal, Xero)
- [ ] Creative tools functional (Firebase, Spotify)

### Post-Deployment Monitoring
- [ ] System health dashboards active
- [ ] Performance metrics tracking
- [ ] Error rate monitoring
- [ ] User authentication flow verified
- [ ] Cross-app data consistency confirmed

---

**Last Updated**: January 25, 2025
**Architecture Version**: HSOMNI9000 v1.0
**Deployment Target**: Lions Architecture - Distributed Creative Ecosystem