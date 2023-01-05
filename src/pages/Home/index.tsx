import { FormProvider, useForm } from 'react-hook-form'
import { HandPalm, Play } from 'phosphor-react'
import { useCyclesContext } from '@/contexts'
import { Countdown, NewCycleForm } from './components'
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

export function Home() {
  const { interruptCurrentCycle, createNewCycle, activeCycle } =
    useCyclesContext()
  const newCycleForm = useForm<NewCycleFormData>({
    defaultValues: { task: '', minutesAmount: 0 },
  })
  const { handleSubmit, reset, watch } = newCycleForm
  const isSubmitDisabled = !watch('task')

  function interruptCycle() {
    interruptCurrentCycle()
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />

          <Countdown />
        </FormProvider>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCycle}>
            <HandPalm size={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
