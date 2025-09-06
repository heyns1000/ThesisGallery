import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ReferenceLine } from "recharts";
import { useEffect, useState } from "react";

const employees = [
  { name: "Zanele Mokoena", role: "Tech Lead", country: "South Africa", salary: 95000, lastPaid: "2024-12-15", department: "Fulfillment", status: "Paid" },
  { name: "Kwame Asante", role: "Product Manager", country: "Ghana", salary: 88000, lastPaid: "2024-12-14", department: "Vendor", status: "Due Soon" },
  { name: "Fatima Al-Zahra", role: "UX Designer", country: "Morocco", salary: 72000, lastPaid: "2024-12-13", department: "Support", status: "Paid" },
  { name: "Olumide Okafor", role: "Backend Engineer", country: "Nigeria", salary: 78000, lastPaid: "2024-12-12", department: "Operations", status: "Paid" },
  { name: "Amara Diallo", role: "Frontend Developer", country: "Senegal", salary: 68000, lastPaid: "2024-12-11", department: "Fulfillment", status: "Due Soon" },
  { name: "Sipho Mthembu", role: "DevOps Engineer", country: "South Africa", salary: 82000, lastPaid: "2024-12-10", department: "Operations", status: "Paid" },
  { name: "Asha Hassan", role: "Marketing Manager", country: "Kenya", salary: 75000, lastPaid: "2024-12-09", department: "Vendor", status: "Due Soon" },
  { name: "Kofi Mensah", role: "Sales Director", country: "Ghana", salary: 92000, lastPaid: "2024-12-08", department: "Support", status: "Paid" },
  { name: "Zara Ouali", role: "HR Specialist", country: "Tunisia", salary: 65000, lastPaid: "2024-12-07", department: "Operations", status: "Paid" },
  { name: "Chinedu Eze", role: "Quality Assurance", country: "Nigeria", salary: 58000, lastPaid: "2024-12-06", department: "Fulfillment", status: "Due Soon" }
];

const initialPayrollData = [
  { name: "Mon", paid: 1200, bonuses: 150, deductions: 80, overtime: 45, benefits: 200 },
  { name: "Tue", paid: 1350, bonuses: 180, deductions: 95, overtime: 60, benefits: 220 },
  { name: "Wed", paid: 1450, bonuses: 200, deductions: 110, overtime: 75, benefits: 240 },
  { name: "Thu", paid: 1300, bonuses: 170, deductions: 85, overtime: 50, benefits: 210 },
  { name: "Fri", paid: 1550, bonuses: 220, deductions: 120, overtime: 90, benefits: 260 },
  { name: "Sat", paid: 900, bonuses: 100, deductions: 60, overtime: 30, benefits: 150 },
  { name: "Sun", paid: 800, bonuses: 80, deductions: 50, overtime: 20, benefits: 130 }
];

const departmentColors = {
  "Fulfillment": "#00b894",
  "Vendor": "#0984e3", 
  "Support": "#fdcb6e",
  "Operations": "#d63031"
};

const downloadPayslip = (employee: typeof employees[0]) => {
  const payslipContent = `
FAA™ Payroll OS - Employee Payslip
==================================

Name: ${employee.name}
Role: ${employee.role}
Country: ${employee.country}
Salary: R${employee.salary.toLocaleString()}
Last Paid: ${employee.lastPaid}
Department: ${employee.department}
Status: ${employee.status}

Generated: ${new Date().toLocaleDateString()}
Powered by VaultMesh™ Sovereign Grid
  `.trim();

  const blob = new Blob([payslipContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${employee.name.replace(/\s+/g, '_')}_Payslip.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function AdvancedPayrollDashboard() {
  const [payrollData, setPayrollData] = useState(initialPayrollData);
  const [tick, setTick] = useState(0);
  const [highlightDay, setHighlightDay] = useState("Wed");

  // Simulate real-time payroll updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      setPayrollData(prevData => 
        prevData.map(day => ({
          ...day,
          paid: Math.max(0, day.paid + (Math.random() - 0.5) * 300),
          bonuses: Math.max(0, day.bonuses + (Math.random() - 0.5) * 100),
          deductions: Math.max(0, day.deductions + (Math.random() - 0.5) * 50),
          overtime: Math.max(0, day.overtime + (Math.random() - 0.5) * 40),
          benefits: Math.max(0, day.benefits + (Math.random() - 0.5) * 30)
        }))
      );
    }, 9000); // 9-second pulse cycle

    return () => clearInterval(interval);
  }, []);

  // Calculate department distribution for pie chart
  const departmentData = Object.keys(departmentColors).map(dept => ({
    name: dept,
    value: employees.filter(emp => emp.department === dept).length,
    color: departmentColors[dept as keyof typeof departmentColors]
  }));

  const getNextPayout = (index: number) => {
    const today = new Date();
    const nextPayDate = new Date(today);
    nextPayDate.setDate(today.getDate() + (index + 2));
    return nextPayDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header with Gorilla Globe */}
      <div className="relative mb-8">
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-emerald-400 animate-spin bg-gradient-to-tr from-green-300 via-indigo-300 to-pink-300 shadow-lg"></div>
        
        <h1 className="text-4xl font-bold text-white mb-2">🧬 Advanced Payroll Dashboard</h1>
        <p className="text-gray-400">FAA™ VaultMesh synchronized with real-time pulse metrics</p>
        
        {/* Sim Loop Monitor */}
        <div className="mt-4 text-xs text-zinc-500 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sim Tick: {tick} | Random Spread | Payroll Delta ±300 | Bonus Flux ±100
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 gap-2 mb-6 bg-gray-900">
          <TabsTrigger value="overview" data-testid="tab-overview" className="data-[state=active]:bg-purple-600">
            📈 Overview
          </TabsTrigger>
          <TabsTrigger value="employees" data-testid="tab-employees" className="data-[state=active]:bg-purple-600">
            👥 Employees
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Metrics Chart */}
          <Card className="bg-gray-900 border-purple-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">📊 Live Financial Pulse</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={payrollData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      onMouseMove={(e) => e?.activeLabel && setHighlightDay(e.activeLabel)}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #6366F1',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <ReferenceLine x={highlightDay} stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={3} name="Paid" />
                    <Line type="monotone" dataKey="bonuses" stroke="#3B82F6" strokeWidth={2} name="Bonuses" />
                    <Line type="monotone" dataKey="deductions" stroke="#EF4444" strokeWidth={2} name="Deductions" />
                    <Line type="monotone" dataKey="overtime" stroke="#F59E0B" strokeWidth={2} name="Overtime" />
                    <Line type="monotone" dataKey="benefits" stroke="#8B5CF6" strokeWidth={2} name="Benefits" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card className="bg-gray-900 border-purple-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-400 mb-4">🏢 Department Distribution</h3>
              <div style={{ width: '100%', height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => employees.forEach(downloadPayslip)}
              className="bg-green-600 hover:bg-green-700 p-4 h-auto flex flex-col"
              data-testid="button-bulk-download"
            >
              📤 Bulk Download
              <span className="text-xs mt-1">All Payslips</span>
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 p-4 h-auto flex flex-col"
              data-testid="button-live-sync"
            >
              🔄 Live Sync
              <span className="text-xs mt-1">VaultMesh™</span>
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 p-4 h-auto flex flex-col"
              data-testid="button-generate-reports"
            >
              📊 Reports
              <span className="text-xs mt-1">Generate</span>
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 p-4 h-auto flex flex-col"
              data-testid="button-audit-trail"
            >
              🔍 Audit Trail
              <span className="text-xs mt-1">View Logs</span>
            </Button>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-purple-400">👥 Employee Management</h3>
              <Badge className="bg-green-100 text-green-800">
                {employees.length} Active Employees
              </Badge>
            </div>

            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {employees.map((employee, index) => (
                  <Card 
                    key={employee.name} 
                    className="bg-gray-900 border-purple-700 hover:border-purple-500 transition-all duration-300 animate-pulse hover:animate-none"
                    data-testid={`employee-card-${employee.name}`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white">{employee.name}</h4>
                          <p className="text-sm text-gray-400">{employee.role}</p>
                        </div>
                        <Badge 
                          className={employee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {employee.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Country:</span>
                          <span className="text-white">{employee.country}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Salary:</span>
                          <span className="text-green-400">R{employee.salary.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Paid:</span>
                          <span className="text-white">{employee.lastPaid}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Next Payout:</span>
                          <span className="text-blue-400">{getNextPayout(index)}</span>
                        </div>
                      </div>

                      {/* Gorilla Trading Node */}
                      <div className="text-[10px] text-indigo-400 font-bold bg-gray-800 p-2 rounded">
                        🦍 Trading Node: {employee.country} | Code: {employee.name.split(" ")[0].slice(0, 3).toUpperCase()}-{employee.salary}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => downloadPayslip(employee)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          data-testid={`button-download-${employee.name}`}
                        >
                          💾 Download
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-purple-600 text-purple-300 hover:bg-purple-600"
                          data-testid={`button-edit-${employee.name}`}
                        >
                          ✏️ Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer Status */}
      <div className="mt-12 text-center text-sm text-gray-500">
        <p>FAA™ Advanced Payroll Dashboard • VaultMesh™ Real-Time • Gorilla Trading Nodes Active</p>
        <p className="mt-1">Pulse updates every 9 seconds • {employees.length} employees tracked • {departmentData.length} departments</p>
      </div>
    </div>
  );
}