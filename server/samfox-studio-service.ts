/**
 * SamFox Studio Platform Service
 * Handles collaboration, licensing, and treaty-protected file management
 * Based on 13 Emissions specification
 */

import { db } from "./db";
import { 
  samFoxStudio, 
  samFoxWorkspaces, 
  samFoxMasterLicenses, 
  samFoxFileroom, 
  samFoxTreatyCollaborations,
  brands
} from "@shared/schema";
import type { 
  InsertSamFoxStudio, 
  InsertSamFoxWorkspace, 
  InsertSamFoxMasterLicense,
  InsertSamFoxFileroom,
  InsertSamFoxTreatyCollaboration,
  SamFoxStudio,
  SamFoxWorkspace,
  SamFoxMasterLicense,
  SamFoxFileroom,
  SamFoxTreatyCollaboration
} from "@shared/schema";
import { eq, and, desc, count } from "drizzle-orm";
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
  async createWorkspace(data: Omit<InsertSamFoxWorkspace, 'id'>): Promise<SamFoxWorkspace> {
    const [workspace] = await db
      .insert(samFoxWorkspaces)
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
  async getWorkspaces(): Promise<SamFoxWorkspace[]> {
    return await db.select().from(samFoxWorkspaces).orderBy(desc(samFoxWorkspaces.createdAt));
  }

  /**
   * Create Global Master License
   */
  async createMasterLicense(data: Omit<InsertSamFoxMasterLicense, 'id'>): Promise<SamFoxMasterLicense> {
    const [license] = await db
      .insert(samFoxMasterLicenses)
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
  async getMasterLicenses(): Promise<SamFoxMasterLicense[]> {
    return await db.select().from(samFoxMasterLicenses).orderBy(desc(samFoxMasterLicenses.issuedAt));
  }

  /**
   * Upload file to SamFox Fileroom
   */
  async uploadToFileroom(data: Omit<InsertSamFoxFileroom, 'id'>): Promise<SamFoxFileroom> {
    const [file] = await db
      .insert(samFoxFileroom)
      .values({
        ...data,
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
  async getFileroom(fileType?: string): Promise<SamFoxFileroom[]> {
    let query = db.select().from(samFoxFileroom);
    
    if (fileType) {
      query = query.where(eq(samFoxFileroom.type, fileType));
    }
    
    return await query.orderBy(desc(samFoxFileroom.createdAt));
  }

  /**
   * Create Treaty Collaboration
   */
  async createTreaty(data: Omit<InsertSamFoxTreatyCollaboration, 'id'>): Promise<SamFoxTreatyCollaboration> {
    const [treaty] = await db
      .insert(samFoxTreatyCollaborations)
      .values({
        ...data,
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
  async signTreaty(treatyId: string): Promise<SamFoxTreatyCollaboration | null> {
    const [treaty] = await db
      .update(samFoxTreatyCollaborations)
      .set({
        status: "sealed",
        metadata: {
          treatySigned: new Date().toISOString(),
          covenantConfirmed: true,
          vaultMeshExpanded: true
        }
      })
      .where(eq(samFoxTreatyCollaborations.treatyId, treatyId))
      .returning();

    return treaty || null;
  }

  /**
   * Get all treaties
   */
  async getTreaties(): Promise<SamFoxTreatyCollaboration[]> {
    return await db.select().from(samFoxTreatyCollaborations).orderBy(desc(samFoxTreatyCollaborations.createdAt));
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
    // Update sync timestamp for SamFox Studio
    await db.update(samFoxStudio)
      .set({ updatedAt: new Date() })
      .where(eq(samFoxStudio.id, samFoxStudioId));

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
    // Fetch all data - NEW schema tables don't have samFoxStudioId foreign key
    const [
      workspaces,
      licenses,
      files,
      treaties
    ] = await Promise.all([
      db.select().from(samFoxWorkspaces),
      db.select().from(samFoxMasterLicenses),
      db.select().from(samFoxFileroom),
      db.select().from(samFoxTreatyCollaborations)
    ]);

    // Count active/sealed treaties
    const activeTreaties = treaties.filter(t => 
      t.status === 'active' || t.status === 'sealed'
    );

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