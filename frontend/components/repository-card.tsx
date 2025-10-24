import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, Calendar, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Repository {
  id: string
  name: string
  lastScan: string
  status: "passed" | "warning" | "critical"
  criticalIssues: number
  highIssues: number
  mediumIssues: number
}

interface RepositoryCardProps {
  repository: Repository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
  const statusConfig = {
    passed: {
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/30",
      label: "Passed",
    },
    warning: {
      icon: AlertCircle,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      label: "Warning",
    },
    critical: {
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      label: "Critical",
    },
  }

  const config = statusConfig[repository.status]
  const StatusIcon = config.icon
  const lastScanDate = new Date(repository.lastScan)

  return (
    <Card className="p-5 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {repository.name}
            </h3>
          </div>
          <Badge variant="outline" className={`${config.bgColor} ${config.borderColor} ${config.color} shrink-0`}>
            {config.label}
          </Badge>
        </div>

        {/* Status Icon */}
        <div className={`flex items-center justify-center p-4 rounded-lg ${config.bgColor}`}>
          <StatusIcon className={`h-8 w-8 ${config.color}`} />
        </div>

        {/* Issues Summary */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-destructive">{repository.criticalIssues}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-yellow-500">{repository.highIssues}</p>
            <p className="text-xs text-muted-foreground">High</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-blue-400">{repository.mediumIssues}</p>
            <p className="text-xs text-muted-foreground">Medium</p>
          </div>
        </div>

        {/* Last Scan */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Calendar className="h-3 w-3" />
          <span>Scanned {formatDistanceToNow(lastScanDate, { addSuffix: true })}</span>
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent"
        >
          Ver detalles
        </Button>
      </div>
    </Card>
  )
}
