import produce from 'immer'
import { CyclesActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptionDate?: Date
  finishDate?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case CyclesActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case CyclesActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )
      if (currentCycleIndex < 0) return state
      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].interruptionDate = new Date()
        draft.activeCycleId = null
      })
    }
    case CyclesActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )
      if (currentCycleIndex < 0) return state
      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].finishDate = new Date()
        draft.activeCycleId = null
      })
    }
    default:
      return state
  }
}
