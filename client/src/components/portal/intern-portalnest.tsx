import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, BookOpen, Award } from "lucide-react"

export function InternPortalNest() {
  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900" data-testid="intern-portalnest-container">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-white" data-testid="icon-intern" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Intern PortalNest
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Internship management and training platform for the FAA.ZONE ecosystem
          </CardDescription>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="outline" className="border-purple-500 text-purple-400" data-testid="badge-training">
              Training Programs
            </Badge>
            <Badge variant="outline" className="border-pink-500 text-pink-400" data-testid="badge-mentorship">
              Mentorship
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-programs">
          <CardHeader>
            <BookOpen className="h-8 w-8 text-purple-500 mb-2" />
            <CardTitle>Learning Programs</CardTitle>
            <CardDescription>
              Structured internship programs across agriculture, mining, tech, and ritual sectors
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-mentors">
          <CardHeader>
            <Users className="h-8 w-8 text-pink-500 mb-2" />
            <CardTitle>Expert Mentors</CardTitle>
            <CardDescription>
              Learn from industry professionals and ecosystem leaders
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-white dark:bg-gray-800" data-testid="feature-card-certificates">
          <CardHeader>
            <Award className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Certifications</CardTitle>
            <CardDescription>
              Earn recognized certificates upon program completion
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="pt-6 text-center space-y-4">
          <GraduationCap className="h-16 w-16 text-purple-500 mx-auto" data-testid="icon-graduation" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Launch Your Career
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Access training materials from interns.seedwave.faa.zone and collaborate with teams across the ecosystem. Full platform launching Q2 2025.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-purple-500 hover:bg-purple-600" data-testid="button-apply">
              Apply for Internship
            </Button>
            <Button variant="outline" data-testid="button-programs">
              Browse Programs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
