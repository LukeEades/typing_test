import { useState, useEffect } from "preact/hooks"

const useTimer = (initialTime, onFinish) => {
  const [time, setTime] = useState(initialTime)
  const [paused, setPaused] = useState(true)
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    if (paused) {
      return
    }
    let intervalID = setInterval(() => {
      if (time <= 0) {
        setTime(0)
        setExpired(true)
        onFinish && onFinish()
        pause()
        clearInterval(intervalID)
        return
      }
      setTime(time - 1)
    }, 1000)
    return () => {
      clearInterval(intervalID)
    }
  }, [time, paused])
  const play = () => {
    setPaused(false)
  }
  const pause = () => {
    setPaused(true)
  }
  const toggle = () => {
    paused ? play() : pause()
  }
  const reset = () => {
    setTime(initialTime)
    setExpired(false)
    setPaused(true)
  }
  return { time, play, pause, toggle, paused, reset, expired }
}

export default useTimer
