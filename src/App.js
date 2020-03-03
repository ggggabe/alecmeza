import React, { Suspense, useRef, useEffect,  useMemo, useState } from 'react'
import * as THREE from 'three'
import Debug from 'debug'
import { useThree, Canvas, useFrame, extend } from 'react-three-fiber'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from './postprocessing/UnrealBloomFix'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'

import  { Loading, Logo } from './Logo'
import {CrtShader, RGBShiftShader} from './CustomEffects'

const debug = Debug('rtf:main')

extend({ ShaderPass, UnrealBloomPass, EffectComposer, RenderPass })

function Effect ({nobloom}) {
  const composer = useRef()
  const { scene, gl, size, camera } = useThree()
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [size])
  useEffect(() => void composer.current.setSize(size.width, size.height), [size])
  const [rgb, setRgb] = useState(.01)

  useFrame(({gl, scene}) => {
    if (rgb > .0025) {
      setRgb(rgb - .00005)
    }

    return composer.current.render()
  }, 1)

  const noclears = {
    clearAlpha: false
  }
  debug({camera})

  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass {...noclears} attachArray="passes" scene={scene} camera={camera}/>
      <unrealBloomPass {...noclears} attachArray="passes" args={[aspect, .8, .4, 0]} />
      <shaderPass {...noclears}
        attachArray="passes"
        args={[RGBShiftShader]}
        material-uniforms-amount-value={rgb}
      />
      <shaderPass {...noclears}
        attachArray="passes"
        args={[CrtShader]}
      />
    </effectComposer>
  )
}

export default function () {
  return <div style={{width: '100%', height: '100%'}}>
    <Canvas gl={{alpha: true}} camera={{ position:[0,-.04,4], fov: 75 }}>
      <pointLight position={[0, 0, 10]} />
      <Logo position={[0, 0, 0]} />

      <Suspense fallback={<Loading />}>
        <Effect />
      </Suspense>
    </Canvas>
  </div>
}
