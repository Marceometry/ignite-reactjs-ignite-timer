import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useReducer,
  useEffect,
} from 'react'
import {
  Cycle,
  cyclesReducer,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '@/reducers'
import { differenceInSeconds } from 'date-fns'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

export type CyclesContextData = {
  activeCycle?: Cycle
  cycleList: Cycle[]
  secondsPassedAmount: number
  setSecondsPassedAmount: (value: number) => void
  markCurrentCycleAsFinished: () => void
  interruptCurrentCycle: () => void
  createNewCycle: (data: CreateCycleData) => void
}

export type CyclesContextProviderProps = {
  children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextData)

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storedState = localStorage.getItem('@ignite-timer:cycles-state')
      if (storedState) return JSON.parse(storedState)
    },
  )

  const activeCycle = cyclesState.cycles.find(
    (cycle) => cycle.id === cyclesState.activeCycleId,
  )
  const [secondsPassedAmount, setSecondsPassedAmount] = useState(() => {
    if (!activeCycle) return 0
    const difference = differenceInSeconds(
      new Date(),
      new Date(activeCycle.startDate),
    )
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
    if (difference >= totalSeconds) return totalSeconds
    return difference
  })

  useEffect(() => {
    const stateJsonString = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state', stateJsonString)
  }, [cyclesState])

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
    setSecondsPassedAmount(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        cycleList: cyclesState.cycles,
        secondsPassedAmount,
        setSecondsPassedAmount,
        activeCycle,
        markCurrentCycleAsFinished,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export const useCyclesContext = () => useContext(CyclesContext)
