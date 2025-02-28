import { Frequencia } from "../../despesas/shared/despesa-form.utils"

export type Receita = {
    userId: string
    receitaId: string
    descricao: string
    valor: number
    dataProximoRecebimento: string
    frequencia: Frequencia
    detalhesFrequencia: FrequenciaMensal | FrequenciaSemanal | FrequenciaOutro
}

type FrequenciaSemanal = { diaSemana: string }
type FrequenciaMensal = { diaPagamento: string }
type FrequenciaOutro = { unidade: string; quantidade: string }

export type ReceitaComTags = Receita & {
    tags: string[]
}