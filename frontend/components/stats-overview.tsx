import { Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/s3"

export async function StatsOverview() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      label: "Total Repositorios",
      value: stats.totalRepositories.toString(),
      icon: Shield,
      trend: `${stats.scannedRepos} escaneados`,
    },
    {
      label: "Vulnerabilidades Críticas",
      value: stats.totalCritical.toString(),
      icon: XCircle,
      trend: "En todos los repos",
      variant: "critical" as const,
    },
    {
      label: "Vulnerabilidades Altas",
      value: stats.totalHigh.toString(),
      icon: AlertTriangle,
      trend: "Requieren atención",
      variant: "warning" as const,
    },
    {
      label: "Total Vulnerabilidades",
      value: stats.totalVulnerabilities.toString(),
      icon: CheckCircle2,
      trend: `${stats.totalMedium} medias, ${stats.totalLow} bajas`,
      variant: "info" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  stat.variant === "critical"
                    ? "bg-red-500/10"
                    : stat.variant === "warning"
                      ? "bg-orange-500/10"
                      : stat.variant === "info"
                        ? "bg-blue-500/10"
                        : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    stat.variant === "critical"
                      ? "text-red-500"
                      : stat.variant === "warning"
                        ? "text-orange-500"
                        : stat.variant === "info"
                          ? "text-blue-500"
                          : "text-muted-foreground"
                  }`}
                />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
