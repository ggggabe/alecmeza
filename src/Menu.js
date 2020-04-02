import React, { useRef, useEffect, useState } from 'react'

const PADDING_DEFAULT = 10
const PADDING_MAX = 14
const PADDING_MIN = 0
const PADDING_STEP = 0.5

// Hook
function useHover () {
  const [currentPadding, setPadding] = useState({
    paddingTop: PADDING_DEFAULT,
    paddingBottom: PADDING_DEFAULT
  })

  let { paddingTop, paddingBottom } = currentPadding

  const [value, setValue] = useState(false)
  const [animation, setAnimation] = useState(0)

  let motion = 1

  if (!animation && value) {
    setAnimation(setInterval(() => {
      if (motion) {
        if (motion > 0) { // upwards animation
          if (paddingTop - PADDING_STEP > PADDING_MIN) {
            paddingTop -= PADDING_STEP
            paddingBottom += PADDING_STEP
          } else {
            motion = motion * -1
          }
        } else if (motion < 0) { // downwards animation
          if (paddingTop + PADDING_STEP < PADDING_MAX) {
            paddingTop += PADDING_STEP
            paddingBottom -= PADDING_STEP
          } else {
            motion = motion * -1
          }
        }
        setPadding({
          paddingTop,
          paddingBottom
        })
      }
    }, 1000 / 30))
  } else if (!value && animation) {
    clearInterval(animation)
    setAnimation(0)
  }

  const ref = useRef(null)

  const startWiggle = () => setValue(true)
  const stopWiggle = () => {
    setPadding({
      paddingTop: 10,
      paddingBottom: 10
    })
    setValue(false)
  }

  useEffect(
    () => {
      const node = ref.current
      if (node) {
        node.addEventListener('mouseover', startWiggle)
        node.addEventListener('mouseout', stopWiggle)

        return () => {
          node.removeEventListener('mouseover', startWiggle)
          node.removeEventListener('mouseout', stopWiggle)
        }
      }
    },
    [ref.current] // Recall only if ref changes
  )

  return [ref, currentPadding]
}

const AnimatedLink = ({ href, name }) => {
  const [hoverRef, padding] = useHover()
  const [color, setColor] = useState('#eee')

  return <li ref={hoverRef} onMouseOver={() => setColor('yellow')} onMouseOut={() => setColor('white')}><a
    style={{ ...padding, color }}
    href={href}
    target='_blank'
    rel='noopener noreferrer'
                                                                                                        >{name}
  </a>
  </li>
}

export default () => {
  const menu = [
    { name: 'Apple Music', href: 'https://music.apple.com/us/album/flash-drugs-single/1500256089' },
    { name: 'Spotify', href: 'https://open.spotify.com/album/2DJOCYHCeZjcH7XftmRJV2?si=dc_b-BHnRUa859R0RecM-w' },
    { name: 'Instagram', href: 'https://www.instagram.com/_alecmeza/' },
    { name: 'Twitter', href: 'https://twitter.com/_alecmeza' },
    { name: 'YouTube', href: 'https://youtu.be/beYUQNEpnGo' }
  ]

  return (
    <ul>
      {menu.map((props, i) => <AnimatedLink key={i} {...props} />)}
    </ul>
  )
}
