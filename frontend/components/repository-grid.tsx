import { RepositoryCard } from "@/components/repository-card"
import { getRepositories } from "@/lib/s3"

export async function RepositoryGrid() {
  const repositories = await getRepositories()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Repositorios</h2>
          <p className="text-sm text-muted-foreground">Resultados de escaneo de seguridad para todos los repositorios monitoreados</p>
        </div>
      </div>

      {repositories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron repositorios
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {repositories.map((repo) => (
            <RepositoryCard key={repo.name} repository={repo} />
          ))}
        </div>
      )}
    </div>
  )
}
