import React, {useState, useEffect} from 'react'
import ProgressiveImage from 'react-progressive-image'
import Blur from 'react-blur'

export default function () {
  const config = {
    src: [process.env.PUBLIC_URL, 'sky.jpeg'].join('/'),
    placeholder: [process.env.PUBLIC_URL, 'sky-tiny.jpg'].join('/')
  }

  const [src, setSrc] = useState(config.placeholder)

  const [blurRadius, setBlurRadius] = useState(20)

  useEffect(() => {
    if (blurRadius <= 0 || src === config.placeholder) return
    const animate = setInterval(setBlurRadius(blurRadius-1), 30)

    return () => clearInterval(animate)
  }, [blurRadius, src, config])


  return <ProgressiveImage {...config}>
      {newSrc => {
        setSrc(newSrc)
        return <Blur img={newSrc} blurRadius={blurRadius} enableStyles/>
      }}
  </ProgressiveImage>
}

