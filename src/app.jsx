import "./stylesheets/style.css"
import classNames from "classnames"
import { useState, useEffect, useRef } from "preact/hooks"
import useTimer from "./hooks/useTimer"
import { Faker, en } from "@faker-js/faker"
import Settings from "./components/Settings"

const faker = new Faker({
  locale: [en],
})

const loadSettings = () => {
  const saved = localStorage.getItem("settings")
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    time: 30,
    theme: "auto",
    capitalization: false,
    punctuation: false,
  }
}

const root = document.getElementById("app")

const App = () => {
  const [settings, setSettings] = useState(loadSettings())
  const saveSettings = newSettings => {
    setSettings(newSettings)
    localStorage.setItem("settings", JSON.stringify(newSettings))
  }
  useEffect(() => {
    root.classList.remove("theme--dark")
    root.classList.remove("theme--light")
    root.classList.remove("theme--auto")
    root.classList.add(`theme--${settings.theme}`)
  }, [settings.theme])
  return (
    <>
      <header></header>
      <main>
        <Settings settings={settings} setSettings={saveSettings} />
        <Test settings={settings} />
      </main>
      <footer></footer>
    </>
  )
}
window.addEventListener("resize", () => {})

const Test = ({ settings }) => {
  const timer = useTimer(settings.time, () => {
    setStarted(false)
  })
  const [mistyped, setMistyped] = useState(0)
  const [finalMistakes, setFinalMistakes] = useState(0)
  const [totalTyped, setTotalTyped] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    timer.setLimit(settings.time)
  }, [settings])
  return (
    <div className="test">
      <div className="test-header">
        {!timer.expired && !timer.paused && (
          <div className="test-header__timer">{timer.time}</div>
        )}
        {timer.expired && (
          <button
            className="test-header__restart-button"
            onClick={() => {
              setFinalMistakes(0)
              setTotalTyped(0)
              setMistyped(0)
              timer.reset()
              setStarted(true)
            }}
          >
            Restart
          </button>
        )}
        {timer.paused && !timer.expired && (
          <div className="test-header__start-queue">
            Begin typing to start the test
          </div>
        )}
      </div>
      <div className="words-wrapper">
        {!timer.expired && (
          <TestWords
            setFinalMistakes={setFinalMistakes}
            setMistyped={setMistyped}
            setTotalTyped={setTotalTyped}
            started={started}
            timer={timer}
          />
        )}
      </div>
      {timer.expired && (
        <div className="test-stats">
          <div>
            Speed:{" "}
            {Math.floor(
              (totalTyped - finalMistakes) / 5 / (timer.elapsed / 60)
            )}
            wpm
          </div>
          <div>
            Raw Speed: {Math.floor(totalTyped / 5 / (timer.elapsed / 60))}
            wpm
          </div>
          <div>
            Accuracy:{" "}
            {Math.floor(((totalTyped - mistyped) / (totalTyped || 1)) * 100)}%
          </div>
        </div>
      )}
    </div>
  )
}

const TestWords = ({
  setFinalMistakes,
  setMistyped,
  setTotalTyped,
  started,
  timer,
}) => {
  const [bufferedWords, setBufferedWords] = useState([])
  const [buffer, setBuffer] = useState("")
  const [words, setWords] = useState([])
  const currentWordRef = useRef()
  const wordListRef = useRef()
  const addWords = () => {
    let newWords = faker.word.words(100).split(" ")
    setWords(words.concat(newWords))
  }
  useEffect(() => {
    addWords()
    return () => {
      setWords([])
    }
  }, [started])
  useEffect(() => {
    const word = root.querySelector(".word")
    const wordList = root.querySelector(".test-words")
    if (!word || !wordList) {
      return
    }
    const wordDimensions = root.querySelector(".word").getBoundingClientRect()
    const wordWrapper = root.querySelector(".test-words")
    wordWrapper.style.maxHeight = `${wordDimensions.height * 5}px`
  }, [words])
  useEffect(() => {
    const getInput = e => {
      if (timer.paused) {
        timer.play()
      }
      const incorrect =
        bufferedWords.reduce((acc, curr, index) => {
          let count = 0
          if (!words[index]) return acc
          for (let i = 0; i < curr.length; i++) {
            if (!words[index][i] || curr[i] != words[index][i]) {
              count++
            }
          }
          return acc + count
        }, 0) +
        Array.from(buffer).reduce((acc, curr, index) => {
          if (curr !== words[bufferedWords.length][index]) {
            return acc + 1
          }
          return acc
        }, 0)
      setFinalMistakes(incorrect)
      if (bufferedWords.length > (3 / 4) * words.length) {
        addWords()
      }
      if (e.key.length === 1) {
        if (e.key === " " && buffer.length) {
          setBufferedWords(bufferedWords.concat(buffer))
          setBuffer("")
        } else if (e.key !== " ") {
          if (words[bufferedWords.length][buffer.length] != e.key) {
            setMistyped(mistyped => mistyped + 1)
          }
          setTotalTyped(total => total + 1)
          setBuffer(buffer + e.key)
        }
      } else if (e.key === "Backspace") {
        let newBuffer = ""
        if (!buffer.length && bufferedWords.length) {
          newBuffer = bufferedWords[bufferedWords.length - 1]
          setBufferedWords(bufferedWords.slice(0, -1))
        } else {
          newBuffer = buffer.slice(0, -1)
        }
        if (e.ctrlKey) {
          newBuffer = ""
        }
        setBuffer(newBuffer)
      }
      wordListRef.current.scroll(0, currentWordRef.current.offsetTop)
    }
    window.addEventListener("keydown", getInput)
    return () => {
      window.removeEventListener("keydown", getInput)
    }
  }, [buffer, bufferedWords, timer.paused, words, currentWordRef])
  return (
    <div className="test-words" ref={wordListRef}>
      {words.map((word, wordIndex) => {
        let typedWord
        if (wordIndex < bufferedWords.length) {
          typedWord = bufferedWords[wordIndex]
        } else if (wordIndex === bufferedWords.length) {
          typedWord = buffer
        } else {
          typedWord = ""
        }
        const wordCurrent = wordIndex === bufferedWords.length
        const wordCorrect = typedWord === word
        const wordClass = classNames({
          word: true,
          "word--current": wordCurrent,
          "word--correct": wordCorrect,
          "word--incorrect": !wordCorrect && typedWord,
        })
        const overflow = typedWord.slice(word.length, typedWord.length) || ""
        const wordProps = wordCurrent ? { ref: currentWordRef } : {}
        return (
          <div className={wordClass} {...wordProps}>
            {Array.from(word).map((letter, index) => {
              const typedLetter = typedWord[index]
              const letterClass = classNames({
                letter: true,
                "letter--correct": typedLetter === letter,
                "letter--incorrect": typedLetter && typedLetter !== letter,
              })
              return <span className={letterClass}>{letter}</span>
            })}
            {Array.from(overflow).map(letter => {
              const letterClass = classNames({
                letter: true,
                "letter--overflow": true,
              })
              return <span className={letterClass}>{letter}</span>
            })}
          </div>
        )
      })}
    </div>
  )
}

export default App
