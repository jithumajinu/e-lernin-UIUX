import elearningData from 'app/elearn-data.json'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

export type TopicLesson = {
  id: number
  title: string
  slug: string
  videoUrl?: string
  createdAt: string
}

export type TopicData = {
  count: number
  lessonList: TopicLesson[]
}

export type VideoTutorial = {
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

export type ElearnData = {
  topics: Record<string, TopicData | number>
  videoTutorials: VideoTutorial[]
}

export const POSTS_PER_PAGE = 5

export const getElearnData = (): ElearnData => elearningData as ElearnData

export const normalizeTopic = (topic: TopicData | number): TopicData => {
  if (typeof topic === 'number') {
    return {
      count: topic,
      lessonList: Array.from({ length: topic }, (_, index) => ({
        id: index + 1,
        title: `Lesson ${index + 1}`,
        slug: `lesson-${index + 1}`,
        videoUrl: '',
        createdAt: new Date(2026, 0, Math.max(1, index + 1)).toISOString().slice(0, 10),
      })),
    }
  }

  return {
    count: topic.count ?? topic.lessonList?.length ?? 0,
    lessonList: topic.lessonList ?? [],
  }
}

export const getSortedTopics = (topics: Record<string, TopicData | number>) => {
  return Object.entries(topics).sort((a, b) => {
    const aNum = Number.parseInt(a[0].replace('lesson-', ''), 10)
    const bNum = Number.parseInt(b[0].replace('lesson-', ''), 10)
    return aNum - bNum
  })
}

export const tutorialsToPosts = (tutorials: VideoTutorial[]): CoreContent<Blog>[] => {
  const sorted = [...tutorials].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return sorted.map((tutorial, index) => {
    const lessonTag = `lesson-${index + 1}`
    return {
      path: `epage/${tutorial.id}`,
      date: tutorial.createdAt,
      title: tutorial.title,
      summary: tutorial.description,
      tags: [lessonTag, tutorial.level, tutorial.duration],
    } as CoreContent<Blog>
  })
}

export const topicCountToPosts = (topic: string, topicData: TopicData | number): CoreContent<Blog>[] => {
  const normalized = normalizeTopic(topicData)
  const topicDisplay = topic.replace(/-/g, ' ')

  if (normalized.lessonList.length > 0) {
    return normalized.lessonList.map((lesson) => ({
      path: `epage/${lesson.id}`,
      date: lesson.createdAt,
      title: lesson.title,
      summary: `Lesson content for ${topicDisplay} (${lesson.slug}).`,
      tags: [topic],
      videoUrl: lesson.videoUrl || '',
    })) as unknown as CoreContent<Blog>[]
  }

  return Array.from({ length: normalized.count }, (_, index) => ({
    path: `epage`,
    date: new Date(2026, 0, Math.max(1, index + 1)).toISOString().slice(0, 10),
    title: `${topicDisplay.toUpperCase()} - Part ${index + 1}`,
    summary: `Learning track item ${index + 1} from ${topicDisplay}.`,
    tags: [topic],
  })) as CoreContent<Blog>[]
}
