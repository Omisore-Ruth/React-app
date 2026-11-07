
import { useEffect, useRef, useState } from 'react'

import logo from './assets/logo.png'
import portrait1 from './assets/myportrait.png'
import portrait2 from './assets/myportrait2.png'
import portrait3 from './assets/myportrait4.png'
import portrait4 from './assets/myportrait23.png'
import aboutPortrait from './assets/myportrait2.png'
import shutterSound from './assets/camera-shutter.mp3'

import './App.css'

const portraits = [
  portrait1,
  portrait2,
  portrait3,
  portrait4,
  portrait1,
]

const pages = ['Home', 'About', 'Counter', 'Meet Me']

function App() {
  const [activePage, setActivePage] = useState(0)
  const [activePortrait, setActivePortrait] = useState(0)
  const [count, setCount] = useState(0)
  const [greeting, setGreeting] = useState('Hello there!')
  const [visitorName, setVisitorName] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const audioRef = useRef(null)
  const touchStart = useRef({ x: 0, y: 0 })
  const animationTimer = useRef(null)
  const wheelLocked = useRef(false)

  // Navigate between pages
  const goToPage = (index) => {
    if (index < 0 || index >= pages.length) return
    setActivePage(index)
  }

  // Play camera shutter sound
  const playShutter = () => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  // Animate portrait changes
  const triggerPortraitAnimation = () => {
    setIsAnimating(true)

    if (animationTimer.current) {
      clearTimeout(animationTimer.current)
    }

    animationTimer.current = setTimeout(() => {
      setIsAnimating(false)
    }, 650)
  }

  // Change portraits
  const changePortrait = (direction = 1) => {
    setActivePortrait((current) =>
      (current + direction + portraits.length) % portraits.length
    )

    triggerPortraitAnimation()
    playShutter()
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setActivePage((current) =>
          Math.min(current + 1, pages.length - 1)
        )
      }

      if (event.key === 'ArrowLeft') {
        setActivePage((current) =>
          Math.max(current - 1, 0)
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Spark custom cursor
  useEffect(() => {
    const cursor = document.querySelector('.spark-cursor')

    const moveCursor = (event) => {
      if (!cursor) return

      cursor.style.left = `${event.clientX}px`
      cursor.style.top = `${event.clientY}px`
    }

    window.addEventListener('mousemove', moveCursor)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
    }
  }, [])

  // Clean up animation timer
  useEffect(() => {
    return () => {
      if (animationTimer.current) {
        clearTimeout(animationTimer.current)
      }
    }
  }, [])

  // Mouse wheel page navigation
  const handlePageWheel = (event) => {
    if (Math.abs(event.deltaY) < 35) return
    if (wheelLocked.current) return

    // Allow normal vertical scrolling inside a page
    const page = event.target.closest('.page')

    if (page && page.scrollHeight > page.clientHeight + 5) {
      const atTop = page.scrollTop <= 0
      const atBottom =
        page.scrollTop + page.clientHeight >= page.scrollHeight - 5

      if (
        (event.deltaY < 0 && !atTop) ||
        (event.deltaY > 0 && !atBottom)
      ) {
        return
      }
    }

    wheelLocked.current = true

    if (event.deltaY > 0) {
      setActivePage((current) =>
        Math.min(current + 1, pages.length - 1)
      )
    } else {
      setActivePage((current) =>
        Math.max(current - 1, 0)
      )
    }

    setTimeout(() => {
      wheelLocked.current = false
    }, 900)
  }

  // Touch navigation
  const handleTouchStart = (event) => {
    touchStart.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  }

  const handleTouchEnd = (event) => {
    const differenceX =
      touchStart.current.x - event.changedTouches[0].clientX

    const differenceY =
      touchStart.current.y - event.changedTouches[0].clientY

    // Only navigate pages when the gesture is horizontal
    if (Math.abs(differenceX) < 60) return
    if (Math.abs(differenceX) < Math.abs(differenceY)) return

    if (differenceX > 0) {
      setActivePage((current) =>
        Math.min(current + 1, pages.length - 1)
      )
    } else {
      setActivePage((current) =>
        Math.max(current - 1, 0)
      )
    }
  }

  // Greeting buttons
  const handleGreeting = (message) => {
    setGreeting(message)
  }

  // Personalised visitor greeting
  const handleNameSubmit = (event) => {
    event.preventDefault()

    const cleanName = visitorName.trim()

    if (!cleanName) return

    setSubmittedName(cleanName)
  }

  // Counter result: automatically determines even or odd
  const numberType = count % 2 === 0 ? 'Even' : 'Odd'

  return (
    <div
      className="site-shell"
      onWheel={handlePageWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <audio
        ref={audioRef}
        src={shutterSound}
        preload="auto"
      />

      {/* NAVIGATION */}
      <header className="navbar">
        <a
          href="#home"
          className="brand"
          onClick={(event) => {
            event.preventDefault()
            goToPage(0)
          }}
        >
          <img src={logo} alt="Personal logo" />
        </a>

        <nav className="nav-links">
          {pages.map((page, index) => (
            <button
              key={page}
              className={`nav-link ${
                activePage === index ? 'active' : ''
              }`}
              onClick={() => goToPage(index)}
            >
              {page}
            </button>
          ))}
        </nav>

        <div className="nav-number">
          <span>0{activePage + 1}</span>
          <span className="nav-divider">/</span>
          <span>04</span>
        </div>
      </header>

      {/* HORIZONTAL PAGES */}
      <main className="pages-container">
        <div
          className="pages-track"
          style={{
            transform: `translateX(-${activePage * 100}vw)`,
          }}
        >
          {/* HOME PAGE */}
          <section className="page home-page" id="home">
            <div className="hero-content">
              <div className="hero-copy">
                <p className="eyebrow">
                  WELCOME TO MY LITTLE CORNER
                </p>

                <h1>
                  Hello,
                  <br />
                  I'm <span>Ruth.</span>
                </h1>

                <p className="hero-description">
                  A creative mind, a curious learner, and a
                  developer who enjoys bringing ideas to life
                  through design and technology.
                </p>

                <div className="hero-actions">
                  <button
                    className="gold-button"
                    onClick={() => goToPage(1)}
                  >
                    Get to know me
                    <span>↗</span>
                  </button>

                  <button
                    className="text-button"
                    onClick={() => goToPage(3)}
                  >
                    Say hello
                  </button>
                </div>

                <div className="hero-caption">
                  <span className="caption-line"></span>
                  <span>CREATIVE THINKER · WEB DESIGNER</span>
                </div>
              </div>

              {/* INTERACTIVE PORTRAITS */}
              <div className="portrait-area">
                <div className="portrait-heading">
                  <span>THE MANY SIDES OF ME</span>
                  <span>0{activePortrait + 1} / 05</span>
                </div>

                <div
                  className={`portrait-stack ${
                    isAnimating ? 'changing' : ''
                  }`}
                >
                  {portraits.map((portrait, index) => {
                    const position =
                      (index - activePortrait + portraits.length) %
                      portraits.length

                    return (
                      <button
                        key={index}
                        className={`portrait-card card-position-${position}`}
                        onClick={() => {
                          if (position === 0) {
                            changePortrait(1)
                          } else {
                            setActivePortrait(index)
                            playShutter()
                            triggerPortraitAnimation()
                          }
                        }}
                        aria-label={`View portrait ${index + 1}`}
                      >
                        <img
                          src={portrait}
                          alt={`Ruth portrait ${index + 1}`}
                        />
                      </button>
                    )
                  })}
                </div>

                <div className="portrait-controls">
                  <button
                    className="portrait-arrow"
                    onClick={() => changePortrait(-1)}
                    aria-label="Previous portrait"
                  >
                    ←
                  </button>

                  <span>CLICK THE PHOTOS TO EXPLORE</span>

                  <button
                    className="portrait-arrow"
                    onClick={() => changePortrait(1)}
                    aria-label="Next portrait"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="home-bottom">
              <span>SCROLL OR USE THE ARROWS TO NAVIGATE</span>

              <button onClick={() => goToPage(1)}>
                ↓
              </button>

              <span>© 2026</span>
            </div>
          </section>

          {/* ABOUT PAGE */}
          <section className="page about-page" id="about">
            <div className="about-layout">
              <div className="about-image-column">
                <div className="about-image-frame">
                  <div className="frame-inner">
                    <img
                      src={aboutPortrait}
                      alt="Ruth sitting at a computer"
                    />
                  </div>
                </div>

                <span className="image-note">
                  A LITTLE BIT ABOUT ME
                </span>
              </div>

              <div className="about-copy">
                <p className="eyebrow">BEHIND THE SCREEN</p>

                <h2>
                  More than
                  <br />
                  <span>what you see.</span>
                </h2>

                <p>
                  I'm Ruth, a creative individual with an interest
                  in technology, design, and the process of turning
                  ideas into something meaningful.
                </p>

                <p>
                  I enjoy learning, experimenting, solving problems,
                  and finding new ways to express ideas through
                  digital experiences.
                </p>

                <p>
                  This space is a little introduction to who I am,
                  what I enjoy, and the things I'm learning along
                  the way.
                </p>

                <button
                  className="gold-button"
                  onClick={() => goToPage(2)}
                >
                  There's more
                  <span>↗</span>
                </button>
              </div>
            </div>

            <div className="page-footer">
              <span>02 — ABOUT</span>
              <span>GETTING TO KNOW ME</span>
            </div>
          </section>

          {/* COUNTER PAGE */}
          <section className="page counter-page" id="counter">
            <div className="counter-content">
              <p className="eyebrow">A LITTLE INTERACTION</p>

              <h2>
                Let's count
                <br />
                <span>something.</span>
              </h2>

              <p className="counter-description">
                A simple counter to test your clicking skills.
                Increase the number, decrease it, or start again.
              </p>

              <div className="counter-display">
                {String(count).padStart(2, '0')}
              </div>

              {/* EVEN / ODD RESULT */}
              <div className={`number-result ${numberType.toLowerCase()}`}>
                <span className="result-label">NUMBER TYPE</span>
                <strong>{numberType} Number</strong>
              </div>

              <div className="counter-buttons">
                <button
                  className="counter-button"
                  onClick={() => setCount((current) => current - 1)}
                  aria-label="Decrease counter"
                >
                  −
                </button>

                <button
                  className="counter-button reset-button"
                  onClick={() => setCount(0)}
                >
                  RESET
                </button>

                <button
                  className="counter-button"
                  onClick={() => setCount((current) => current + 1)}
                  aria-label="Increase counter"
                >
                  +
                </button>
              </div>

              <p className="counter-note">
                EVERY CLICK COUNTS.
              </p>
            </div>

            <div className="page-footer">
              <span>03 — COUNTER</span>
              <span>ONE CLICK AT A TIME</span>
            </div>
          </section>

          {/* MEET ME PAGE */}
          <section className="page meet-page" id="meet">
            <div className="meet-content">
              <p className="eyebrow">YOU MADE IT TO THE END</p>

              <h2>
                It's nice
                <br />
                <span>to meet you.</span>
              </h2>

              <p className="meet-description">
                Thanks for taking a moment to explore my little
                corner of the internet. I hope you enjoyed the
                experience.
              </p>

              {/* VISITOR NAME INTERACTION */}
              <form
                className="visitor-form"
                onSubmit={handleNameSubmit}
              >
                <label htmlFor="visitor-name">
                  What should I call you?
                </label>

                <div className="visitor-input-row">
                  <input
                    id="visitor-name"
                    type="text"
                    value={visitorName}
                    onChange={(event) =>
                      setVisitorName(event.target.value)
                    }
                    placeholder="Enter your name"
                  />

                  <button className="gold-button" type="submit">
                    Say hello
                    <span>↗</span>
                  </button>
                </div>
              </form>

              {submittedName && (
                <div className="personal-greeting" role="status">
                  <p>Hello, {submittedName}!</p>
                  <span>It's lovely to have you here. Thanks for visiting!</span>
                </div>
              )}

              <div className="greeting-box">
                <p>{greeting}</p>

                <div className="greeting-buttons">
                  <button
                    onClick={() => handleGreeting('Hello there!')}
                  >
                    Hello
                  </button>

                  <button
                    onClick={() =>
                      handleGreeting('Nice to meet you!')
                    }
                  >
                    Nice to meet you
                  </button>

                  <button
                    onClick={() =>
                      handleGreeting('Have a lovely day!')
                    }
                  >
                    Have a lovely day
                  </button>
                </div>
              </div>

              <button
                className="gold-button"
                onClick={() => goToPage(0)}
              >
                Back to the beginning
                <span>↗</span>
              </button>
            </div>

            <div className="page-footer">
              <span>04 — MEET ME</span>
              <span>UNTIL NEXT TIME</span>
            </div>
          </section>
        </div>
      </main>

      {/* BOTTOM NAVIGATION */}
      <div className="bottom-navigation">
        <button
          onClick={() => goToPage(activePage - 1)}
          disabled={activePage === 0}
          aria-label="Previous page"
        >
          ←
        </button>

        <div className="page-indicators">
          {pages.map((page, index) => (
            <button
              key={page}
              className={activePage === index ? 'selected' : ''}
              onClick={() => goToPage(index)}
              aria-label={`Go to ${page}`}
            />
          ))}
        </div>

        <button
          onClick={() => goToPage(activePage + 1)}
          disabled={activePage === pages.length - 1}
          aria-label="Next page"
        >
          →
        </button>
      </div>

      {/* SPARK CUSTOM CURSOR */}
      <div className="spark-cursor" aria-hidden="true">
        ✦
      </div>
    </div>
  )
}

export default App
