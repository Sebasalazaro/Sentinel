import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { Repository } from "@/lib/s3"

interface RepositoryCardProps {
  repository: Repository
}

export function RepositoryCard({ repository }: RepositoryCardProps) {
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
          <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary shrink-0">
            Monitoreado
          </Badge>
        </div>

        {/* Repository Icon/Visual */}
        <div className="flex items-center justify-center p-6 rounded-lg bg-primary/10">
          <GitBranch className="h-12 w-12 text-primary" />
        </div>

        {/* Last Scan Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Último escaneo:</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {repository.lastScanDateFormatted || "Sin escaneos"}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/repo/${encodeURIComponent(repository.name)}`}>
          <Button
            variant="outline"
            className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary bg-transparent"
          >
            Ver detalles
          </Button>
        </Link>
      </div>
    </Card>
  )
}
