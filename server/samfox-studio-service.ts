/**
 * SamFox Studio Platform Service
 * Handles collaboration, licensing, and treaty-protected file management
 * Based on 13 Emissions specification
 */

import { db } from "./db";
import { 
  samFoxStudio, 
  collaborationWorkspaces, 
  globalMasterLicenses, 
  samFoxFileroom, 
  treatyCollaboration,
  brands
} from "@shared/schema";
import type { 
  InsertSamFoxStudio, 
  InsertCollaborationWorkspace, 
  InsertGlobalMasterLicense,
  InsertSamFoxFileroom,
  InsertTreatyCollaboration,
  SamFoxStudio,
  CollaborationWorkspace,
  GlobalMasterLicense,
  SamFoxFileroom,
  TreatyCollaboration
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export class SamFoxStudioService {
  /**
   * Initialize SamFox Studio Platform
   * Creates the main SamFox Studio brand and initial configuration
   */
  async initializeSamFoxStudio(): Promise<SamFoxStudio> {
    const [studio] = await db
      .insert(samFoxStudio)
      .values({
        brandName: "SamFox Studio™",
        treatyClass: "CreativeCommonsHybrid.Global",
        licenseType: "FAA.Master.CreativeCommonsHybrid",
        vaultLink: true,
        storagePath: "FAA.SectorFileRoot/SamFox_Studio",
        syncRate: 9,
        globalStatus: "Open for Business",
        claimStatement: "One-of-a-kind | Smart | Elegant | Globally Aligned",
        copyrightActive: true,
        treatyReady: true,
        signatory: "✨ H.S.",
        metadata: {
          initState: "Since Genesis Treaty",
          syncEngine: "FAA OmniDrop Memory Feed",
          prismLayer: "Activated",
          pulseAnimation: "Gold Thread w/ Flame Ring"
        }
      })
      .returning();

    // Create initial Global Master License
    await this.createMasterLicense({
      licenseKey: `SFS-MASTER-${nanoid(12)}`,
      samFoxStudioId: studio.id,
      licenseType: "global-master",
      licenseMatrix: {
        scope: "global",
        permissions: ["view", "collaborate", "license", "co-sign"],
        restrictions: ["treaty-protected", "copyright-assertion"],
        royaltyStructure: "disabled"
      },
      treatyClass: "CreativeCommonsHybrid.Global",
      copyrightAssertion: true,
      ipRegistryVerified: true,
      faaVerified: true,
      globalScope: true
    });

    return studio;
  }

  /**
   * Get SamFox Studio instance (singleton pattern)
   */
  async getSamFoxStudio(): Promise<SamFoxStudio | null> {
    const [studio] = await db
      .select()
      .from(samFoxStudio)
      .limit(1);
    
    return studio || null;
  }

  /**
   * Create Collaboration Workspace
   */
  async createWorkspace(data: Omit<InsertCollaborationWorkspace, 'id'>): Promise<CollaborationWorkspace> {
    const [workspace] = await db
      .insert(collaborationWorkspaces)
      .values({
        ...data,
        metadata: {
          ...data.metadata,
          initTimestamp: new Date().toISOString(),
          faaClassTag: "✨ FAA-CLASS-BRND-321/SFS"
        }
      })
      .returning();

    return workspace;
  }

  /**
   * Get all collaboration workspaces
   */
  async getWorkspaces(samFoxStudioId?: string): Promise<CollaborationWorkspace[]> {
    const query = db.select().from(collaborationWorkspaces);
    
    if (samFoxStudioId) {
      return await query.where(eq(collaborationWorkspaces.samFoxStudioId, samFoxStudioId));
    }
    
    return await query.orderBy(desc(collaborationWorkspaces.createdAt));
  }

  /**
   * Create Global Master License
   */
  async createMasterLicense(data: Omit<InsertGlobalMasterLicense, 'id'>): Promise<GlobalMasterLicense> {
    const [license] = await db
      .insert(globalMasterLicenses)
      .values({
        ...data,
        metadata: {
          ...data.metadata,
          issuedTimestamp: new Date().toISOString(),
          faaVerificationDate: new Date().toISOString(),
          treatyBindingLevel: "Sealed"
        }
      })
      .returning();

    return license;
  }

  /**
   * Get all master licenses
   */
  async getMasterLicenses(samFoxStudioId?: string): Promise<GlobalMasterLicense[]> {
    const query = db.select().from(globalMasterLicenses);
    
    if (samFoxStudioId) {
      return await query.where(eq(globalMasterLicenses.samFoxStudioId, samFoxStudioId));
    }
    
    return await query.orderBy(desc(globalMasterLicenses.issuedAt));
  }

  /**
   * Upload file to SamFox Fileroom
   */
  async uploadToFileroom(data: Omit<InsertSamFoxFileroom, 'id'>): Promise<SamFoxFileroom> {
    const [file] = await db
      .insert(samFoxFileroom)
      .values({
        ...data,
        omniDropSynced: true,
        autoFiled: true,
        syncEngine: "FAA OmniDrop Memory Feed",
        metadata: {
          ...data.metadata,
          uploadTimestamp: new Date().toISOString(),
          faaVaultSync: true,
          pulseRate: "9-second-sync"
        }
      })
      .returning();

    return file;
  }

  /**
   * Get fileroom contents
   */
  async getFileroom(samFoxStudioId?: string, fileType?: string): Promise<SamFoxFileroom[]> {
    let query = db.select().from(samFoxFileroom);
    
    const conditions = [];
    if (samFoxStudioId) {
      conditions.push(eq(samFoxFileroom.samFoxStudioId, samFoxStudioId));
    }
    if (fileType) {
      conditions.push(eq(samFoxFileroom.fileType, fileType));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(samFoxFileroom.createdAt));
  }

  /**
   * Create Treaty Collaboration
   */
  async createTreaty(data: Omit<InsertTreatyCollaboration, 'id'>): Promise<TreatyCollaboration> {
    const treatyId = `SFS-TREATY-${nanoid(8)}`;
    
    const [treaty] = await db
      .insert(treatyCollaboration)
      .values({
        ...data,
        treatyId,
        faaClassTag: "✨ FAA-CLASS-BRND-321/SFS",
        metadata: {
          ...data.metadata,
          treatyInitialized: new Date().toISOString(),
          sealedTreatyLaw: true,
          courtesyProtocol: "Active"
        }
      })
      .returning();

    return treaty;
  }

  /**
   * Sign/Activate Treaty
   */
  async signTreaty(treatyId: string): Promise<TreatyCollaboration | null> {
    const [treaty] = await db
      .update(treatyCollaboration)
      .set({
        status: "signed",
        signedAt: new Date(),
        metadata: {
          treatySigned: new Date().toISOString(),
          covenantConfirmed: true,
          vaultMeshExpanded: true
        }
      })
      .where(eq(treatyCollaboration.treatyId, treatyId))
      .returning();

    return treaty || null;
  }

  /**
   * Get all treaties
   */
  async getTreaties(samFoxStudioId?: string): Promise<TreatyCollaboration[]> {
    const query = db.select().from(treatyCollaboration);
    
    if (samFoxStudioId) {
      return await query.where(eq(treatyCollaboration.samFoxStudioId, samFoxStudioId));
    }
    
    return await query.orderBy(desc(treatyCollaboration.createdAt));
  }

  /**
   * Sync with FAA Vault System (9-second pulse)
   */
  async syncWithVault(samFoxStudioId: string): Promise<{
    vaultStatus: string;
    meshStatus: string;
    pulseSync: string;
    lastSync: string;
  }> {
    // Update sync timestamp for all SamFox Studio entities
    await Promise.all([
      db.update(samFoxStudio)
        .set({ updatedAt: new Date() })
        .where(eq(samFoxStudio.id, samFoxStudioId)),
      
      db.update(collaborationWorkspaces)
        .set({ updatedAt: new Date() })
        .where(eq(collaborationWorkspaces.samFoxStudioId, samFoxStudioId)),
      
      db.update(samFoxFileroom)
        .set({ updatedAt: new Date() })
        .where(eq(samFoxFileroom.samFoxStudioId, samFoxStudioId))
    ]);

    return {
      vaultStatus: "Active",
      meshStatus: "Expanded",
      pulseSync: "9-second-sync",
      lastSync: new Date().toISOString()
    };
  }

  /**
   * Get SamFox Studio Dashboard Stats
   */
  async getDashboardStats(samFoxStudioId: string): Promise<{
    totalWorkspaces: number;
    totalLicenses: number;
    totalFiles: number;
    totalTreaties: number;
    activeTreaties: number;
    vaultSyncStatus: string;
  }> {
    const [
      workspaces,
      licenses,
      files,
      treaties,
      activeTreaties
    ] = await Promise.all([
      db.select().from(collaborationWorkspaces)
        .where(eq(collaborationWorkspaces.samFoxStudioId, samFoxStudioId)),
      
      db.select().from(globalMasterLicenses)
        .where(eq(globalMasterLicenses.samFoxStudioId, samFoxStudioId)),
      
      db.select().from(samFoxFileroom)
        .where(eq(samFoxFileroom.samFoxStudioId, samFoxStudioId)),
      
      db.select().from(treatyCollaboration)
        .where(eq(treatyCollaboration.samFoxStudioId, samFoxStudioId)),
      
      db.select().from(treatyCollaboration)
        .where(and(
          eq(treatyCollaboration.samFoxStudioId, samFoxStudioId),
          eq(treatyCollaboration.status, "active")
        ))
    ]);

    return {
      totalWorkspaces: workspaces.length,
      totalLicenses: licenses.length,
      totalFiles: files.length,
      totalTreaties: treaties.length,
      activeTreaties: activeTreaties.length,
      vaultSyncStatus: "Online"
    };
  }
}

export const samFoxStudioService = new SamFoxStudioService();