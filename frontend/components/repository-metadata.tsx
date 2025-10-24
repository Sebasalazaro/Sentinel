import { Card } from "@/components/ui/card"
import { GitBranch, GitCommit, User, Calendar } from "lucide-react"

interface RepositoryMetadataProps {
  metadata: {
    RepoURL: string
    Branch: string
    Commit: string
    CommitMsg: string
    Author: string
    Committer: string
  }
}

export function RepositoryMetadata({ metadata }: RepositoryMetadataProps) {
  return (
    <Card className="p-6 bg-card border-border/50">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-accent" />
        Información del Repositorio
      </h2>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <GitBranch className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Rama</p>
              <p className="text-foreground font-medium">{metadata.Branch}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <GitCommit className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Commit</p>
              <p className="text-foreground font-mono text-xs">{metadata.Commit.substring(0, 12)}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Autor</p>
              <p className="text-foreground">{metadata.Author}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-muted-foreground">Mensaje del Commit</p>
              <p className="text-foreground">{metadata.CommitMsg}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
