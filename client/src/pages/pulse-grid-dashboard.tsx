import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generatePulse = (base: number, volatility = 1.8) => {
  const now = Date.now();
  return Array.from({ length: 9 }, (_, i) => ({
    time: new Date(now - (9 - i) * 1000).toLocaleTimeString(),
    price: +(base + (Math.random() - 0.5) * volatility).toFixed(2),
  }));
};

interface BuySharesModalProps {
  label: string;
  latestPrice: number;
  onClose: () => void;
}

const BuySharesModal = ({ label, latestPrice, onClose }: BuySharesModalProps) => {
  const [shares, setShares] = useState(1000);
  const total = +(latestPrice * shares).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 space-y-4 border-2 border-black shadow-xl">
        <h3 className="text-xl font-bold">Buy Shares in {label}</h3>
        <p>Share Price: R{latestPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
        <input
          type="number"
          min={1}
          value={shares}
          onChange={(e) => setShares(Number(e.target.value))}
          className="border w-full p-2 rounded text-black"
          data-testid={`input-shares-${label}`}
        />
        <p className="text-sm font-semibold">Total: R{total.toLocaleString('en-ZA')}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white" data-testid="button-close-modal">
            Close
          </Button>
          <Button
            onClick={() => {
              alert(`Purchased ${shares} shares in ${label}`);
              onClose();
            }}
            className="bg-black hover:bg-gray-900 text-white"
            data-testid="button-confirm-purchase"
          >
            Confirm Purchase
          </Button>
        </div>
      </div>
    </div>
  );
};

interface PulseBlockProps {
  label: string;
  color: string;
  data: Array<{ time: string; price: number }>;
  icon: string;
}

const PulseBlock = ({ label = '', color = '#000000', data = [], icon = '' }: PulseBlockProps) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const fallbackData = generatePulse(17.23);
  const chartData = hasData ? data : fallbackData;
  const latestPrice = chartData[chartData.length - 1]?.price || 0;
  const currencyPrefix = label.includes("USD")
    ? '$'
    : label.includes("POUND")
    ? '£'
    : label.includes("EURO")
    ? '€'
    : label.includes("BTC")
    ? '₿'
    : label.includes("ETH")
    ? 'Ξ'
    : 'R';

  const [metricsVisible, setMetricsVisible] = useState(false);
  const [glow, setGlow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlow(true);
      setTimeout(() => setGlow(false), 600);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-xl border-2 border-black bg-gradient-to-b from-white to-gray-100 rounded-2xl p-3 transition-all duration-500 hover:scale-[1.02]">
      <CardContent>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-extrabold uppercase tracking-wider" data-testid={`text-brand-${label}`}>
            {icon} {label}<sup>™</sup>
          </h2>
          <span 
            className={`text-sm font-mono bg-white text-black px-2 py-1 rounded relative transition-all duration-500 ${glow ? 'shadow-[0_0_10px_rgba(34,197,94,0.8)]' : ''}`}
            data-testid={`text-price-${label}`}
          >
            {latestPrice !== null && latestPrice !== undefined
              ? `${currencyPrefix}${latestPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`
              : 'N/A'}
            <span className="absolute top-0 left-0 w-full h-full rounded animate-ping bg-green-400 opacity-10 pointer-events-none" />
          </span>
        </div>

        <div style={{ width: '100%', height: '160px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip formatter={(value: any) => `${currencyPrefix}${value.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`} />
              <Line type="monotone" dataKey="price" stroke={color} strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 text-sm text-center space-y-2">
          <p className="font-semibold">Now Available: {label} Pack</p>
          <Button 
            onClick={() => setModalOpen(true)} 
            className="w-full bg-black text-white rounded-lg hover:bg-gray-800 transition"
            data-testid={`button-buy-shares-${label}`}
          >
            Buy Shares
          </Button>
          <Button 
            onClick={() => setMetricsVisible(!metricsVisible)} 
            className="w-full bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition"
            data-testid={`button-toggle-metrics-${label}`}
          >
            Toggle Metrics
          </Button>
        </div>

        {metricsVisible && (
          <div className="mt-3 text-xs text-left bg-white rounded p-2 border border-gray-300" data-testid={`metrics-${label}`}>
            <p><strong>Last Price:</strong> {latestPrice}</p>
            <p><strong>Chart Points:</strong> {chartData.length}</p>
            <p><strong>High:</strong> {Math.max(...chartData.map(p => p.price))}</p>
            <p><strong>Low:</strong> {Math.min(...chartData.map(p => p.price))}</p>
            {!['Tesla Corp','Nike Futures','SpaceY','Apple Vision'].includes(label) && (
              <>
                <p><strong>Estimated Valuation:</strong> R{(latestPrice * 1000000).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                <p><strong>Main IP:</strong> {label} Sovereign Systems</p>
                <p><strong>Value Proposition:</strong> Empowering global cognition through scalable, adaptive branded intelligence.</p>
                <p><strong>FAA Share:</strong> 24.9% of 10,000,000 shares = 2,490,000 shares</p>
                <p><strong>Fruitful Global Share:</strong> 24.9% of 10,000,000 shares = 2,490,000 shares</p>
              </>
            )}
            {label === 'MyUniverse.ai' && (
              <p><strong>Injected Metric:</strong> 15% of 1000% shares = 0.1 — Ecosystem node anomaly active</p>
            )}
          </div>
        )}
      </CardContent>
      {modalOpen && <BuySharesModal label={label} latestPrice={latestPrice} onClose={() => setModalOpen(false)} />}
    </Card>
  );
};

export default function PulseGridDashboard() {
  const [pulseData, setPulseData] = useState<Record<string, Array<{ time: string; price: number }>>>({});

  const brands = [
    { label: 'Tesla Corp', icon: '⚡', base: 238.73, color: '#e53935' },
    { label: 'Nike Futures', icon: '👟', base: 112.42, color: '#1e88e5' },
    { label: 'SpaceY', icon: '🚀', base: 872.13, color: '#43a047' },
    { label: 'Apple Vision', icon: '🍏', base: 188.99, color: '#fdd835' },
    { label: 'MyUniverse.ai', icon: '🧠', base: 17.39, color: '#00e5ff' },
    { label: 'Vrugtige.Planet', icon: '🌸', base: 1.22, color: '#f06292' },
    { label: 'Meta SkinOS', icon: '🧬', base: 72.58, color: '#9c27b0' },
    { label: 'ByteNest Drone', icon: '🦅', base: 142.33, color: '#0288d1' },
    { label: 'Omega Fleet', icon: '🛰️', base: 392.77, color: '#f4511e' },
    { label: 'Zion Thread™', icon: '🪡', base: 6.61, color: '#5e35b1' },
    { label: 'Omnikey Identity', icon: '🔐', base: 9.81, color: '#37474f' },
    { label: 'Echo Plant Co.', icon: '🌱', base: 4.22, color: '#43a047' },
    { label: 'VaultHearts', icon: '💖', base: 13.95, color: '#e91e63' },
    { label: 'Fruitful Global Login', icon: '🌐', base: 1.00, color: '#4fc3f7' },
    { label: 'Hotstack Core UI', icon: '🔥', base: 1.00, color: '#ff3d00' }
  ];

  useEffect(() => {
    const updatePulse = () => {
      const newPulseData: Record<string, Array<{ time: string; price: number }>> = {};
      brands.forEach(({ label, base }) => {
        newPulseData[label] = generatePulse(base);
      });
      setPulseData(newPulseData);
    };

    updatePulse();
    const interval = setInterval(updatePulse, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🍇 Fruitful™ PulseGrid Trading Hub</h1>
        <p className="text-gray-600">Real-time share trading with live pulse metrics and VaultMesh™ integration</p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-green-100 px-3 py-1 rounded">
            <span className="text-green-800 font-semibold">✅ VaultMesh Connected</span>
          </div>
          <div className="bg-blue-100 px-3 py-1 rounded">
            <span className="text-blue-800 font-semibold">📊 Live Updates: 9s</span>
          </div>
          <div className="bg-purple-100 px-3 py-1 rounded">
            <span className="text-purple-800 font-semibold">🔒 TreatySync Active</span>
          </div>
        </div>
      </div>

      {/* Trading Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {brands.map(({ label, icon, color }) => (
          <PulseBlock
            key={label}
            label={label}
            icon={icon}
            color={color}
            data={pulseData[label] || []}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>FAA.Zone Mesh • VaultMesh™ Certified • All trades verified via SecureScroll✂</p>
        <p className="mt-1">Real-time pulse updates every 9 seconds • TreatySync Protocol Active</p>
      </div>
    </div>
  );
}