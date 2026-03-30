'use client'

import { useState } from 'react'

type TutorialImageProps = {
  src: string
  alt: string
  className?: string
}

export function TutorialImage({ src, alt, className = '' }: TutorialImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  const handleError = () => {
    setImgSrc(
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="160"%3E%3Crect fill="%23ddd" width="400" height="160"/%3E%3C/svg%3E'
    )
  }

  return <img src={imgSrc} alt={alt} className={className} onError={handleError} />
}
