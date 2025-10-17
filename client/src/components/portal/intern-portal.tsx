import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, FileText, TrendingUp } from "lucide-react"

export function InternPortal() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="intern-portal-container">
      <Card className="border-2 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-violet-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-white" data-testid="icon-portal" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Intern Portal
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Central hub for intern resources, schedules, and performance tracking
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-indigo-500 text-indigo-400" data-testid="badge-active">
              12 Active Interns
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400" data-testid="badge-programs">
              5 Programs
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Your Tasks", value: "8", icon: FileText },
          { title: "Scheduled", value: "3", icon: Calendar },
          { title: "Team Size", value: "12", icon: Users },
          { title: "Progress", value: "67%", icon: TrendingUp }
        ].map((item, index) => {
          const IconComponent = item.icon
          return (
            <Card key={index} className="bg-white dark:bg-gray-800" data-testid={`metric-card-${index}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardDescription>{item.title}</CardDescription>
                  <IconComponent className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{item.value}</div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800" data-testid="card-schedule">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-indigo-500" />
              This Week's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8 text-gray-600 dark:text-gray-400">
            <Calendar className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
            <p>Your weekly schedule and upcoming training sessions will appear here.</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800" data-testid="card-assignments">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-violet-500" />
              Current Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8 text-gray-600 dark:text-gray-400">
            <FileText className="h-12 w-12 text-violet-500 mx-auto mb-4" />
            <p>Track your assignments and submit work through this portal.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6 text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Welcome to Your Intern Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Manage your internship experience, access learning resources, and track your professional development journey.
          </p>
          <Button className="bg-indigo-500 hover:bg-indigo-600" data-testid="button-get-started">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
