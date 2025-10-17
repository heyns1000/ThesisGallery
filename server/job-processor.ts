import { db } from "./db";
import { deploymentJobs } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import type { DeploymentJob } from "@shared/schema";

type BroadcastFunction = (message: any) => void;

export class JobProcessor {
  private broadcast: BroadcastFunction;
  private processingJobId: string | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  constructor(broadcast: BroadcastFunction) {
    this.broadcast = broadcast;
  }

  startAutoProcessing() {
    this.checkInterval = setInterval(() => {
      if (!this.processingJobId) {
        this.checkForPendingJobs();
      }
    }, 2000);
  }

  stopAutoProcessing() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkForPendingJobs() {
    try {
      const pendingJobs = await db
        .select()
        .from(deploymentJobs)
        .where(eq(deploymentJobs.status, "pending"))
        .limit(1);

      if (pendingJobs.length > 0) {
        await this.processDeploymentJob(pendingJobs[0].id);
      }
    } catch (error) {
      console.error("Error checking for pending jobs:", error);
    }
  }

  async processDeploymentJob(jobId: string) {
    try {
      const job = await db
        .select()
        .from(deploymentJobs)
        .where(eq(deploymentJobs.id, jobId))
        .limit(1);

      if (!job || job.length === 0) {
        throw new Error(`Job ${jobId} not found`);
      }

      const currentJob = job[0];

      if (this.processingJobId) {
        console.log(`Already processing job ${this.processingJobId}, skipping ${jobId}`);
        return;
      }

      this.processingJobId = jobId;

      await this.updateJobProgress(jobId, 0, "processing", currentJob.status);

      this.broadcast({
        type: "job_started",
        data: {
          jobId,
          jobType: currentJob.jobType,
          status: "processing",
          progress: 0,
        },
      });

      let result;

      switch (currentJob.jobType) {
        case "deploy":
          result = await this.processHotStackDeploy(currentJob.payload as any);
          break;
        case "process":
          result = await this.processDataProcessing(currentJob.payload as any);
          break;
        case "sync":
          result = await this.processSyncJob(currentJob.payload as any);
          break;
        default:
          throw new Error(`Unknown job type: ${currentJob.jobType}`);
      }

      await db
        .update(deploymentJobs)
        .set({
          status: "completed",
          progress: 100,
          result,
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(deploymentJobs.id, jobId));

      this.broadcast({
        type: "job_completed",
        data: {
          jobId,
          jobType: currentJob.jobType,
          status: "completed",
          progress: 100,
          result,
        },
      });
    } catch (error: any) {
      console.error(`Error processing job ${jobId}:`, error);

      await db
        .update(deploymentJobs)
        .set({
          status: "failed",
          error: error.message || "Unknown error",
          completedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(deploymentJobs.id, jobId));

      this.broadcast({
        type: "job_failed",
        data: {
          jobId,
          status: "failed",
          error: error.message || "Unknown error",
        },
      });
    } finally {
      this.processingJobId = null;
    }
  }

  async processHotStackDeploy(payload: any): Promise<any> {
    const totalSteps = 10;
    const stepDuration = 18000;

    for (let step = 1; step <= totalSteps; step++) {
      const progress = Math.floor((step / totalSteps) * 100);
      
      await this.updateJobProgress(
        this.processingJobId!,
        progress,
        "processing"
      );

      this.broadcast({
        type: "job_progress",
        data: {
          jobId: this.processingJobId,
          progress,
          status: "processing",
          message: `Deploying step ${step}/${totalSteps}...`,
        },
      });

      await this.sleep(stepDuration);
    }

    return {
      success: true,
      deploymentUrl: `https://hotstack-${Date.now()}.workers.dev`,
      workerId: payload.workerId || `worker-${Date.now()}`,
      version: payload.version || "1.0.0",
      completedAt: new Date().toISOString(),
    };
  }

  async processDataProcessing(payload: any): Promise<any> {
    const totalRecords = payload.totalRecords || 1000;
    const batchSize = 100;
    const batches = Math.ceil(totalRecords / batchSize);

    for (let batch = 1; batch <= batches; batch++) {
      const progress = Math.floor((batch / batches) * 100);
      
      await this.updateJobProgress(
        this.processingJobId!,
        progress,
        "processing"
      );

      this.broadcast({
        type: "job_progress",
        data: {
          jobId: this.processingJobId,
          progress,
          status: "processing",
          message: `Processing batch ${batch}/${batches}...`,
        },
      });

      await this.sleep(1000);
    }

    return {
      success: true,
      recordsProcessed: totalRecords,
      batchesCompleted: batches,
      completedAt: new Date().toISOString(),
    };
  }

  async processSyncJob(payload: any): Promise<any> {
    const syncSteps = ["Connecting", "Fetching data", "Validating", "Syncing", "Verifying"];

    for (let i = 0; i < syncSteps.length; i++) {
      const progress = Math.floor(((i + 1) / syncSteps.length) * 100);
      
      await this.updateJobProgress(
        this.processingJobId!,
        progress,
        "processing"
      );

      this.broadcast({
        type: "job_progress",
        data: {
          jobId: this.processingJobId,
          progress,
          status: "processing",
          message: syncSteps[i],
        },
      });

      await this.sleep(5000);
    }

    return {
      success: true,
      recordsSynced: payload.recordCount || 500,
      syncType: payload.syncType || "full",
      completedAt: new Date().toISOString(),
    };
  }

  async updateJobProgress(
    jobId: string,
    progress: number,
    status: "pending" | "processing" | "completed" | "failed",
    previousStatus?: string
  ) {
    const updates: any = {
      status,
      progress,
      updatedAt: new Date()
    };

    if (status === "processing") {
      await db.update(deploymentJobs)
        .set({ startedAt: sql`NOW()` })
        .where(and(
          eq(deploymentJobs.id, jobId),
          sql`deployment_jobs.started_at IS NULL`
        ));
    }

    await db
      .update(deploymentJobs)
      .set(updates)
      .where(eq(deploymentJobs.id, jobId));
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export let jobProcessor: JobProcessor | null = null;

export function initializeJobProcessor(broadcast: BroadcastFunction) {
  jobProcessor = new JobProcessor(broadcast);
  jobProcessor.startAutoProcessing();
  console.log("✅ Job processor initialized with auto-processing");
  return jobProcessor;
}
