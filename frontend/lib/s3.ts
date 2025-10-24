"use server"

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = "results-sec-tests"
const REPORTS_PREFIX = "Reportes/"

export interface Repository {
  name: string
  lastScanDate: string
  lastScanDateFormatted: string
}

export interface Report {
  date: string
  dateFormatted: string
  fileName: string
  key: string
}

export interface ReportDetails {
  data: any
  fileName: string
  date: string
}

/**
 * Get all repositories from S3
 */
export async function getRepositories(): Promise<Repository[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: REPORTS_PREFIX,
      Delimiter: "/",
    })

    const response = await s3Client.send(command)
    const repos: Repository[] = []

    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        if (!prefix.Prefix) continue
        
        // Extract repo name from prefix: "Reportes/NodeGoat/" -> "NodeGoat"
        const repoName = prefix.Prefix.replace(REPORTS_PREFIX, "").replace("/", "")
        
        if (repoName) {
          // Get the latest scan date for this repo
          const latestScan = await getLatestScanDate(repoName)
          
          repos.push({
            name: repoName,
            lastScanDate: latestScan.date,
            lastScanDateFormatted: latestScan.formatted,
          })
        }
      }
    }

    return repos
  } catch (error) {
    console.error("Error fetching repositories from S3:", error)
    return []
  }
}

/**
 * Get the latest scan date for a repository
 */
async function getLatestScanDate(repoName: string): Promise<{ date: string; formatted: string }> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `${REPORTS_PREFIX}${repoName}/`,
      Delimiter: "/",
    })

    const response = await s3Client.send(command)
    
    if (response.CommonPrefixes && response.CommonPrefixes.length > 0) {
      // Get all date folders and sort them to find the latest
      const dates = response.CommonPrefixes
        .map((prefix) => {
          if (!prefix.Prefix) return null
          const match = prefix.Prefix.match(/(\d{8}T\d{6}Z)/)
          return match ? match[1] : null
        })
        .filter((date): date is string => date !== null)
        .sort()
        .reverse()

      if (dates.length > 0) {
        const latestDate = dates[0]
        return {
          date: latestDate,
          formatted: formatDate(latestDate),
        }
      }
    }

    return { date: "", formatted: "Never" }
  } catch (error) {
    console.error(`Error fetching latest scan for ${repoName}:`, error)
    return { date: "", formatted: "Unknown" }
  }
}

/**
 * Get all reports for a specific repository
 */
export async function getReportsForRepo(repoName: string): Promise<Report[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: `${REPORTS_PREFIX}${repoName}/`,
      Delimiter: "/",
    })

    const response = await s3Client.send(command)
    const reports: Report[] = []

    if (response.CommonPrefixes) {
      for (const prefix of response.CommonPrefixes) {
        if (!prefix.Prefix) continue
        
        // Extract date from prefix: "Reportes/NodeGoat/20251024T204125Z/" -> "20251024T204125Z"
        const match = prefix.Prefix.match(/(\d{8}T\d{6}Z)/)
        if (match) {
          const date = match[1]
          reports.push({
            date,
            dateFormatted: formatDate(date),
            fileName: `${repoName}-trivy-report-${date}.json`,
            key: `${prefix.Prefix}${repoName}-trivy-report-${date}.json`,
          })
        }
      }
    }

    // Sort by date, newest first
    return reports.sort((a, b) => b.date.localeCompare(a.date))
  } catch (error) {
    console.error(`Error fetching reports for ${repoName}:`, error)
    return []
  }
}

/**
 * Get report details (JSON content)
 */
export async function getReportDetails(repoName: string, date: string): Promise<ReportDetails | null> {
  try {
    const key = `${REPORTS_PREFIX}${repoName}/${date}/${repoName}-trivy-report-${date}.json`
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await s3Client.send(command)
    
    if (response.Body) {
      const bodyString = await response.Body.transformToString()
      const data = JSON.parse(bodyString)
      
      return {
        data,
        fileName: `${repoName}-trivy-report-${date}.json`,
        date: formatDate(date),
      }
    }

    return null
  } catch (error) {
    console.error(`Error fetching report details for ${repoName} on ${date}:`, error)
    return null
  }
}

/**
 * Format date from 20251024T204125Z to readable format
 */
function formatDate(dateStr: string): string {
  try {
    // Parse: 20251024T204125Z
    const year = dateStr.substring(0, 4)
    const month = dateStr.substring(4, 6)
    const day = dateStr.substring(6, 8)
    const hour = dateStr.substring(9, 11)
    const minute = dateStr.substring(11, 13)
    const second = dateStr.substring(13, 15)

    const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`)
    
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  } catch (error) {
    return dateStr
  }
}

/**
 * Get dashboard statistics from all repositories
 */
export async function getDashboardStats() {
  try {
    const repos = await getRepositories()
    let totalCritical = 0
    let totalHigh = 0
    let totalMedium = 0
    let totalLow = 0
    let totalVulnerabilities = 0

    // Fetch latest report for each repo to get vulnerability counts
    for (const repo of repos) {
      if (repo.lastScanDate) {
        try {
          const report = await getReportDetails(repo.name, repo.lastScanDate)
          if (report?.data?.Results) {
            const vulnerabilities = report.data.Results.flatMap((result: any) => result.Vulnerabilities || [])
            
            totalCritical += vulnerabilities.filter((v: any) => v.Severity === "CRITICAL").length
            totalHigh += vulnerabilities.filter((v: any) => v.Severity === "HIGH").length
            totalMedium += vulnerabilities.filter((v: any) => v.Severity === "MEDIUM").length
            totalLow += vulnerabilities.filter((v: any) => v.Severity === "LOW").length
            totalVulnerabilities += vulnerabilities.length
          }
        } catch (error) {
          console.error(`Error fetching stats for ${repo.name}:`, error)
        }
      }
    }

    return {
      totalRepositories: repos.length,
      totalCritical,
      totalHigh,
      totalMedium,
      totalLow,
      totalVulnerabilities,
      scannedRepos: repos.filter(r => r.lastScanDate).length,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalRepositories: 0,
      totalCritical: 0,
      totalHigh: 0,
      totalMedium: 0,
      totalLow: 0,
      totalVulnerabilities: 0,
      scannedRepos: 0,
    }
  }
}
