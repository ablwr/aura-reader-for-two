import { useDailyEvent } from '@daily-co/daily-react-hooks'
import { useCallback, useEffect, useState } from 'react'
import * as faceapi from 'face-api.js'

declare global {
  interface CanvasRenderingContext2D {
    appendAura(auraRegion: any): CanvasRenderingContext2D
  }
}

const CallObject = () => {
  const [errorMsg, setErrorMsg] = useState<string>('')

  /*
    Take care of any errors, send guidance and clarity
  */

  function raiseError(msg: any): void {
    if (msg.errorMsg) {
      // e.g. "Meeting is full", can handle more precisely later
      setErrorMsg(msg.errorMsg)
    }
  }

  useDailyEvent(
    'error',
    useCallback((ev) => {
      raiseError(ev)
    }, [])
  )

  function handleLeftMeeting(msg: any): void {
    // local participant has left the meeting
    // "the end"
    // right now there's no way to "leave"
  }

  useDailyEvent(
    'left-meeting',
    useCallback((ev) => {
      handleLeftMeeting(ev)
    }, [])
  )

  /*
    Handle video
  */

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
        let otherAud = document.getElementById(`otherAud`) as HTMLAudioElement
        otherAud.srcObject = new MediaStream([e.participant.audioTrack])
      }
    }, [])
  )

  /*
    Start aura-building when partner joins
  */
  function prepareOnPlay() {
    // allow just a moment to get into position
    // after the partner has arrived
    setTimeout(() => onPlay(), 2000)
  }

  useDailyEvent(
    'participant-joined',
    useCallback(() => {
      const shareLink: HTMLElement = document.getElementById(
        'shareLink'
      ) as HTMLElement
      shareLink.setAttribute('style', 'display:none')
      prepareOnPlay()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  /*
    Load face models so the aura can shape around the partner's face
  */
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
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
    ['231, 24, 55'], // red : busy
    ['255,170,170'], // pink : gentle
    ['255,0,255'], // magenta : creative
    ['252,147,3'], // orange : social
    ['252,233,3'], // yellow : confident
    ['176,142,103'], // tan : steady
    ['73,182,117'], // green : growth
    ['14,75,239'], // blue : peace
    ['6,184,185'], // turquoise : empathy
    ['75,0,130'], // indigo : intuition
    ['104,77,119'], // violet : visionary
    ['255,255,255'], // white : centered or in flux
  ]

  const colorMixer = function () {
    let arr = []
    for (let i = 0; i < 6; i++) {
      arr.push(colors[Math.floor(Math.random() * Math.floor(12))])
    }
    return arr
  }

  let auraColors = colorMixer()

  /*
    Append aura zones within space
  */

  type auraRegionProps = {
    context: any
    position: number[][]
    radius: number
    color: string[]
    auraCircles: number
    circleRadiusRatio: number[]
    ratioCirclesX: number
    ratioCirclesY: number
  }

  /*
    Create aura zones and apply them 
  */

  function appendAura(auraRegion: auraRegionProps) {
    // Get the positions relative to the partner's winsome face
    for (let p = 0; p < auraRegion.position.length; p++) {
      for (let i = 0; i < auraRegion.auraCircles; i++) {
        // Auras must be pictured within their range of vision
        let circRadius: number =
          auraRegion.radius *
          (1.5 *
            (auraRegion.circleRadiusRatio[1] -
              auraRegion.circleRadiusRatio[0]) +
            auraRegion.circleRadiusRatio[0])

        // Intuit a randomized circle position within the Aura
        const angle = 0.9 * (Math.PI * 2)
        const cx =
          auraRegion.position[p][0] +
          0.9 *
            Math.cos(angle) *
            (auraRegion.radius - circRadius) *
            auraRegion.ratioCirclesX
        const cy =
          auraRegion.position[p][1] +
          0.9 *
            Math.sin(angle) *
            (auraRegion.radius - circRadius) *
            auraRegion.ratioCirclesY
        const gradient = auraRegion.context.createRadialGradient(
          cx,
          cy,
          0,
          cx,
          cy,
          circRadius
        )

        // We begin to sense the aura's delicate presence
        auraRegion.context.globalAlpha = 1

        gradient.addColorStop(0, 'rgba(' + auraRegion.color + ',0.5)')
        gradient.addColorStop(0.9, 'rgba(' + auraRegion.color + ',0)')

        // To conclude, we paint the canvas
        auraRegion.context.beginPath()
        auraRegion.context.fillStyle = gradient
        auraRegion.context.arc(cx, cy, circRadius, 0, Math.PI * 2, false)
        auraRegion.context.fill()
        auraRegion.context.closePath()
      }
    }

    return auraRegion.context
  }

  function createAura(
    detections: faceapi.WithFaceLandmarks<
      { detection: faceapi.FaceDetection },
      faceapi.FaceLandmarks68
    >
  ) {
    const canvas = document.getElementById('overlay') as HTMLCanvasElement

    const displaySize = { width: window.innerWidth, height: window.innerHeight }
    faceapi.matchDimensions(canvas, displaySize)

    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    // x,y = size of video display
    const x: number = resizedDetections.detection.box.x
    const y: number = resizedDetections.detection.box.y
    // w,h = size of face, in pixels
    const w: number = resizedDetections.detection.box.width
    const h: number = resizedDetections.detection.box.height

    canvas.width = displaySize.width
    canvas.height = displaySize.height

    const context = canvas.getContext('2d') as CanvasRenderingContext2D

    /*
      there are five aura areas: right, left, top, throat, core
        (their) right : leaving energy
        (their) left : arriving energy
        top : present energy
        throat : communicated energy
        core : heart energy
    */

    // right side
    appendAura({
      context: context,
      position: [
        [x + w + 100, y + h / 2 - 100],
        [x + w + 100, y + h / 2 - 50],
        [x + w + 100, y + h / 2 - 150],
      ],
      radius: h + 150,
      color: auraColors[0],
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.7],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // left side
    appendAura({
      context: context,
      position: [
        [x - 100, y + h / 2 - 100],
        [x - 100, y + h / 2 - 50],
        [x - 100, y + h / 2 - 150],
      ],
      radius: h + 150,
      color: auraColors[1],
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.7],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // top of head, top of mind
    appendAura({
      context: context,
      position: [
        [x + w / 2 - 150, y - 100],
        [x + w / 2, y - 100],
        [x + w / 2 + 150, y - 100],
      ],
      radius: w + 150,
      color: auraColors[2],
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.7],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // core
    appendAura({
      context: context,
      position: [
        [x + w / 2 - 150, y + h + 175],
        [x + w / 2, y + h + 175],
        [x + w / 2 + 150, y + h + 175],
      ],
      radius: w + 75,
      color: auraColors[5],
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.7],
      ratioCirclesX: 0.5,
      ratioCirclesY: 0.5,
    })

    // throat
    appendAura({
      context: context,
      position: [[x + w / 2, y + h - 10]],
      radius: w,
      color: auraColors[4],
      auraCircles: 1,
      circleRadiusRatio: [0.1, 0.6],
      ratioCirclesX: 0.25,
      ratioCirclesY: 0.25,
    })
  }

  // commence
  async function onPlay() {
    const input = document.getElementById('other') as HTMLVideoElement
    const model = new faceapi.TinyFaceDetectorOptions()
    const detections = await faceapi
      .detectSingleFace(input, model)
      .withFaceLandmarks(true)

    // We align the aural plane with our partner's existence
    if (detections) {
      createAura(detections)
    }

    // The aura is revealed only through a small amount of patience
    setTimeout(() => onPlay(), 50)
  }

  return (
    <>
      {errorMsg ? (
        <div
          id="error-msg"
          className="flex absolute text-left text-2xl text-white z-50"
        >
          {errorMsg}
        </div>
      ) : (
        <div>
          <div
            id="otherContainer"
            className="flex absolute top-0 left-0 pt-14 pb-5 w-full h-full"
          >
            <video
              autoPlay
              muted
              id="other"
              className="object-cover w-full h-full"
            ></video>
            <audio autoPlay id="otherAud"></audio>
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
              className="absolute object-cover rounded-l-full bottom-10 right-0 w-32 h-32 md:w-60 md:h-60 md:bottom-10"
            ></video>
          </div>
        </div>
      )}
    </>
  )
}

export default CallObject
