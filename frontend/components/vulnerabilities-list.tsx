"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, ExternalLink, Package, Search, AlertTriangle } from "lucide-react"

interface Vulnerability {
  VulnerabilityID: string
  PkgName: string
  InstalledVersion: string
  FixedVersion: string
  Severity: string
  Title: string
  Description: string
  PrimaryURL: string
  PublishedDate: string
  CVSS?: {
    nvd?: {
      V3Score: number
    }
  }
}

interface VulnerabilitiesListProps {
  results: Array<{
    Target: string
    Vulnerabilities?: Vulnerability[]
  }>
}

export function VulnerabilitiesList({ results }: VulnerabilitiesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedVulns, setExpandedVulns] = useState<Set<string>>(new Set())
  const [selectedSeverity, setSelectedSeverity] = useState<string>("TODAS")

  const allVulnerabilities = results.flatMap((result) =>
    (result.Vulnerabilities || []).map((vuln) => ({
      ...vuln,
      target: result.Target,
    })),
  )

  const filteredVulnerabilities = allVulnerabilities.filter((vuln) => {
    const matchesSearch =
      vuln.VulnerabilityID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.PkgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vuln.Title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSeverity = selectedSeverity === "TODAS" || vuln.Severity === selectedSeverity

    return matchesSearch && matchesSeverity
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedVulns)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedVulns(newExpanded)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "HIGH":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "MEDIUM":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "LOW":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const severityOrder = ["CRITICAL", "HIGH", "MEDIUM", "LOW"]
  const groupedVulnerabilities = severityOrder.reduce(
    (acc, severity) => {
      acc[severity] = filteredVulnerabilities.filter((v) => v.Severity === severity)
      return acc
    },
    {} as Record<string, typeof filteredVulnerabilities>,
  )

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border/50">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vulnerabilidades, paquetes o CVEs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["TODAS", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
              <Button
                key={severity}
                variant={selectedSeverity === severity ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSeverity(severity)}
                className={selectedSeverity === severity ? "bg-accent text-accent-foreground" : ""}
              >
                {severity}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {severityOrder.map((severity) => {
            const vulns = groupedVulnerabilities[severity]
            if (vulns.length === 0) return null

            return (
              <div key={severity}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className={`h-5 w-5 ${getSeverityColor(severity).split(" ")[1]}`} />
                  <h3 className="text-lg font-semibold text-foreground">Severidad {severity === "CRITICAL" ? "CRÍTICA" : severity === "HIGH" ? "ALTA" : severity === "MEDIUM" ? "MEDIA" : "BAJA"}</h3>
                  <Badge variant="secondary" className="ml-2">
                    {vulns.length}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {vulns.map((vuln, index) => {
                    const uniqueKey = `${vuln.VulnerabilityID}-${vuln.PkgName}-${index}`
                    const isExpanded = expandedVulns.has(uniqueKey)

                    return (
                      <Card
                        key={uniqueKey}
                        className="p-4 bg-background border-border hover:border-accent/50 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge className={getSeverityColor(vuln.Severity)}>{vuln.Severity}</Badge>
                                <code className="text-sm font-mono text-accent">{vuln.VulnerabilityID}</code>
                                {vuln.CVSS?.nvd?.V3Score && (
                                  <Badge variant="outline" className="text-xs">
                                    CVSS: {vuln.CVSS.nvd.V3Score}
                                  </Badge>
                                )}
                              </div>

                              <h4 className="font-semibold text-foreground mb-1 text-pretty">{vuln.Title}</h4>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  <span>{vuln.PkgName}</span>
                                </div>
                                <span>
                                  v{vuln.InstalledVersion} → v{vuln.FixedVersion}
                                </span>
                                <span className="text-xs">{new Date(vuln.PublishedDate).toLocaleDateString('es-ES')}</span>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(uniqueKey)}
                              className="shrink-0"
                            >
                              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="pt-3 border-t border-border space-y-3">
                              <div>
                                <p className="text-sm font-medium text-foreground mb-1">Descripción</p>
                                <p className="text-sm text-muted-foreground text-pretty">{vuln.Description}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={vuln.PrimaryURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
                                >
                                  Ver Detalles
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {filteredVulnerabilities.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No se encontraron vulnerabilidades con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
