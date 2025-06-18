import "./stylesheets/style.css"
import classNames from "classnames"
import { useState, useEffect } from "preact/hooks"

const sampleWords =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis, turpis ut posuere consequat, risus ex feugiat nisi, sed auctor ligula sapien ut risus. Vivamus nec mauris porttitor ante posuere facilisis. Morbi dolor erat, hendrerit sed gravida et, egestas ac libero. Aenean tempus massa id finibus ullamcorper. Vestibulum metus magna, rutrum in dignissim nec, mollis vel diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque pretium sem nulla, sed consequat massa pellentesque quis. Quisque feugiat nulla non augue placerat scelerisque. Nullam porta, nisl eget feugiat dapibus, elit nunc faucibus ipsum, ac hendrerit erat ipsum a purus. Nunc lacinia, enim eget interdum facilisis, eros diam laoreet sapien, ut semper augue nibh ac dolor. Sed in sapien sem"

const App = () => {
  const [words, setWords] = useState(sampleWords.split(" "))
  const [bufferedWords, setBufferedWords] = useState([])
  const [buffer, setBuffer] = useState("")
  useEffect(() => {
    const getInput = e => {
      if (e.key.length === 1 && e.key !== " ") {
        setBuffer(buffer + e.key)
      } else if (e.key === " " && buffer.length) {
        setBufferedWords(bufferedWords.concat(buffer))
        setBuffer("")
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
  }, [buffer, bufferedWords])

  return (
    <>
      <header></header>
      <main>
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
              </div>
            )
          })}
        </div>
      </main>
      <footer></footer>
    </>
  )
}

export default App
