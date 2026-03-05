import { useState, useEffect, useRef, useCallback } from 'react'
import Confetti from 'react-confetti'
import './App.css'

type Stage = 1 | 2 | 3 | 4

const STAGE1_TEXTS = [
  'Kya mei ek acha dost hu? 💙',
  'Are you sureee? 🥺',
  'Pleaseeeee? 😢😢',
] as const

function App() {
  const [stage, setStage] = useState<Stage>(1)
  const [hasSeenIntro, setHasSeenIntro] = useState(false)
  const [introPhase, setIntroPhase] = useState<'line' | 'countdown' | 'reveal'>('line')
  const [introCountdown, setIntroCountdown] = useState<number | null>(null)
  const [noClicks, setNoClicks] = useState(0)
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const musicRef = useRef<HTMLAudioElement | null>(null)
  const hasStartedMusicRef = useRef(false)

  const moveNoButton = useCallback(() => {
    const btn = noButtonRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()

    const padding = 24
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const minX = padding
    const minY = padding
    const maxX = Math.max(minX, viewportWidth - rect.width - padding)
    const maxY = Math.max(minY, viewportHeight - rect.height - padding)

    const rangeX = Math.max(0, maxX - minX)
    const rangeY = Math.max(0, maxY - minY)

    const x =
      rangeX === 0
        ? Math.max(minX, Math.min(maxX, (viewportWidth - rect.width) / 2))
        : minX + Math.random() * rangeX
    const y =
      rangeY === 0
        ? Math.max(minY, Math.min(maxY, (viewportHeight - rect.height) / 2))
        : minY + Math.random() * rangeY

    setNoButtonPos({ x, y })
  }, [])

  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Intro flow: line -> (button) -> countdown 3,2,1 -> reveal text, then button to proceed
  useEffect(() => {
    if (hasSeenIntro) return
    if (introPhase === 'line') {
      return
    }
    if (introPhase === 'countdown') {
      if (introCountdown === null) return
      if (introCountdown > 0) {
        const t = setTimeout(
          () => setIntroCountdown((c) => (c !== null && c > 0 ? c - 1 : c)),
          900,
        )
        return () => clearTimeout(t)
      }
      if (introCountdown === 0) {
        const t = setTimeout(() => setIntroPhase('reveal'), 700)
        return () => clearTimeout(t)
      }
    }
  }, [hasSeenIntro, introPhase, introCountdown])

  // Stage 2: show message then countdown
  useEffect(() => {
    if (stage !== 2) return
    const t1 = setTimeout(() => setCountdown(5), 1000)
    return () => clearTimeout(t1)
  }, [stage])

  useEffect(() => {
    if (stage !== 2 || countdown === null) return
    if (countdown <= 0) {
      setStage(3)
      setShowConfetti(true)
      return
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 5) - 1), 1000)
    return () => clearTimeout(t)
  }, [stage, countdown])

  const handleYes = () => setStage(2)
  const handleNo = () => {
    setNoClicks((c) => Math.min(c + 1, 2))
    moveNoButton()
  }

  const stage1Text = STAGE1_TEXTS[Math.min(noClicks, 2)]
  const noButtonFloating = noClicks >= 1

  const handleIntroStart = () => {
    setIntroPhase('countdown')
    setIntroCountdown(3)
    if (!hasStartedMusicRef.current && musicRef.current) {
      hasStartedMusicRef.current = true
      try {
        musicRef.current.volume = 0.4
        void musicRef.current.play()
      } catch {
        // ignore autoplay issues
      }
    }
  }

  const handleIntroNext = () => {
    setHasSeenIntro(true)
    setIntroPhase('reveal')
  }

  const isNight = hasSeenIntro && (stage === 3 || stage === 4)
  const appClassName = [
    'app',
    isNight ? 'app-night' : '',
    !hasSeenIntro ? 'app-intro' : '',
    hasSeenIntro && stage === 1 ? 'app-stage-ready' : '',
    hasSeenIntro && stage === 2 ? 'app-stage-countdown' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={appClassName}>
      <audio
        ref={musicRef}
        src="/Via – Jason Fervento _ Relaxing Piano Music.mp3"
        loop
      />
      <div className="app-bg" aria-hidden>
        <div className="app-bg-gradient" />
        <div className="app-bg-circles">
          <div className="blob blob-1" />
          <div className="blob blob-2" />
          <div className="blob blob-3" />
          <div className="blob blob-4" />
          <div className="aurora aurora-1" />
          <div className="aurora aurora-2" />
          <div className="bokeh bokeh-1" />
          <div className="bokeh bokeh-2" />
          <div className="bokeh bokeh-3" />
          <div className="bokeh bokeh-center-1" />
          <div className="bokeh bokeh-center-2" />
          <div className="petal petal-1" />
          <div className="petal petal-2" />
          <div className="petal petal-center" />
          <div className="emoji-flower emoji-flower-1">🌸</div>
          <div className="emoji-flower emoji-flower-2">🌷</div>
          <div className="emoji-flower emoji-flower-3">🌺</div>
          <div className="emoji-petal emoji-petal-1">🌸</div>
          <div className="emoji-petal emoji-petal-2">🌸</div>
          <div className="emoji-petal emoji-petal-3">🌸</div>
          <div className="light-beam beam-1" />
          <div className="light-beam beam-2" />
          <div className="ray-layer" />
          <div className="line-doodle line-1" />
          <div className="line-doodle line-2" />
          <div className="bouquet bouquet-left" />
          <div className="bouquet bouquet-right" />
          {!isNight && (
            <>
              <div className="falling-petal petal-f1" />
              <div className="falling-petal petal-f2" />
              <div className="falling-petal petal-f3" />
              <div className="falling-petal petal-f4" />
              <div className="falling-petal petal-f5" />
              <div className="falling-petal petal-f6" />
            </>
          )}
        </div>
        <div className="app-bg-vignette" />
      </div>
      <div className="center-halo" aria-hidden />
      <div className="app-foreground">
        {/* Celebratory confetti for intro reveal – brighter and denser */}
        {!hasSeenIntro && introPhase === 'reveal' && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={260}
            recycle={false}
            gravity={0.35}
            initialVelocityX={{ min: -6, max: 6 }}
            initialVelocityY={{ min: -15, max: 0 }}
            opacity={0.95}
            colors={['#EC407A', '#F48FB1', '#FFB74D', '#FFEE58', '#64B5F6', '#3949AB']}
          />
        )}
        {/* Big finale confetti – very celebratory */}
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={420}
            recycle={false}
            gravity={0.4}
            initialVelocityX={{ min: -8, max: 8 }}
            initialVelocityY={{ min: -18, max: -4 }}
            opacity={0.98}
            colors={['#EC407A', '#F48FB1', '#FFB74D', '#FFEE58', '#64B5F6', '#1E88E5', '#3949AB']}
          />
        )}

        {!hasSeenIntro && (
          <div className="stage stage-intro">
            <p className="intro-line">For someone very special…</p>
            <p className="intro-subtitle">Ek chota sa surprize, ek khas lrki ky liye guess kro wo kon?</p>
            {introPhase === 'line' && (
              <button type="button" className="btn intro-btn" onClick={handleIntroStart}>
                Start 💙
              </button>
            )}
            {introPhase === 'countdown' && introCountdown !== null && (
              <div className="intro-countdown" key={introCountdown}>
                {introCountdown}
              </div>
            )}
            {introPhase === 'reveal' && (
              <div className="intro-reveal">
                <p className="intro-reveal-main">Yesssssss wo ap hi hooo</p>
                <p className="intro-reveal-name">Ranoo</p>
                <button type="button" className="btn intro-next-btn" onClick={handleIntroNext}>
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {hasSeenIntro && stage === 1 && (
          <div className="stage stage-1">
            <h1 className="title-ready">{stage1Text}</h1>
            <div className="buttons-wrap">
              <button type="button" className="btn btn-yes" onClick={handleYes}>
                Yes 💙
              </button>
              <button
                ref={noButtonRef}
                type="button"
                className="btn btn-no"
                onClick={handleNo}
                style={
                  noButtonFloating
                    ? {
                        position: 'fixed',
                        left: noButtonPos.x,
                        top: noButtonPos.y,
                        transition: 'left 0.25s ease-out, top 0.25s ease-out',
                      }
                    : undefined
                }
              >
                No 🙈
              </button>
            </div>
            <div className="note-badges">
              <span className="note-badge">You&apos;re amazing</span>
              <span className="note-badge">No pressure… maybe a little 😌</span>
              <span className="note-badge">This will be worth it</span>
            </div>
          </div>
        )}

        {hasSeenIntro && stage === 2 && (
          <div className="stage stage-2">
            <p className="text-ready">dekhaa mujhy pta tha ap yes py hi click kro gi 😏 😂</p>
            {countdown !== null && (
              <>
                <p className="stage2-top-text">Big surprise loading…</p>
                {countdown > 0 && (
                  <div className="countdown-num" key={countdown}>
                    {countdown}
                  </div>
                )}
                <p className="stage2-bottom-text">Don&apos;t worry, you&apos;re going to love this 💙</p>
              </>
            )}
          </div>
        )}

        {hasSeenIntro && stage === 3 && (
          <>
            <div className="starfield-layer" aria-hidden />
            <div className="fireworks-layer" aria-hidden>
              <div className="firework fw-1" />
              <div className="firework fw-2" />
              <div className="firework fw-3" />
            </div>
            <div className="stage stage-3">
              <h1 className="title-birthday">🎉 HAPPY BIRTHDAY Ranoo 🎂💙</h1>
              <p className="message">
                May this year bring you happiness, success, and everything beautiful.
                The world became brighter the day you were born 💙
              </p>
              <button
                type="button"
                className="btn btn-letter"
                onClick={() => setStage(4)}
              >
                A little note for you 💌
              </button>
            </div>
          </>
        )}

        {hasSeenIntro && stage === 4 && (
          <>
            <div className="starfield-layer" aria-hidden />
            <div className="stage stage-4">
              <p className="letter-heading-top">
                Happy Birthday 🎂 to the most Special Person in My Life
              </p>
              <div className="letter-card">
                <h2 className="letter-title">A little note for you 💙</h2>
                <div className="letter-body">
                  <section className="letter-section">
                    <h3 className="letter-section-title">💖 A Special Day</h3>
                    <p className="letter-section-text">
                      Aj bohtt special din h.. Ye koi aam si date ni h calender py.. Ye wo din h jb koi boht hi khas
                      paida hui thi.. ye din boht important h mery liye kyu k is din ap ai thi..🌸
                    </p>
                  </section>
                  <section className="letter-section">
                    <h3 className="letter-section-title">🌷 Why You Are Special</h3>
                    <p className="letter-section-text">
                      Tum na mery liye one of the mostttt special insan ho.. Bs apky hony sy hi mery or baki logon ky
                      bhi din achy ho jaty h.. uper sy apki smile yrrrrr.. Boht pyari lgti ho hasty huy.. Uper sy ankhennn
                      uff 😂.. Mgr us sb ky ilava apki bat krny ka trika.. han kbhi kbhi thori shoki ho jati ho..😂😂.. pr
                      koi bat ni apka bnta bhi h😂.. mgr ap sch much mei boht hi achi lrki ho.. Bnda wesy hi khush ho
                      jata k ap jeisy kisi ko janta h..😂.. Mei sch mei dil sy apki respect krta hu..
                    </p>
                  </section>
                  <section className="letter-section">
                    <h3 className="letter-section-title">📖 Our Memories</h3>
                    <p className="letter-section-text">
                      Thank you oyy jo dherrrrr sarri memories jo humny share ki.. wo rat ko late jag k baten krnaa.. wo
                      hmara ek dusry ko hsana.. wo choti choti baten jin my bari bari feelings thi.. or hr roz ky simple
                      goodmorning or goodnights.. sbb boht hi important thy.. Meri apky sath hr yad.. hr memory.. mery dil
                      ky boht karib h.. han ku6 pal shayd choty lgty hongy pr mery liye unki bohtt vakue h.. bohtttt 😂 or
                      phir school ki memories ki to bat hi or thi na.. wo hmara bakion ko chup krana.. sb boht acha tha
                      or sbb ky liye thank youuuu so so so so muchhh 🌹
                    </p>
                  </section>
                  <section className="letter-section">
                    <h3 className="letter-section-title">🤲 My Prayers For You</h3>
                    <p className="letter-section-text">
                      Mei Allah sy dua mangta hu k apko kbhi na khtm hony wali khushian milen😂.. or inshallah ap boht
                      kamyab hogi.. Allah apko sakoon dy ameen.. Inshallah apky sary khwab pury hongy.. or apki zindagi
                      pyar or khushi sy bhr jay.. ameen..🌹 or is sal apki life apko he us chiz ky pas ly jay jo ap
                      deserve krti ho blky us sy bhi zadaa.. Ranoo boht shukriya apka hr chiz ky liye.. sch mei boht dil
                      sy shukria..♥
                    </p>
                    <p className="letter-section-text">
                      Ranoo.. hr chiz ky liye apka boht boht shukriya.. Meri life mei any ky liye bhi boht boht
                      shukriya.. meri friend bnny ky liye bhi boht shukriya.... Ap boht achi lrki ho yrr.. Allah apko
                      khush rkhy.. Thank you Dearrr 😍
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
