import Link from 'next/link'
import {sanityFetch} from '@/sanity/lib/live'
import {plantsStatsQuery} from '@/sanity/lib/queries'

interface PlantStats {
  totalPlants: number
  availablePlants: number
  petSafePlants: number
  averagePrice: number
  recentPlants: Array<{
    name: string
    slug: string
    category: string
    careLevel: string
  }>
}

export async function PlantStats() {
  const {data: metadata} = await sanityFetch({
    query: plantsStatsQuery,
  })

  if (!metadata) return null

  return (
    <div className="bg-green-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-green-900 mb-4">
              Plant Stats
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metadata.totalPlants}
              </div>
              <div className="text-sm text-green-700 font-medium">Total Plants</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {metadata.availablePlants}
              </div>
              <div className="text-sm text-green-700 font-medium">Available</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                ${metadata.averagePrice || 0}
              </div>
              <div className="text-sm text-green-700 font-medium">Avg Price</div>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {metadata.petSafePlants}
              </div>
              <div className="text-sm text-green-700 font-medium">Pet Safe</div>
            </div>
          </div>

          {/* Recent Plants */}
          {metadata.recentPlants.length > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Recently Added</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {metadata.recentPlants.map((plant) => (
                  <Link
                    key={plant.slug}
                    href={`/plants/${plant.slug}`}
                    className="group p-4 rounded-lg hover:bg-green-50 transition-colors border"
                  >
                    <div className="font-medium text-green-900 group-hover:text-green-600 mb-2">
                      {plant.name}
                    </div>
                    <div className="text-sm text-green-600 capitalize">
                      {plant.category} • {plant.careLevel}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}