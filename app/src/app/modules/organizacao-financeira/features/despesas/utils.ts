import { Despesa } from "../../../../shared/interfaces/despesa.interface"
import { WEEK_DAYS } from "../../../../shared/utils/date.utils"

export interface Tag {
    type: string
    value: string
}

export interface HistoricoDespesa {
    categoriaPagamento: string
    dataPagamento: string
    descricao: string
    despesaId: string
    tipoPagamento: string
    userId: string
    valor: string
}

export type HistoricoDespesaEditable = HistoricoDespesa & { editing: boolean; loading: boolean }


export function createTags(despesa: Despesa): Tag[] {
    let extraTags: Tag[] = []

    if (despesa.tipoPagamento == 'À Vista') {
        const dataPagamento = new Date(despesa.dataProximoPagamento!)
        dataPagamento.setHours(dataPagamento.getHours() + 3)

        extraTags.push({
            type: "Frequencia",
            value: `Pagamento dia ${dataPagamento.toLocaleDateString('pt-br')}`
        })
    }
    else {
        if (despesa.tipoPagamento == 'Parcelado') {
            extraTags.push({
                type: "Parcelas",
                value: `${despesa.parcelaAtual}/${despesa.quantidadeParcelas}`
            })
        }

        switch (despesa.frequencia) {
            case "Mensal":
                extraTags.push({
                    type: "Frequencia",
                    value: `Todo dia ${despesa.detalhesFrequencia?.diaPagamento}`
                })
                break
            case "Semanal":
                const diaSemana = WEEK_DAYS.find(el => el.value === despesa.detalhesFrequencia!.diaSemana)
                if (!diaSemana) break

                if (["5", "6"].includes(diaSemana.value)) { // Sábado e Domingo
                    extraTags.push({
                        type: "Frequencia",
                        value: `Todo ${diaSemana.label.toLowerCase()}`
                    })
                    break
                }

                extraTags.push({
                    type: "Frequencia",
                    value: `Toda ${diaSemana.label.toLowerCase()}`
                })
                break
            case "Outro":
                let { quantidade, unidade } = despesa.detalhesFrequencia!

                if (!quantidade || !unidade) break

                if (quantidade === "1") {
                    unidade = { "Semanas": "Semana", "Anos": "Ano", "Meses": "Mês" }[unidade]
                }

                extraTags.push({
                    type: "Frequencia",
                    value: `A cada ${quantidade} ${unidade?.toLocaleLowerCase()}`
                })
                break
        }
    }

    if (despesa.dataProximoPagamento && despesa.tipoPagamento !== 'À Vista') {
        const dataPagamento = new Date(despesa.dataProximoPagamento!)
        dataPagamento.setHours(dataPagamento.getHours() + 3)
        // extraTags.push(`Próximo pagamento em ${dataPagamento.toLocaleDateString('pt-br')}`)
        extraTags.push()
        extraTags.push({
            type: "proximoPagamento",
            value: dataPagamento.toLocaleDateString('pt-br')
        })
    }

    return [
        {
            type: "tipoPagamento",
            value: despesa.tipoPagamento
        },
        {
            type: "categoriaPagamento",
            value: despesa.categoriaPagamento
        },
        ...extraTags
    ]
}