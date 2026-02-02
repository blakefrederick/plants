import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'
import {Suspense} from 'react'

import {MorePosts} from '@/app/components/Posts'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {sanityFetch} from '@/sanity/lib/live'
import {postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const [{data: post}] = await Promise.all([sanityFetch({query: postQuery, params})])

  if (!post?._id) {
    return notFound()
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-bark leading-tight mb-6">
              {post.title}
            </h1>
            {post.author && post.author.firstName && post.author.lastName && (
              <div className="flex items-center gap-4 text-sm text-stone-500">
                <span>{post.author.firstName} {post.author.lastName}</span>
                {post.date && (
                  <>
                    <span className="text-stone-300">·</span>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </>
                )}
              </div>
            )}
            <div className="w-16 h-px bg-clay mt-8" />
          </div>
        </div>
      </div>
      
      <article className="pb-16 md:pb-24">
        <div className="container">
          <div className="max-w-2xl">
            {post?.coverImage && (
              <div className="mb-10">
                <Image
                  id={post.coverImage.asset?._ref || ''}
                  alt={post.coverImage.alt || ''}
                  className="w-full"
                  width={800}
                  height={450}
                  mode="cover"
                  hotspot={post.coverImage.hotspot}
                  crop={post.coverImage.crop}
                />
              </div>
            )}
            {post.content?.length && (
              <PortableText
                className="prose prose-stone prose-lg max-w-none"
                value={post.content as PortableTextBlock[]}
              />
            )}
          </div>
        </div>
      </article>

      <section className="py-16 border-t border-stone-200">
        <div className="container">
          <Suspense>
            <MorePosts skip={post._id} limit={2} />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
