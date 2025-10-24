import { DashboardHeader } from "@/components/dashboard-header"
import { RepositoryGrid } from "@/components/repository-grid"
import { StatsOverview } from "@/components/stats-overview"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <StatsOverview />
        <RepositoryGrid />
      </main>
    </div>
  )
}
