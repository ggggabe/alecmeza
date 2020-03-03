import React, { useRef, useState, Suspense } from 'react'
import ReactDOM from 'react-dom'

//import * as THREE from 'three'
import Debug from 'debug'
import { useFrame, useThree } from 'react-three-fiber'
import useModel from './useModel'

import Menu from './Menu'

//import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
//import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

const debug = Debug('rtf:logo')
export function Loading() {
  return <code> loading </code>
}

const material = { transparent: true, roughness: 0.8, fog: true, shininess: 0, flatShading: false }

const VirginLogo = ({ color, ...props }) => {
  const [geometries] = useModel([process.env.PUBLIC_URL,'untitled.glb'].join('/'))
  const [z, setZ] = useState(3.99)
  const [y, setY] = useState(-0.20)
  const group = useRef()

  let menu = false

  let zDone = false
  let yDone = false
  useFrame(() => {
    group.current.rotation.y = (group.current.rotation.y - .01) % (Math.PI*2)
    if (group.current.position.z > 3.7) {
      setZ(z - .001)
    } else {
      zDone = true
    }

    if (group.current.position.y < .09) {
      setY(y + .001)
      group.current.rotation.x += .001
    } else {
      yDone = true
    }

    if (yDone && zDone && !menu) {
      ReactDOM.render(<Menu />, document.getElementById('menu'))
      menu = true
    }
  })

  return <group ref={group} position={[0, y, z]}>
    {geometries.map(geom => (
      <mesh key={geom.uuid} position={[0,0,0]} geometry={geom} rotation={[Math.PI/2, 0, Math.PI]}>
        <meshPhysicalMaterial attach="material" {...material} color='#dde' />
      </mesh>
    ))}
  </group>
}

/*
function Asset ({url}) {
  const gltf = useLoader(GLTFLoader, url)
  const group = useRef()
  debug({group})

  useFrame(() => {
    group.current.rotation.y += (.05 % (Math.PI/2))
  })

  debug({gltf})
  return <group ref={group} position={[0,0,3.8]} color='red' >
    <primitive object={gltf.scene} dispose={null} position={[0,0,0]} rotation={[Math.PI/2, 0, 0]} color={'red'}/>
  </group>
}
*/

export function Logo (props) {
  const { gl } = useThree()

  debug({
    pcl: gl.physicallyCorrectLights,
    gl
  })
  //gl.physicallyCorrectLights = true

  return <Suspense fallback={null}>
    <VirginLogo position={[0,0,0]} rotation={[Math.PI/2, 0, 0]} color={'red'} />
  </Suspense>
  /*
  return <Suspense fallback={<Box {...props}/>}>
    <Asset {...props} url={[process.env.PUBLIC_URL,'untitled.glb'].join('/')} />
  </Suspense>
  */
}


export default function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  //
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}>
      <dodecahedronBufferGeometry attach="geometry" />
      <meshStandardMaterial
        attach="material"
        roughness={0.75}
        emissive="#404057"
        color={hovered ? 'hotpink' : '#222'} />
    </mesh>
  )
}

