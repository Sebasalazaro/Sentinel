import { getReportsForRepo } from "@/lib/s3"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export const revalidate = 60

interface RepoPageProps {
  params: Promise<{ repoName: string }>
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { repoName } = await params
  const decodedRepoName = decodeURIComponent(repoName)
  const reports = await getReportsForRepo(decodedRepoName)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{decodedRepoName}</h1>
          <p className="text-muted-foreground mt-2">
            Reportes de seguridad disponibles: {reports.length}
          </p>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No hay reportes disponibles para este repositorio</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <Link
                key={report.date}
                href={`/repo/${encodeURIComponent(decodedRepoName)}/report/${report.date}`}
              >
                <Card className="p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          Reporte
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {report.fileName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border">
                      <Calendar className="h-4 w-4" />
                      <span>{report.dateFormatted}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      Ver reporte
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
