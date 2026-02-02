import {Suspense} from 'react'
import {PortableText} from '@portabletext/react'

import {AllPosts} from '@/app/components/Posts'
import {PlantStats} from '@/app/components/PlantStats'
import {settingsQuery} from '@/sanity/lib/queries'
import {sanityFetch} from '@/sanity/lib/live'
import {dataAttr} from '@/sanity/lib/utils'

export default async function Page() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
  })

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container">
          <div className="max-w-2xl">
            <p className="text-sage text-sm tracking-widest uppercase mb-6">
              Collection
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-bark leading-none mb-8">
              Plants
            </h1>
            <div className="w-16 h-px bg-clay mb-8" />
            {settings?.description && (
              <div
                className="text-stone-600 text-lg leading-relaxed max-w-lg"
                data-sanity={dataAttr({
                  id: settings._id,
                  type: 'settings',
                  path: 'description',
                }).toString()}
              >
                <PortableText value={settings.description} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <Suspense fallback={<div className="h-48" />}>
        <PlantStats />
      </Suspense>

      {/* Posts */}
      <section className="py-16 md:py-24 border-t border-stone-200">
        <div className="container">
          <Suspense>{await AllPosts()}</Suspense>
        </div>
      </section>
    </div>
  )
}
