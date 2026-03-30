'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

interface VideoFrameProps {
  url: string
  width?: number
  height?: number
}

function VideoFrame({ url, width = 300, height = 375 }: VideoFrameProps) {
  if (!url) return null
  return (
    <div
      className="bg-gray-900 rounded-lg overflow-hidden mx-auto"
      style={{ width, aspectRatio: `${width} / ${height}` }}
    >
      <video
        controls
        className="w-full h-full object-cover"
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  activeLesson?: string
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  activeLesson,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts
  const selectedPost = selectedLesson ? posts.find((post) => post.path === selectedLesson) : null
  const selectedVideoUrl = (selectedPost?.['videoUrl'] as string) || ''

  useEffect(() => {
    if (selectedLesson) {
      setSelectedLesson(null)
    }
  }, [initialDisplayPosts])

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          {activeLesson && (
            <p className="text-sm font-medium text-gray-600 capitalize dark:text-gray-300">
              Active lesson: {activeLesson.replace(/-/g, ' ')}
            </p>
          )}
          {/* <div className="relative">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
              />
            </label>
             
          </div> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 py-8">
          {selectedLesson !== null && (
            <>
              {/* <div className="col-span-full text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Selected lesson: {selectedPost?.title || selectedLesson}
              </div> */}
              <div className="col-span-fulltext-gray-500 dark:text-gray-400">
                <VideoFrame url={selectedVideoUrl} width={400} height={475} />
              </div>

              <div className="flex flex-col items-start gap-3 rounded-lg border p-4 transition cursor-pointer border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800" >
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="mb-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition"
                  >
                    ← Back
                  </button>
                </div>
                <div className="w-full">
                  xxx <br></br>
                  ssfsdf
                </div>
              </div>
              {/* <div className="col-span-full text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="mb-4 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition"
                >
                  ← Back
                </button>
                <div id="content">
                  dvdfvfd
                  fdvfdg
                  dfgfdg
                  dfgfd
                </div>
              </div> */}

            </>
          )}
          {displayPosts.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No posts found.
            </div>
          )}
          {selectedLesson === null && displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <button
                key={path}
                onClick={() => setSelectedLesson(selectedLesson === path ? null : path)}
                className={`flex flex-col items-start gap-3 rounded-lg border p-4 transition cursor-pointer ${selectedLesson === path
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                  : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
              >
                <div className="flex items-center justify-center">
                  <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-lg ${selectedLesson === path
                    ? 'bg-blue-100 dark:bg-blue-900/50'
                    : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                    📘
                  </span>
                </div>
                <div className="w-full">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {title || path}
                  </h3>
                  {summary && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                      {summary}
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
