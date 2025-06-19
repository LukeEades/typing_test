import "./stylesheets/style.css"
import classNames from "classnames"
import { useState, useEffect } from "preact/hooks"
import useTimer from "./hooks/useTimer"

const sampleWords =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis, turpis ut posuere consequat, risus ex feugiat nisi, sed auctor ligula sapien ut risus. Vivamus nec mauris porttitor ante posuere facilisis. Morbi dolor erat, hendrerit sed gravida et, egestas ac libero. Aenean tempus massa id finibus ullamcorper. Vestibulum metus magna, rutrum in dignissim nec, mollis vel diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque pretium sem nulla, sed consequat massa pellentesque quis. Quisque feugiat nulla non augue placerat scelerisque. Nullam porta, nisl eget feugiat dapibus, elit nunc faucibus ipsum, ac hendrerit erat ipsum a purus. Nunc lacinia, enim eget interdum facilisis, eros diam laoreet sapien, ut semper augue nibh ac dolor. Sed in sapien sem"

const loadSettings = () => {
  const saved = localStorage.getItem("settings")
  if (saved) {
    return JSON.parse(saved)
  }
  return {
    time: 30,
    theme: "dark",
    capitalization: false,
    punctuation: false,
  }
}

const App = () => {
  const [settings, setSettings] = useState(loadSettings())
  const saveSettings = newSettings => {
    setSettings(newSettings)
    localStorage.setItem("settings", JSON.stringify(newSettings))
  }
  return (
    <>
      <header></header>
      <main>
        <Test settings={settings} />
        <Settings settings={settings} setSettings={saveSettings} />
      </main>
      <footer></footer>
    </>
  )
}

const Settings = ({ settings, setSettings }) => {
  return (
    <div>
      <ul>
        <li>
          <span>Time</span>
          <input
            type="number"
            aria-label="timer-value"
            value={settings.time}
            onInput={e => {
              setSettings({
                ...settings,
                time: e.target.value,
              })
            }}
          />
        </li>
        <li>
          <span>Theme</span>
          <select
            name="theme"
            onInput={e => {
              setSettings({
                ...settings,
                theme: e.target.value,
              })
            }}
            value={settings.theme}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </li>
        <li>
          <span>Capitalization</span>
          <select
            name="capitalization"
            onInput={e => {
              setSettings({
                ...settings,
                capitalization: e.target.value,
              })
            }}
            value={settings.capitalization}
          >
            <option value={false}>Off</option>
            <option value={true}>On</option>
          </select>
        </li>
        <li>
          <span>Punctation</span>
          <span>{settings.punctuation}</span>
          <select
            name="punctuation"
            onInput={e => {
              setSettings({
                ...settings,
                punctuation: e.target.value,
              })
            }}
            value={settings.punctuation}
          >
            <option value={false}>Off</option>
            <option value={true}>On</option>
          </select>
        </li>
      </ul>
    </div>
  )
}

const Test = ({ settings }) => {
  const timer = useTimer(settings.time)
  const [mistyped, setMistyped] = useState(0)
  const [finalMistakes, setFinalMistakes] = useState(0)
  const [totalTyped, setTotalTyped] = useState(0)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    timer.setLimit(settings.time)
  }, [settings.time])
  return (
    <div>
      <div>{timer.time}</div>
      {!started && (
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
          Start
        </button>
      )}
      {!timer.expired && (
        <TestWords
          paused={timer.paused}
          setFinalMistakes={setFinalMistakes}
          setMistyped={setMistyped}
          setTotalTyped={setTotalTyped}
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
}) => {
  const [words, setWords] = useState(sampleWords.split(" "))
  const [bufferedWords, setBufferedWords] = useState([])
  const [buffer, setBuffer] = useState("")
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
  }, [buffer, bufferedWords, paused])
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
