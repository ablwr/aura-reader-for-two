import { useState } from 'react'

const Footer = ({}) => {
  const [showMeanings, setShowMeanings] = useState(false)
  const toggleRevealMeanings = () => setShowMeanings(!showMeanings)

  const Meanings = () => (
    <div className="grid text-sm lg:text-lg lg:grid-cols-3">
      <div>
        <div>red : busy</div>
        <div>pink : gentle</div>
        <div>magenta : creative</div>
        <div>orange : social</div>
        <div>yellow : confident</div>
        <div>tan : steady</div>
      </div>
      <div>
        <div>green : growth</div>
        <div>blue : peace</div>
        <div>turquoise : empathy</div>
        <div>indigo : intuition</div>
        <div>violet : visionary</div>
        <div>white : centered</div>
      </div>
      <div>
        <div>(their) right : leaving energy</div>
        <div>(their) left : arriving energy</div>
        <div>top : present energy</div>
        <div>throat : communicated energy</div>
        <div>core : heart energy</div>
      </div>
    </div>
  )

  return (
    <footer className="p-2 text-lg text-center gap-4 bg-indigo-300 text-indigo-800 z-50">
      <a
        className="bg-indigo-300 text-xl float-left"
        href="https://github.com/ablwr/aura-reader-for-two"
      >
        🔮
      </a>
      <div className="cursor-pointer" onClick={toggleRevealMeanings}>
        Color/position meanings
        {showMeanings ? <Meanings /> : <div></div>}
      </div>
    </footer>
  )
}

export default Footer
