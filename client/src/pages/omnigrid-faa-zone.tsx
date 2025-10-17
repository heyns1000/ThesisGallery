import { OmniGridFAAZone } from "@/components/portal/omnigrid-faa-zone";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function OmniGridFAAZonePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6" data-testid="omnigrid-faa-zone-page">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2" data-testid="button-back-home">
              <ArrowLeft className="w-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3" data-testid="title-omnigrid">
              🌐 OmniGrid™ FAA.zone™
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Universal Interconnected Network with PulseTrade™ System Override Grid, VaultMesh™ Infrastructure & Atom-Level Engines
            </p>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <OmniGridFAAZone />
    </div>
  );
}
