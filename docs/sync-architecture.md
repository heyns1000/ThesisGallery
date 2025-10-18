# Cross-App Synchronization Architecture

## Overview

The Fruitful Global Master Hub implements a **push-based synchronization model** for distributing data across the distributed FAA.zone™ ecosystem comprising Fruitful (Primary Hub), Samfox (Repository System), and Banimal (Brand Management).

## Synchronization Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Fruitful  │◄──►│   Samfox    │◄──►│   Banimal   │
│   (Master)  │    │(Repository) │    │  (Brands)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ├─── Asset Sync ────┤                   │
       ├─── Data Sync ─────┼─── Brand Sync ────┤
       └─── State Sync ────┼─── Compliance ────┤
                           └─── Archives ──────┘
```

## Sync Event Types

| Event Type | Priority | Frequency | Description |
|------------|----------|-----------|-------------|
| `asset_update` | Medium | Hourly | File changes, new uploads to attached_assets/ |
| `brand_change` | High | Realtime | Brand metrics, status updates (7,038+ brands) |
| `sector_sync` | Low | Daily | Sector operational changes (33 sectors, 1,406 brands) |
| `treaty_binding` | High | Realtime | Legal/compliance updates (TreatyMesh™ protocols) |
| `scroll_deployment` | Medium | Hourly | New scroll activations (Seedwave scrolls) |
| `system_health` | Medium | Realtime | Infrastructure status monitoring |
| `emergency_sync` | High | Immediate | Critical system updates |

## Cross-App Dependencies

### Fruitful → Banimal (High Criticality, Realtime)
- **Data Types**: brand_metrics, sector_status, treaty_scrolls
- **Description**: Real-time brand metrics and compliance synchronization
- **Volume**: 7,038+ brands across 48+ sectors

### Fruitful → Samfox (Medium Criticality, Hourly)
- **Data Types**: asset_manifest, file_hashes, scroll_definitions
- **Description**: Asset and scroll repository synchronization
- **Volume**: 1,247 files (861.42 MB), deployment tracking

### Fruitful → All Apps (Variable Criticality)
- **Data Types**: system_health, emergency_sync
- **Description**: Infrastructure monitoring and critical updates
- **Frequency**: Realtime

## Conflict Resolution Protocol

**Priority Order:**
1. **Fruitful Master** - Final authority for system-wide decisions
2. **Banimal Brands** - Authority for brand-specific data
3. **Samfox Repository** - Authority for asset versioning
4. **Timestamp-based** - Most recent update wins for equivalent priority

## Failure Recovery

### Automatic Recovery
- Connection retry with exponential backoff
- Local cache utilization during outages
- Graceful degradation of non-critical features
- Queue-based sync resumption

### Manual Recovery
- Full system resync procedures (via `/api/sync/resync` endpoint)
- Data integrity verification scripts
- Emergency rollback protocols
- Cross-app consistency checks

## Database Schema

### syncEvents Table

| Column | Type | Description |
|--------|------|-------------|
| id | serial | Primary key |
| eventType | varchar(50) | Event type (see Sync Event Types above) |
| source | varchar(100) | Source application |
| target | text[] | Array of target applications |
| payload | jsonb | Event-specific data payload |
| priority | integer | 1=high, 2=medium, 3=low |
| status | varchar(50) | pending, processing, completed, failed |
| checksum | varchar(64) | Data integrity verification |
| processedAt | timestamp | When event was processed |
| createdAt | timestamp | When event was created |

### API Endpoints

- `GET /api/sync/events` - List sync events
- `POST /api/sync/events` - Create sync event
- `GET /api/sync/pending` - Get pending sync events
- `PUT /api/sync/events/:id` - Update sync event status

## Implementation Status

✅ **Phase 5.1 Complete**: Asset Manifest System  
✅ **Phase 5.2 Complete**: KeyVault Service  
✅ **Phase 5.3 Complete**: Sync Event Schema & Documentation  
⏳ **Future**: WebSocket-based realtime sync implementation  
⏳ **Future**: Cross-app API authentication  
⏳ **Future**: Sync monitoring dashboard  

## Security Considerations

- All sync endpoints protected with `isAuthenticated` middleware
- Event payloads encrypted for sensitive data
- Audit logging for all cross-app data transfers
- Rate limiting on sync endpoints to prevent abuse
- Checksum validation for data integrity

## Monitoring

**Key Metrics to Monitor:**
- Sync event processing latency
- Failed sync event count
- Cross-app connection health
- Asset synchronization status
- Brand data consistency rate

## Future Enhancements

1. **WebSocket Integration** - Real-time bidirectional sync
2. **Sync Dashboard** - Visual monitoring of cross-app health
3. **Automated Testing** - E2E tests for sync flows
4. **Conflict Resolution UI** - Manual intervention for edge cases
5. **Performance Optimization** - Batch processing, compression

---

**Last Updated**: Phase 5.3 completion  
**Architecture Owner**: Fruitful Global Master Hub Team
