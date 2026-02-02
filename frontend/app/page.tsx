import {Suspense} from 'react'
import Link from 'next/link'
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
    <>
      <div className="relative">
        <div className="relative bg-gradient-to-b from-green-50 to-emerald-50">
          <div className="container">
            <div className="relative min-h-[40vh] mx-auto max-w-2xl pt-10 xl:pt-20 pb-30 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center justify-center">
              <div className="flex flex-col gap-4 items-center">
                <div className="text-md leading-6 prose uppercase py-1 px-3 bg-white/80 backdrop-blur font-mono italic text-green-700 rounded-full">
                  My Own
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-green-900">
                  <span className="text-green-600">Plant</span>
                  <span className="text-green-800"> </span>
                  <span className="text-emerald-600">Collection</span>
                </h1>
                <p className="text-green-700 text-center max-w-md font-light">
                  A very small collection.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <div className="container relative mx-auto max-w-2xl pb-20 pt-10 space-y-6 lg:max-w-4xl lg:px-12 flex flex-col items-center">
            <div className="prose sm:prose-lg md:prose-xl xl:prose-2xl text-green-700 prose-a:text-green-700 font-light text-center">
              {settings?.description && (
                <div
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
        </div>
      </div>
      
      <Suspense fallback={<div className="bg-green-50 py-16 animate-pulse" />}>
        <PlantStats />
      </Suspense>

      <div className="relative emerald-100">
        <div className="container">
          <aside className="py-12 sm:py-20">
            <Suspense>{await AllPosts()}</Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
