import ListLayout from '@/layouts/ListLayout'
import { notFound } from 'next/navigation'
import {
  getElearnData,
  getSortedTopics,
  normalizeTopic,
  POSTS_PER_PAGE,
  tutorialsToPosts,
} from 'app/epage-data'

export const generateStaticParams = async () => {
  const data = getElearnData()
  const posts = tutorialsToPosts(data.videoTutorials)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

  return paths
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const data = getElearnData()
  const posts = tutorialsToPosts(data.videoTutorials)
  const sortedTopics = getSortedTopics(data.topics)
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages,
  }

  return (
    <div className="pt-6 pb-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="w-full">
          <ListLayout
            posts={posts}
            initialDisplayPosts={initialDisplayPosts}
            pagination={pagination}
            title="All Lessons"
          />
        </div>
        <aside className="w-full max-w-[280px] min-w-[280px] justify-self-end space-y-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Lessons</h2>
          <div className="space-y-2">
            {sortedTopics.map(([lesson, topicData]) => {
              const normalized = normalizeTopic(topicData)
              return (
                <div
                  key={lesson}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-lg dark:bg-gray-700">
                      📘
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{lesson}</span>
                  </div>
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    {normalized.count}
                  </span>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}
