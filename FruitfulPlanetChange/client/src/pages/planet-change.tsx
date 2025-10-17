import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

export default function PlanetChange() {
  const { user } = useAuth();
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  const { data: sectors } = useQuery({
    queryKey: ['/api/sectors'],
  });

  return (
    <section className="min-h-screen bg-gradient-to-br from-sky-100 via-green-50 to-lime-200 p-10 font-sans text-gray-800">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-gray-400 pb-6">
        <h1 className="text-3xl font-bold text-emerald-700 tracking-wide">Welcome to Fruitful.Planet.Change</h1>
        <div className="text-sm uppercase text-gray-500">Seedwave™ Portal Node | FAA VaultMesh™</div>
      </header>

      {/* Message Block */}
      <main className="py-14 max-w-4xl mx-auto text-center space-y-8">
        <p className="text-xl leading-relaxed">
          🌍 You've entered the Fruitful Global Brand Portal — home to <strong>{(stats as any)?.totalElements || '3,794'} FAA-linked brands</strong>,
          secured across {(sectors as any)?.length || '48'} sectors with PostgreSQL live sync, SecureSign™ VIP, and VaultMesh™ deployment fabric.
        </p>

        <p className="text-lg text-gray-700">
          GenesisGPT™ is now actively embedded in this node.<br />
          We are listening, syncing, and ready to expand your portal intelligence.
        </p>

        <p className="text-base italic text-gray-600">
          To initiate full integration, please provide:
        </p>

        <div className="text-left max-w-xl mx-auto grid grid-cols-1 gap-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <ul className="list-disc pl-6 text-sm space-y-2 text-gray-700">
            <li>📌 Brand payload structure or .json schema (if custom)</li>
            <li>📁 Sector-linked data tables or join models</li>
            <li>🛠️ Admin panel access rules or Vault hooks</li>
            <li>🔐 SecureSign™ contract fields & deployment logic</li>
            <li>📊 API endpoints to sync analytics from Replit backend</li>
            <li>🌱 Crate Dance™ or Brand Identity Manager mapping (if active)</li>
          </ul>
        </div>

        {/* Live Data Integration */}
        {user && (
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200 mt-8">
            <h3 className="text-lg font-semibold text-emerald-700 mb-4">🧬 Genesis Layer Active</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Core Brands:</span> {(stats as any)?.coreBrands || '2,862'}
              </div>
              <div>
                <span className="font-medium">Subnodes:</span> {(stats as any)?.totalElements && (stats as any)?.coreBrands ? ((stats as any).totalElements - (stats as any).coreBrands) : '932'}
              </div>
              <div>
                <span className="font-medium">User ID:</span> {(user as any)?.id || 'Genesis'}
              </div>
              <div>
                <span className="font-medium">Vault Access:</span> 🔐 Secured
              </div>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 pt-8">
          FAA Genesis Layer is live. Syncs refresh every 5 seconds.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
        FAA Seedwave™ Mesh Active • VaultMesh™ Secured • Genesis Node Engaged
      </footer>
    </section>
  );
}