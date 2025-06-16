import "./stylesheets/style.css"
const testWords =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis, turpis ut posuere consequat, risus ex feugiat nisi, sed auctor ligula sapien ut risus. Vivamus nec mauris porttitor ante posuere facilisis. Morbi dolor erat, hendrerit sed gravida et, egestas ac libero. Aenean tempus massa id finibus ullamcorper. Vestibulum metus magna, rutrum in dignissim nec, mollis vel diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque pretium sem nulla, sed consequat massa pellentesque quis. Quisque feugiat nulla non augue placerat scelerisque. Nullam porta, nisl eget feugiat dapibus, elit nunc faucibus ipsum, ac hendrerit erat ipsum a purus. Nunc lacinia, enim eget interdum facilisis, eros diam laoreet sapien, ut semper augue nibh ac dolor. Sed in sapien sem"
const app = document.getElementById("app")
const wordsSection = app.querySelector(".test-words")
let buffer = ""

let words = testWords.split("")
console.log(words)
for (let i = 0; i < testWords.length; i++) {
  const letter = testWords[i]
  const letterNode = document.createElement("span")
  letterNode.classList.add("letter")
  letterNode.textContent = letter
  wordsSection.append(letterNode)
}
//words.forEach((word, index) => {
//  let wordNode = document.createElement("div")
//  wordNode.classList.add("word")
//  if (index === 0) {
//    wordNode.classList.add("word--current")
//  }
//  for (let i = 0; i < word.length; i++) {
//    const letterNode = document.createElement("span")
//    letterNode.textContent = word[i]
//    letterNode.classList.add("letter")
//    wordNode.append(letterNode)
//  }
//  wordsSection.append(wordNode)
//})
const compare = () => {
  const letters = wordsSection.querySelectorAll(".letter")
  for (
    let i = 0;
    (i < buffer.length ||
      letters[i].classList.contains("letter--incorrect") ||
      letters[i].classList.contains("letter--correct")) &&
    i < letters.length;
    i++
  ) {
    if (!buffer[i]) {
      letters[i].classList.remove("letter--incorrect")
      letters[i].classList.remove("letter--correct")
    } else if (letters[i].textContent != buffer[i]) {
      letters[i].classList.add("letter--incorrect")
      letters[i].classList.remove("letter--correct")
    } else {
      letters[i].classList.remove("letter--incorrect")
      letters[i].classList.add("letter--correct")
    }
  }
}

document.addEventListener("keydown", e => {
  console.log(e)
  if (e.key.length === 1) {
    buffer += e.key
  } else if (e.key === "Backspace") {
    // maybe add logic to delete full word
    buffer = buffer.slice(0, -1)
  }
  compare()
  console.log(buffer)
})
