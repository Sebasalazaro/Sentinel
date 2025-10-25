import { getReportDetails } from "@/lib/s3"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ReportHeader } from "@/components/report-header"
import { ReportStats } from "@/components/report-stats"
import { VulnerabilitiesList } from "@/components/vulnerabilities-list"
import { RepositoryMetadata } from "@/components/repository-metadata"

export const revalidate = 300

interface ReportPageProps {
  params: Promise<{ repoName: string; date: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { repoName, date } = await params
  const decodedRepoName = decodeURIComponent(repoName)
  const report = await getReportDetails(decodedRepoName, date)

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Link href={`/repo/${encodeURIComponent(decodedRepoName)}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No se pudo cargar el reporte</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href={`/repo/${encodeURIComponent(decodedRepoName)}`}>
          <Button variant="ghost" className="mb-6 hover:bg-accent/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a reportes
          </Button>
        </Link>

        <div className="space-y-6">
          <ReportHeader 
            repoName={decodedRepoName} 
            date={report.date} 
            artifactName={report.data.ArtifactName || `https://github.com/${decodedRepoName}.git`} 
          />

          <ReportStats data={report.data} />

          {report.data.Metadata && <RepositoryMetadata metadata={report.data.Metadata} />}

          <VulnerabilitiesList results={report.data.Results || []} />
        </div>
      </div>
    </div>
  )
}
