import { useEffect } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CountdownContainer, CountdownSeparator } from './styles'
import { useCyclesContext } from '@/contexts'
import { useFormContext } from 'react-hook-form'

export function Countdown() {
  const {
    secondsPassedAmount,
    setSecondsPassedAmount,
    activeCycle,
    markCurrentCycleAsFinished,
  } = useCyclesContext()
  const { reset } = useFormContext()

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - secondsPassedAmount : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (!activeCycle) return
    let interval = 0
    interval = setInterval(() => {
      const difference = differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate),
      )

      if (difference >= totalSeconds) {
        markCurrentCycleAsFinished()
        setSecondsPassedAmount(totalSeconds)
        clearInterval(interval)
        reset()
      } else {
        setSecondsPassedAmount(difference)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [
    activeCycle,
    markCurrentCycleAsFinished,
    reset,
    setSecondsPassedAmount,
    totalSeconds,
  ])

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    } else {
      document.title = 'Ignite Timer'
    }
  }, [activeCycle, minutes, seconds])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <CountdownSeparator>:</CountdownSeparator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
