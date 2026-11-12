import { useState } from 'react'
import { Link } from 'react-router-dom'
import GolfProgress from '../components/GolfProgress.jsx'
import BookingWidget from '../components/BookingWidget.jsx'
import { bookPage } from '../content.js'

const STEPS = ['Tee', 'Fairway', 'Green', 'Hole']

export default function Book() {
  const [step, setStep] = useState(0)
  const [kind, setKind] = useState('hourly')
  const [golfers, setGolfers] = useState(2)
  const [signed, setSigned] = useState(false)

  const go = (n) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="book fill">
      <div className="container book-inner">
        <GolfProgress steps={STEPS} current={step} onStep={go} />

        <div className={`book-stage ${step === 2 ? 'book-stage-wide' : ''}`} key={step}>
          {step === 0 && (
            <>
              <h1>How are you playing?</h1>
              <div className="choice-grid">
                <button className={`choice ${kind === 'hourly' ? 'on' : ''}`} onClick={() => setKind('hourly')}>
                  <strong>Hourly</strong>
                  <span>From $40/hr · entire studio</span>
                </button>
                <button className={`choice ${kind === 'member' ? 'on' : ''}`} onClick={() => setKind('member')}>
                  <strong>Membership hours</strong>
                  <span>Use your included time</span>
                </button>
              </div>
              <h3 className="sub-q">Golfers</h3>
              <div className="counter" role="group" aria-label="Number of golfers">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button key={n} className={golfers === n ? 'on' : ''} onClick={() => setGolfers(n)} aria-pressed={golfers === n}>{n}</button>
                ))}
              </div>
              <div className="book-nav">
                <span />
                <button className="btn btn-primary" onClick={() => go(1)}>Continue</button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1>Waivers</h1>
              <p className="muted">
                {golfers === 1 ? 'You need a signed waiver' : golfers === 2 ? 'Both golfers need a signed waiver' : `All ${golfers} golfers need a signed waiver`} before entering. Each lasts 12 months.
              </p>
              <a href="/waiver" target="_blank" rel="noreferrer" className="btn btn-outline">Open waiver ↗</a>
              <label className="check confirm">
                <input type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
                <span>{golfers === 1 ? 'I’ve signed' : 'Everyone in my group has signed'}</span>
              </label>
              <div className="book-nav">
                <button className="btn btn-text" onClick={() => go(0)}>Back</button>
                <button className="btn btn-primary" disabled={!signed} onClick={() => go(2)}>Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="stage-head">
                <h1>Pick your time</h1>
                {kind === 'member' && <p className="muted">Sign in inside the calendar to use your hours.</p>}
              </div>
              <BookingWidget />
              <div className="book-nav">
                <button className="btn btn-text" onClick={() => go(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => go(3)}>I’ve booked</button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="finish">
              <h1>You’re on the tee sheet.</h1>
              <ol className="timeline">
                <li><strong>Check your email</strong><span>Door and bay PINs arrive after booking.</span></li>
                <li><strong>Arrive</strong><span>Codes activate 5 minutes before your time.</span></li>
                <li><strong>Play</strong><span>The studio is yours until your time ends.</span></li>
              </ol>
              <ul className="chips">
                <li>Bring your own clubs</li>
                <li>Light-colored clubs may misread</li>
                <li>Vending inside</li>
                <li>Up to 6 golfers</li>
              </ul>
              <p className="muted small">{bookPage.agreement}</p>
              <div className="book-nav">
                <button className="btn btn-text" onClick={() => { setSigned(false); go(0) }}>Book another</button>
                <Link to="/" className="btn btn-primary">Done</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
