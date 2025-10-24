import { Shield, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"

const stats = [
  {
    label: "Total Repositories",
    value: "24",
    icon: Shield,
    trend: "+3 this month",
  },
  {
    label: "Critical Issues",
    value: "7",
    icon: AlertTriangle,
    trend: "-2 from last scan",
    variant: "warning" as const,
  },
  {
    label: "Passed Scans",
    value: "17",
    icon: CheckCircle2,
    trend: "+5 this week",
    variant: "success" as const,
  },
  {
    label: "Pending Scans",
    value: "3",
    icon: Clock,
    trend: "In queue",
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
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
                  stat.variant === "warning"
                    ? "bg-destructive/10"
                    : stat.variant === "success"
                      ? "bg-primary/10"
                      : "bg-muted"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    stat.variant === "warning"
                      ? "text-destructive"
                      : stat.variant === "success"
                        ? "text-primary"
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
