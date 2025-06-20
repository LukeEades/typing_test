import "./stylesheets/style.css"
import classNames from "classnames"
import { useState, useEffect } from "preact/hooks"
import useTimer from "./hooks/useTimer"
import { Faker, en } from "@faker-js/faker"
import Settings from "./components/Settings"

const faker = new Faker({
  locale: [en],
})

const sampleWords =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis, turpis ut posuere consequat, risus ex feugiat nisi, sed auctor ligula sapien ut risus. Vivamus nec mauris porttitor ante posuere facilisis. Morbi dolor erat, hendrerit sed gravida et, egestas ac libero. Aenean tempus massa id finibus ullamcorper. Vestibulum metus magna, rutrum in dignissim nec, mollis vel diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque pretium sem nulla, sed consequat massa pellentesque quis. Quisque feugiat nulla non augue placerat scelerisque. Nullam porta, nisl eget feugiat dapibus, elit nunc faucibus ipsum, ac hendrerit erat ipsum a purus. Nunc lacinia, enim eget interdum facilisis, eros diam laoreet sapien, ut semper augue nibh ac dolor. Sed in sapien sem"

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
  }, [settings])
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

const Test = ({ settings }) => {
  const timer = useTimer(settings.time, () => {})
  const [mistyped, setMistyped] = useState(0)
  const [finalMistakes, setFinalMistakes] = useState(0)
  const [totalTyped, setTotalTyped] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    timer.setLimit(settings.time)
  }, [settings])
  return (
    <div>
      {!timer.expired && <div>{timer.time}</div>}
      {(!started || timer.expired) && (
        <button
          onClick={() => {
            setFinalMistakes(0)
            setTotalTyped(0)
            setMistyped(0)
            setStarted(true)
            timer.reset()
            timer.play()
          }}
        >
          {timer.expired ? "Restart" : "Start"}
        </button>
      )}
      {!timer.expired && started && (
        <TestWords
          paused={timer.paused}
          setFinalMistakes={setFinalMistakes}
          setMistyped={setMistyped}
          setTotalTyped={setTotalTyped}
          started={started}
        />
      )}
      {timer.expired && (
        <div>
          <div>
            Speed: {(totalTyped - finalMistakes) / 5 / (timer.duration / 60)}
            wpm
          </div>
          <div>Raw Speed: {totalTyped / 5 / (timer.duration / 60)}</div>
          <div>
            Accuracy: {Math.floor(((totalTyped - mistyped) / totalTyped) * 100)}
            %
          </div>
        </div>
      )}
    </div>
  )
}

const TestWords = ({
  paused,
  setFinalMistakes,
  setMistyped,
  setTotalTyped,
  started,
}) => {
  const [bufferedWords, setBufferedWords] = useState([])
  const [buffer, setBuffer] = useState("")
  const [words, setWords] = useState([])
  const addWords = () => {
    let newWords = faker.word.words(50).split(" ")
    setWords(words.concat(newWords))
  }
  useEffect(() => {
    addWords()
    return () => {
      setWords([])
    }
  }, [started])
  useEffect(() => {
    if (paused) return
    const getInput = e => {
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
    }
    window.addEventListener("keydown", getInput)
    return () => {
      window.removeEventListener("keydown", getInput)
    }
  }, [buffer, bufferedWords, paused, words])
  return (
    <div className="test-words">
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
        return (
          <div className={wordClass}>
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
