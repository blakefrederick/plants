import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from '@portabletext/react'

import {sanityFetch} from '@/sanity/lib/live'
import {plantDetailsQuery} from '@/sanity/lib/queries'

type Props = {
  params: Promise<{slug: string}>
}

export default async function PlantPage(props: Props) {
  const params = await props.params
  const {data: plant} = await sanityFetch({
    query: plantDetailsQuery,
    params: {slug: params.slug},
  })

  if (!plant) {
    return notFound()
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Back link */}
      <div className="container pt-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sage hover:text-moss transition-colors text-sm"
        >
          ← Back
        </Link>
      </div>

      <div className="container py-12 md:py-16">
        <div className="max-w-2xl">
          {/* "Header" */}
          <div className="mb-10">
            <p className="text-sage text-sm tracking-widest uppercase mb-3">
              {plant.category}
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-bark mb-3">
              {plant.name}
            </h1>
            {plant.scientificName && (
              <p className="text-stone-500 italic text-lg">
                {plant.scientificName}
              </p>
            )}
            <div className="w-16 h-px bg-clay mt-6" />
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 py-6 border-y border-stone-200">
            {plant.careLevel && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-1">Care</p>
                <p className="text-bark capitalize">{plant.careLevel}</p>
              </div>
            )}
            {plant.lightRequirements && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-1">Light</p>
                <p className="text-bark capitalize">{plant.lightRequirements.replace('-', ' ')}</p>
              </div>
            )}
            {plant.wateringFrequency && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-1">Water</p>
                <p className="text-bark capitalize">{plant.wateringFrequency.replace('-', ' ')}</p>
              </div>
            )}
            {plant.price && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-1">Price</p>
                <p className="text-bark">${plant.price}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {plant.description && (
            <div className="prose prose-stone mb-10">
              <PortableText value={plant.description} />
            </div>
          )}

          {/* Additional Details */}
          <div className="space-y-6">
            {plant.commonNames && plant.commonNames.length > 0 && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-2">Also known as</p>
                <p className="text-stone-600">{plant.commonNames.join(', ')}</p>
              </div>
            )}

            {plant.size && (plant.size.height || plant.size.width) && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-2">Mature Size</p>
                <p className="text-stone-600">
                  {plant.size.height && `${plant.size.height}cm tall`}
                  {plant.size.height && plant.size.width && ' · '}
                  {plant.size.width && `${plant.size.width}cm wide`}
                </p>
              </div>
            )}

            {plant.toxicity && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-2">Safety</p>
                <div className="flex gap-4 text-stone-600">
                  <span className={plant.toxicity.isPetSafe ? 'text-moss' : 'text-stone-400'}>
                    {plant.toxicity.isPetSafe ? '✓' : '✗'} Pet safe
                  </span>
                  <span className={plant.toxicity.isChildSafe ? 'text-moss' : 'text-stone-400'}>
                    {plant.toxicity.isChildSafe ? '✓' : '✗'} Child safe
                  </span>
                </div>
              </div>
            )}

            {plant.tags && plant.tags.length > 0 && (
              <div>
                <p className="text-xs text-sage uppercase tracking-wide mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {plant.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 text-sm text-stone-600 border border-stone-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {plant.availability !== undefined && (
              <div className="pt-4">
                <span className={`inline-flex items-center gap-2 text-sm ${plant.availability ? 'text-moss' : 'text-stone-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${plant.availability ? 'bg-moss' : 'bg-stone-300'}`} />
                  {plant.availability ? 'Available' : 'Not available'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
