import Link from 'next/link'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'
import {
  getElearnData,
  getSortedTopics,
  normalizeTopic,
  POSTS_PER_PAGE,
  topicCountToPosts,
} from 'app/epage-data'

export const metadata = genPageMetadata({ title: 'Video Tutorials', description: 'Learn with our video tutorials' })

export default async function TutorialsPage(props: {
  searchParams: Promise<{ lesson?: string }>
}) {
  const searchParams = await props.searchParams
  const data = getElearnData()
  const sortedTopics = getSortedTopics(data.topics)
  const availableLessons = sortedTopics.map(([lesson]) => lesson)
  const requestedLesson = searchParams.lesson
  const activeLesson =
    requestedLesson && availableLessons.includes(requestedLesson)
      ? requestedLesson
      : availableLessons[0]

  const activeTopicData = data.topics[activeLesson]
  const posts = topicCountToPosts(activeLesson, activeTopicData)
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <div className="pt-6 pb-8">
      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="w-full max-w-[280px] min-w-[280px] space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lessons</h2>
          <div className="space-y-2">
            {sortedTopics.map(([lesson, topicData]) => {
              const normalized = normalizeTopic(topicData)
              const isActive = lesson === activeLesson
              return (
                <Link
                  key={lesson}
                  href={`/epage?lesson=${encodeURIComponent(lesson)}`}
                  className={`flex items-center justify-between rounded-lg border p-3 transition ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-lg ${
                        isActive ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      📘
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{lesson}</span>
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {normalized.count}
                  </span>
                </Link>
              )
            })}
          </div>
        </aside>
        <div className="w-full">
          <ListLayout
            posts={posts}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
            title="Tutorials"
            activeLesson={activeLesson}
          />
        </div>

      </div>
    </div>
  )
}
