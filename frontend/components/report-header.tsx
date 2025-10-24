import { FileJson, Shield } from "lucide-react"

interface ReportHeaderProps {
  repoName: string
  date: string
  artifactName: string
}

export function ReportHeader({ repoName, date, artifactName }: ReportHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent/10 rounded-lg">
          <Shield className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{repoName}</h1>
          <p className="text-muted-foreground text-sm mt-1">Reporte de Escaneo de Seguridad</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4" />
          <span>Fecha de Escaneo: {new Date(date).toLocaleDateString('es-ES')}</span>
        </div>
        <div className="hidden md:block text-border">|</div>
        <span className="hidden md:inline truncate max-w-md">{artifactName}</span>
      </div>
    </div>
  )
}
