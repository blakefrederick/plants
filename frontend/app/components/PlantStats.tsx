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
    <section className="py-16 md:py-20">
      <div className="container">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          <div>
            <div className="text-4xl md:text-5xl font-light text-bark mb-2">
              {metadata.totalPlants}
            </div>
            <div className="text-sm text-sage tracking-wide uppercase">Total</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-light text-bark mb-2">
              {metadata.availablePlants}
            </div>
            <div className="text-sm text-sage tracking-wide uppercase">Alive</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-light text-bark mb-2">
              ${metadata.averagePrice || 0}
            </div>
            <div className="text-sm text-sage tracking-wide uppercase">Avg Price</div>
          </div>
          
          <div>
            <div className="text-4xl md:text-5xl font-light text-bark mb-2">
              {metadata.petSafePlants}
            </div>
            <div className="text-sm text-sage tracking-wide uppercase">Flowering</div>
          </div>
        </div>

        {/* Recent Plants */}
        {metadata.recentPlants.length > 0 && (
          <div>
            <p className="text-sage text-sm tracking-widest uppercase mb-6">Recent Additions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {metadata.recentPlants.map((plant) => (
                <Link
                  key={plant.slug}
                  href={`/plants/${plant.slug}`}
                  className="group block p-5 border border-stone-200 hover:border-moss transition-colors"
                >
                  <div className="text-base text-bark group-hover:text-moss transition-colors mb-1">
                    {plant.name}
                  </div>
                  <div className="text-xs text-stone-400 capitalize">
                    {plant.category} · {plant.careLevel}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}