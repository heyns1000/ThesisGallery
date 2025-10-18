export default function IntegrationsDashboard() {
  return (
    <div className="p-8" data-testid="page-integrations-dashboard">
      <h1 className="text-2xl font-bold mb-4" data-testid="heading-integrations-dashboard">🔌 Integrations</h1>
      <p className="text-muted-foreground" data-testid="text-description">Extensions - Coming soon</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">External APIs</h3>
          <p className="text-sm text-muted-foreground">Connect to external services</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Webhooks</h3>
          <p className="text-sm text-muted-foreground">Real-time event notifications</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Third-party Tools</h3>
          <p className="text-sm text-muted-foreground">Integrate popular platforms</p>
        </div>
      </div>
    </div>
  )
}
