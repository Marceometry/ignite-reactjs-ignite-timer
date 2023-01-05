import { ThemeProvider } from 'styled-components'
import { GlobalStyle, defaultTheme } from '@/styles'
import { CyclesContextProvider } from '@/contexts'
import { Router } from './Router'

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CyclesContextProvider>
        <Router />
      </CyclesContextProvider>
      <GlobalStyle />
    </ThemeProvider>
  )
}
