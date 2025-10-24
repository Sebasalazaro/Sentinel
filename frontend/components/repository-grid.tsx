import { RepositoryCard } from "@/components/repository-card"

// Placeholder data for repositories
const repositories = [
  {
    id: "1",
    name: "frontend-app",
    lastScan: "2024-10-23T14:30:00Z",
    status: "passed" as const,
    criticalIssues: 0,
    highIssues: 2,
    mediumIssues: 5,
  },
  {
    id: "2",
    name: "backend-api",
    lastScan: "2024-10-23T12:15:00Z",
    status: "warning" as const,
    criticalIssues: 2,
    highIssues: 4,
    mediumIssues: 8,
  },
  {
    id: "3",
    name: "mobile-app",
    lastScan: "2024-10-22T18:45:00Z",
    status: "passed" as const,
    criticalIssues: 0,
    highIssues: 1,
    mediumIssues: 3,
  },
  {
    id: "4",
    name: "auth-service",
    lastScan: "2024-10-23T09:20:00Z",
    status: "critical" as const,
    criticalIssues: 5,
    highIssues: 7,
    mediumIssues: 12,
  },
  {
    id: "5",
    name: "payment-gateway",
    lastScan: "2024-10-23T16:00:00Z",
    status: "passed" as const,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 2,
  },
  {
    id: "6",
    name: "analytics-engine",
    lastScan: "2024-10-21T11:30:00Z",
    status: "warning" as const,
    criticalIssues: 1,
    highIssues: 3,
    mediumIssues: 6,
  },
  {
    id: "7",
    name: "notification-service",
    lastScan: "2024-10-23T13:45:00Z",
    status: "passed" as const,
    criticalIssues: 0,
    highIssues: 1,
    mediumIssues: 4,
  },
  {
    id: "8",
    name: "data-pipeline",
    lastScan: "2024-10-22T15:20:00Z",
    status: "passed" as const,
    criticalIssues: 0,
    highIssues: 2,
    mediumIssues: 5,
  },
]

export function RepositoryGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Repositorios</h2>
          <p className="text-sm text-muted-foreground">Resultados de escaneo de seguridad para todos los repositorios monitoreados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repository={repo} />
        ))}
      </div>
    </div>
  )
}
