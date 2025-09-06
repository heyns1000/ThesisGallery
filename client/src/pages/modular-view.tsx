import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "wouter";

const learningModules = [
  {
    id: "learning-progress",
    title: "Learning Progress",
    description: "Track your child's progress across different subjects and activities",
    status: "Level 3: Science Master",
    color: "indigo",
    icon: "📊",
    metrics: {
      completed: "87%",
      streak: "12 days",
      badges: "15"
    }
  },
  {
    id: "toy-settings",
    title: "Toy Settings", 
    description: "Modify interactive settings, volume controls, and more for each toy",
    status: "5 Toys Connected",
    color: "green",
    icon: "⚙️",
    metrics: {
      connected: "5/5",
      battery: "95%",
      updates: "Latest"
    }
  },
  {
    id: "learning-modules",
    title: "Learning Modules",
    description: "Explore various learning modules for your child to start engaging with",
    status: "12 Modules Active",
    color: "purple",
    icon: "📚",
    metrics: {
      active: "12",
      completed: "8",
      unlocked: "New: Math+"
    }
  },
  {
    id: "parental-dashboard",
    title: "Parental Dashboard", 
    description: "View your child's overall performance, activity logs, and more",
    status: "Weekly Report Ready",
    color: "blue",
    icon: "👨‍👩‍👧‍👦",
    metrics: {
      weeklyHours: "24h",
      improvement: "+15%",
      alerts: "None"
    }
  },
  {
    id: "ai-feedback",
    title: "Interactive AI Feedback",
    description: "Receive AI-driven feedback on your child's performance and learning habits",
    status: "3 New Insights",
    color: "red", 
    icon: "🤖",
    metrics: {
      insights: "3 new",
      accuracy: "94%",
      suggestions: "5"
    }
  },
  {
    id: "notifications",
    title: "Recent Updates & Alerts",
    description: "Stay updated with latest features and your child's milestones",
    status: "2 New Updates",
    color: "teal",
    icon: "🔔",
    metrics: {
      newUpdates: "2",
      milestones: "1",
      reminders: "3"
    }
  },
  {
    id: "family-learning",
    title: "Family Learning Experience",
    description: "Incorporate family interactions into learning with group activities", 
    status: "Family Mode Available",
    color: "yellow",
    icon: "🏠",
    metrics: {
      familyTime: "18h",
      activities: "7",
      members: "4"
    }
  }
];

const recentUpdates = [
  {
    type: "achievement",
    title: "New Achievement Unlocked!", 
    description: "Your child has mastered 'Advanced Level Math'",
    time: "2 hours ago",
    icon: "🏆"
  },
  {
    type: "update",
    title: "New Toy Module Released",
    description: "Download the latest interactive holographic stories!",
    time: "1 day ago", 
    icon: "🆕"
  },
  {
    type: "progress",
    title: "Learning Milestone Reached",
    description: "Completed 50 learning sessions this month",
    time: "3 days ago",
    icon: "📈"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    indigo: "from-indigo-700 via-indigo-900 to-indigo-800 border-indigo-500",
    green: "from-green-700 via-green-900 to-green-800 border-green-500", 
    purple: "from-purple-700 via-purple-900 to-purple-800 border-purple-500",
    blue: "from-blue-700 via-blue-900 to-blue-800 border-blue-500",
    red: "from-red-700 via-red-900 to-red-800 border-red-500",
    teal: "from-teal-700 via-teal-900 to-teal-800 border-teal-500",
    yellow: "from-yellow-700 via-yellow-900 to-yellow-800 border-yellow-500"
  };
  return colors[color as keyof typeof colors] || colors.indigo;
};

export default function ModularView() {
  const [selectedChild, setSelectedChild] = useState("Emma");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white p-10 text-center shadow-xl rounded-b-2xl">
        <div className="flex justify-center items-center gap-4">
          <div className="text-6xl">🧸</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-400">ModularView</h1>
          <div className="text-6xl">🌈</div>
        </div>
        <p className="text-white/70 mt-4">Your central hub for managing child learning, toys, and activities</p>
        
        {/* Child Selector */}
        <div className="mt-6 flex justify-center">
          <div className="bg-black/20 rounded-lg p-2">
            <span className="text-sm text-gray-300 mr-3">Current Child:</span>
            <select 
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="bg-gray-800 text-white px-3 py-1 rounded border border-yellow-500"
            >
              <option value="Emma">Emma (Age 7)</option>
              <option value="Liam">Liam (Age 5)</option>
              <option value="Sofia">Sofia (Age 9)</option>
            </select>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-black border-b border-gray-700 py-4">
        <div className="flex justify-center gap-4 text-sm">
          <Link href="/education-dashboard">
            <a className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
              🧸 Education Hub
            </a>
          </Link>
          <Link href="/smart-toys-platform">
            <a className="px-4 py-2 border border-yellow-600 rounded hover:bg-yellow-600 transition">
              🚀 Platform
            </a>
          </Link>
          <a href="#modules" className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
            📱 Modules
          </a>
          <a href="#updates" className="px-4 py-2 border border-cyan-600 rounded hover:bg-cyan-600 transition">
            🔔 Updates
          </a>
        </div>
      </nav>

      <div className="px-6 py-8">
        {/* Child Overview Stats */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            📊 {selectedChild}'s Learning Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gray-950 border-yellow-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="font-bold text-yellow-400">Level 3</div>
                <div className="text-xs text-gray-400">Current Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-green-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="font-bold text-green-400">15</div>
                <div className="text-xs text-gray-400">Badges Earned</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-blue-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="font-bold text-blue-400">24h</div>
                <div className="text-xs text-gray-400">This Week</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-950 border-purple-500">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="font-bold text-purple-400">87%</div>
                <div className="text-xs text-gray-400">Completion Rate</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Modules Grid */}
        <section id="modules" className="mb-12">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            🎛️ Learning & Management Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {learningModules.map((module) => (
              <div
                key={module.id}
                className={`bg-gradient-to-br ${getColorClasses(module.color)} p-6 rounded-xl border hover:shadow-xl transition transform hover:scale-105 cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{module.icon}</div>
                  <Badge className="bg-yellow-400 text-black text-xs">
                    Active
                  </Badge>
                </div>
                
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  {module.title}
                </h3>
                
                <p className="text-white/80 text-sm mb-4">
                  {module.description}
                </p>
                
                <div className="text-cyan-400 font-bold text-sm mb-4">
                  {module.status}
                </div>

                {/* Module Metrics */}
                <div className="space-y-1 mb-4">
                  {Object.entries(module.metrics).map(([key, value], idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-gray-300 capitalize">{key}:</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>

                <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold">
                  Open Module
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Updates & Alerts */}
        <section id="updates">
          <h2 className="text-3xl font-bold text-yellow-400 mb-8 text-center">
            🔔 Recent Updates & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentUpdates.map((update, index) => (
              <Card key={index} className="bg-gray-950 border-cyan-500">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{update.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-cyan-300 mb-1">{update.title}</h4>
                      <p className="text-sm text-gray-400 mb-2">{update.description}</p>
                      <div className="text-xs text-gray-500">{update.time}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="bg-indigo-600 hover:bg-indigo-500 p-6 h-auto flex flex-col gap-2">
              <div className="text-2xl">📈</div>
              <div className="font-semibold">View Progress Report</div>
            </Button>
            <Button className="bg-green-600 hover:bg-green-500 p-6 h-auto flex flex-col gap-2">
              <div className="text-2xl">🎮</div>
              <div className="font-semibold">Start Learning Game</div>
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-500 p-6 h-auto flex flex-col gap-2">
              <div className="text-2xl">⚙️</div>
              <div className="font-semibold">Configure Toys</div>
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-500 p-6 h-auto flex flex-col gap-2">
              <div className="text-2xl">👥</div>
              <div className="font-semibold">Family Activity</div>
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-blue-900 via-indigo-900 to-purple-900 text-center text-xs text-gray-400 py-10 mt-16 border-t border-gray-700">
        FAA.Zone | Fruitful Smart Toys™ | VaultMint Certified | 2025 | ModularView Interface
      </footer>
    </div>
  );
}