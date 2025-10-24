import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, XCircle, AlertCircle } from "lucide-react"

interface ReportStatsProps {
  data: {
    Results: Array<{
      Vulnerabilities?: Array<{
        Severity: string
      }>
    }>
  }
}

export function ReportStats({ data }: ReportStatsProps) {
  // Calculate vulnerability counts by severity
  const vulnerabilities = data.Results.flatMap((result) => result.Vulnerabilities || [])

  const stats = {
    critical: vulnerabilities.filter((v) => v.Severity === "CRITICAL").length,
    high: vulnerabilities.filter((v) => v.Severity === "HIGH").length,
    medium: vulnerabilities.filter((v) => v.Severity === "MEDIUM").length,
    low: vulnerabilities.filter((v) => v.Severity === "LOW").length,
    total: vulnerabilities.length,
  }

  const statCards = [
    {
      label: "Total Vulnerabilidades",
      value: stats.total,
      icon: AlertTriangle,
      color: "text-foreground",
      bgColor: "bg-card",
    },
    {
      label: "Críticas",
      value: stats.critical,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Altas",
      value: stats.high,
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      label: "Medias",
      value: stats.medium,
      icon: AlertTriangle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Bajas",
      value: stats.low,
      icon: CheckCircle2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className={`p-4 ${stat.bgColor} border-border/50`}>
            <div className="flex items-center gap-3">
              <Icon className={`h-5 w-5 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
