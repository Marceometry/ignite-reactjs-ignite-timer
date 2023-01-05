import { formatDistanceToNow } from 'date-fns'
import prBR from 'date-fns/locale/pt-BR'
import { useCyclesContext } from '@/contexts'
import { HistoryContainer, HistoryList, StatusFlag } from './styles'

export function History() {
  const { cycleList } = useCyclesContext()

  const sortedList = [...cycleList].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  )

  return (
    <HistoryContainer>
      <h1>Meu Histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedList.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutesAmount} minutos</td>
                <td>
                  {formatDistanceToNow(new Date(cycle.startDate), {
                    addSuffix: true,
                    locale: prBR,
                  })}
                </td>
                <td>
                  {cycle.finishDate ? (
                    <StatusFlag statusColor="green">Concluído</StatusFlag>
                  ) : cycle.interruptionDate ? (
                    <StatusFlag statusColor="red">Interrompido</StatusFlag>
                  ) : (
                    <StatusFlag statusColor="yellow">Em andamento</StatusFlag>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
