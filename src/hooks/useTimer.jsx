import { useState, useEffect } from "preact/hooks"

const useTimer = (initialTime, onFinish) => {
  const [timerLimit, setTimerLimit] = useState(initialTime)
  const [time, setTime] = useState(timerLimit)
  const [paused, setPaused] = useState(true)
  const [expired, setExpired] = useState(false)
  const [lastElapsed, setLastElapsed] = useState(0)
  useEffect(() => {
    if (paused) {
      return
    }
    let intervalID = setInterval(() => {
      let newTime = time - 1
      if (newTime <= 0) {
        newTime = 0
        setExpired(true)
        onFinish && onFinish()
        pause()
        clearInterval(intervalID)
      }
      setLastElapsed(timerLimit - newTime)
      setTime(newTime)
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
    setTime(timerLimit)
    setExpired(false)
    setPaused(true)
    setLastElapsed(0)
  }
  const setLimit = newLimit => {
    setTimerLimit(newLimit)
    setTime(newLimit)
  }
  return {
    time,
    play,
    pause,
    toggle,
    paused,
    reset,
    expired,
    duration: timerLimit,
    setLimit,
    elapsed: lastElapsed,
  }
}

export default useTimer
