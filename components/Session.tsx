import { useDailyEvent } from '@daily-co/daily-react-hooks'
import { useCallback, useEffect } from 'react'
import * as faceapi from 'face-api.js'

declare global {
  interface CanvasRenderingContext2D {
    appendAura(auraRegion: any): CanvasRenderingContext2D
  }
}

const CallObject = ({}) => {
  function raiseError(msg: any): void {
    const errorDiv = document.getElementById('call-error') as HTMLElement
    errorDiv.innerText = `Something went wrong but its not your fault: ${JSON.stringify(
      msg
    )}`
  }

  /*
    Handle video
  */

  useDailyEvent(
    'error',
    useCallback(() => raiseError, [])
  )

  useDailyEvent(
    'track-started',
    useCallback((e) => {
      // Because each call has max 2 participants, there's only two places
      // where they can go: local in the corner, full screen for the partner
      if (e.participant.local) {
        let localVid = document.getElementById(`local`) as HTMLVideoElement
        localVid.srcObject = new MediaStream([e.participant.videoTrack])
      } else {
        let otherVid = document.getElementById(`other`) as HTMLVideoElement
        otherVid.srcObject = new MediaStream([e.participant.videoTrack])
      }
    }, [])
  )

  /*
    Load face models so the aura can shape around the partner's face
  */

  useEffect(() => {
    const loadModels = async () => {
      Promise.all([
        faceapi.loadTinyFaceDetectorModel('/models'),
        faceapi.loadFaceLandmarkTinyModel('/models'),
      ])
    }
    loadModels()
  }, [])

  /*
    Assign 12 possible colors to 5 aura sections
  */

  // Chakra colors
  const colors = [
    ['231, 24, 55'], // red
    ['255,170,170'], // pink
    ['255,0,255'], // magenta
    ['252,147,3'], // orange
    ['252,233,3'], // yellow
    ['176,142,103'], // tan
    ['73,182,117'], // green
    ['14,75,239'], // blue
    ['6,184,185'], // turquoise
    ['75,0,130'], // indigo
    ['104,77,119'], // violet
    ['255,255,255'], // white
  ]

  const colorMixer = function () {
    let arr = []
    for (let i = 0; i < 6; i++) {
      arr.push(colors[Math.floor(Math.random() * Math.floor(12))])
    }
    return arr
  }

  let yourAuraColor = colorMixer()
  let counter = 33

  /*
    Append aura zones within space
  */

  type auraRegionProps = {
    position: number[][]
    radius: number
    color: string
    colDelta: number
    auraCircles: number
    circleRadiusRatio: number[]
    ratioCirclesX: number
    ratioCirclesY: number
  }
  // TODO -- move into area where I don't have to run this window check
  if (typeof window !== 'undefined') {
    CanvasRenderingContext2D.prototype.appendAura = function (
      auraRegion: auraRegionProps
    ) {
      // We align the aural plane with our partner's existance
      let context: CanvasRenderingContext2D = this

      // Get the positions relative to the partner's winsome face

      for (let p = 0; p < auraRegion.position.length; p++) {
        for (let i = 0; i < auraRegion.auraCircles; i++) {
          // Auras must be pictured within their range of vision
          let circRadius: number =
            auraRegion.radius *
            (Math.random() *
              (auraRegion.circleRadiusRatio[1] -
                auraRegion.circleRadiusRatio[0]) +
              auraRegion.circleRadiusRatio[0])

          // Intuit a randomized circle position within the Aura.
          const angle = Math.random() * (Math.PI * 2)
          const cx =
            auraRegion.position[p][0] +
            Math.random() *
              Math.cos(angle) *
              (auraRegion.radius - circRadius) *
              auraRegion.ratioCirclesX
          const cy =
            auraRegion.position[p][1] +
            Math.random() *
              Math.sin(angle) *
              (auraRegion.radius - circRadius) *
              auraRegion.ratioCirclesY
          const gradient = context.createRadialGradient(
            cx,
            cy,
            0,
            cx,
            cy,
            circRadius
          )

          // We begin to sense the aura's delicate presence
          context.globalAlpha = 1

          gradient.addColorStop(0, 'rgba(' + auraRegion.color + ',0.5)')
          gradient.addColorStop(0.6, 'rgba(' + auraRegion.color + ',0)')

          // To conclude, we paint the canvas
          context.beginPath()
          context.fillStyle = gradient
          context.arc(cx, cy, circRadius, 0, Math.PI * 2, false)
          context.fill()
          context.closePath()
        }
      }
      return context
    }
  }

  /*
    Create aura zones and apply them 
  */
  function createAura(result: faceapi.FaceDetection) {
    let theCanvas = document.querySelectorAll('canvas')
    let ctx = []
    let i = theCanvas.length
    while (i--) {
      ctx[i] = theCanvas[i].getContext('2d')
    }
    // @ts-ignore: I _will_ reach into the internals
    let x = result._box._x
    // @ts-ignore: for I am attempting to capture
    let y = result._box._y
    // @ts-ignore: my partner's true disposition
    let w = result._box._width
    // @ts-ignore: and I heed no warnings against this
    let h = result._box._height

    /*
      the five aura areas: right, left, top, throat, heart
    */

    // right side
    ctx[0]?.appendAura({
      position: [[x + w + 100, y + h / 2 - 50]],
      radius: h + 150,
      color: yourAuraColor[0],
      colDelta: 50,
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.888],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // left side
    ctx[0]?.appendAura({
      position: [[x - 100, y + h / 2 - 50]],
      radius: h + 150,
      color: yourAuraColor[1],
      colDelta: 50,
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.888],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // top of head, top of mind
    ctx[0]?.appendAura({
      position: [
        [x + w / 2 - 150, y - 100],
        [x + w / 2, y - 100],
        [x + w / 2 + 150, y - 100],
      ],
      radius: w + 150,
      color: yourAuraColor[2],
      colDelta: 50,
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.888],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // throat
    ctx[0]?.appendAura({
      position: [[x + w / 2, y + h - 10]],
      radius: w - 30,
      color: yourAuraColor[4],
      colDelta: 50,
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.6],
      ratioCirclesX: 0.25,
      ratioCirclesY: 0.25,
    })

    // heart
    ctx[0]?.appendAura({
      position: [[x + w / 2, y + h + 30]],
      radius: w + 75,
      color: yourAuraColor[5],
      colDelta: 50,
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.888],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })
  }

  function prepareOnPlay() {
    // just a moment to get into position
    setTimeout(() => onPlay(), 2000)
  }
  // commence
  async function onPlay() {
    const vidElement = document.getElementById('other') as HTMLVideoElement

    let result = await faceapi.detectSingleFace(
      vidElement,
      new faceapi.TinyFaceDetectorOptions()
    )

    if (result) {
      if (counter > 0) {
        createAura(result)
        counter--
      }
    }
    // The aura is revealed through a small amount of patience
    setTimeout(() => onPlay(), 150)
  }

  return (
    <div>
      <div
        id="otherContainer"
        className="flex absolute top-0 left-0 pt-14 pb-5 w-full h-full"
      >
        <video
          autoPlay
          // commence henceforth or whatever
          // when the partner has arrived
          onPlay={() => {
            prepareOnPlay()
          }}
          muted
          id="other"
          className="object-cover w-full h-full"
        ></video>
      </div>
      <canvas
        id="overlay"
        className="flex absolute top-0 left-0 pt-14 pb-5 w-full h-full"
      ></canvas>
      <div
        id="localContainer"
        className="flex absolute bottom-0 right-0 w-60 h-60"
      >
        <video
          autoPlay
          muted
          id="local"
          className="absolute object-cover rounded-t-full bottom-0 right-0 w-60 h-60 flex p-4 m-4"
        ></video>
      </div>
    </div>
  )
}

export default CallObject
