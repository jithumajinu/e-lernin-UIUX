import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { genPageMetadata } from 'app/seo'
import { TutorialImage } from '@/components/TutorialImage'
import elearningData from 'app/elearn-data.json'
import siteMetadata from '@/data/siteMetadata'

type VideoTutorial = {
  id: number
  title: string
  description: string
  duration: string
  topic: string
  level: 'beginner' | 'intermediate' | 'advanced'
  url: string
  thumbnail: string
  createdAt: string
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const id = params.slug[0]
  const tutorials = (elearningData as any).videoTutorials as VideoTutorial[]
  const tutorial = tutorials.find((t) => t.id.toString() === id)

  if (!tutorial) {
    return
  }

  return genPageMetadata({
    title: tutorial.title,
    description: tutorial.description,
  })
}

export const generateStaticParams = async () => {
  const tutorials = (elearningData as any).videoTutorials as VideoTutorial[]
  return tutorials.map((tutorial) => ({
    slug: [tutorial.id.toString()],
  }))
}

export default async function TutorialPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const id = params.slug[0]
  const tutorials = (elearningData as any).videoTutorials as VideoTutorial[]
  const tutorial = tutorials.find((t) => t.id.toString() === id)

  if (!tutorial) {
    notFound()
  }

  const relatedTutorials = tutorials.filter((t) => t.topic === tutorial.topic && t.id !== tutorial.id).slice(0, 3)

  const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-4 pt-6 pb-8">
        <div>
          <Link
            href="/epage"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Tutorials
          </Link>
        </div>
        <div>
          <span className={`inline-block rounded px-3 py-1 text-sm font-semibold ${levelColors[tutorial.level]}`}>
            {tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}
          </span>
        </div>
        <h1 className="text-4xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
          {tutorial.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Duration: {tutorial.duration}</span>
          <span>Topic: {tutorial.topic}</span>
          <span>Published: {new Date(tutorial.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="pt-8 pb-12">
        <div className="mb-8 h-96 overflow-hidden rounded-lg bg-gray-300 dark:bg-gray-700">
          <TutorialImage
            src={tutorial.thumbnail}
            alt={tutorial.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="prose max-w-none dark:prose-invert">
          <h2>About this tutorial</h2>
          <p>{tutorial.description}</p>

          <h3>Watch Now</h3>
          <p>
            <a
              href={tutorial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Watch on YouTube
            </a>
          </p>
        </div>
      </div>

      {relatedTutorials.length > 0 && (
        <div className="pt-8 pb-12">
          <h2 className="mb-6 text-2xl font-extrabold text-gray-900 dark:text-gray-100">Related Tutorials</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedTutorials.map((related) => (
              <Link key={related.id} href={`/epage/${related.id}`}>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="h-32 overflow-hidden bg-gray-300 dark:bg-gray-700">
                    <TutorialImage
                      src={related.thumbnail}
                      alt={related.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {related.title}
                    </h3>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{related.duration}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
