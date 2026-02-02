import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery, allPostsQuery} from '@/sanity/lib/queries'
import {AllPostsQueryResult} from '@/sanity.types'
import DateComponent from '@/app/components/Date'
import OnBoarding from '@/app/components/Onboarding'
import {dataAttr} from '@/sanity/lib/utils'

const Post = ({post}: {post: AllPostsQueryResult[number]}) => {
  const {_id, title, slug, excerpt, date, author} = post

  return (
    <article
      data-sanity={dataAttr({id: _id, type: 'post', path: 'title'}).toString()}
      key={_id}
      className="group relative border-b border-stone-200 py-8 first:pt-0"
    >
      <Link className="block" href={`/posts/${slug}`}>
        <span className="absolute inset-0 z-10" />
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl text-bark group-hover:text-moss transition-colors mb-3">
              {title}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xl line-clamp-2">
              {excerpt}
            </p>
          </div>
          <div className="flex items-center gap-4 md:text-right">
            {author && author.firstName && author.lastName && (
              <span className="text-sm text-stone-400">
                {author.firstName} {author.lastName}
              </span>
            )}
            <time className="text-stone-400 text-sm tabular-nums" dateTime={date}>
              <DateComponent dateString={date} />
            </time>
          </div>
        </div>
      </Link>
    </article>
  )
}

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode
  heading?: string
  subHeading?: string
}) => (
  <div>
    {heading && <h2 className="text-2xl md:text-3xl font-light text-bark mb-8">{heading}</h2>}
    {subHeading && (
      <p className="text-sage text-sm tracking-widest uppercase mb-8">{subHeading}</p>
    )}
    <div>{children}</div>
  </div>
)

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  const {data} = await sanityFetch({
    query: morePostsQuery,
    params: {skip, limit},
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts heading={`Recent Posts (${data?.length})`}>
      {data?.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async () => {
  const {data} = await sanityFetch({query: allPostsQuery})

  if (!data || data.length === 0) {
    return <OnBoarding />
  }

  return (
    <Posts subHeading="Journal">
      {data.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}
