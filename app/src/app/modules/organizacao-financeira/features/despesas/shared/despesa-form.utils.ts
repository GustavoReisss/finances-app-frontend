import { FormGroup, Validators } from "@angular/forms"
import { addControls, removeAllControls } from "../../../../../shared/utils/form.utils"
import { TODAY } from "../../../../../shared/utils/date.utils"

// Types
export type tipoPagamento = "Recorrente" | "Parcelado" | "À Vista"
export type Frequencia = "Mensal" | "Semanal" | "Outro"
export type UnidadeFrequencia = "Dias" | "Semanas" | "Meses" | "Anos"


export const frequenciasOptions: Frequencia[] = ["Mensal", "Semanal", "Outro"]


export const FIRST_DAY_OF_THE_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)



export function setDetalhesFrequenciaFields(form: FormGroup, frequencia: Frequencia | "", proximaDataKey: string = "dataProximoPagamento") {

    let detalhesFrequenciaFormFields: {
        [key in Frequencia | ""]: any
    } = {
        'Mensal': {
            "diaPagamento": ""
        },
        'Semanal': {
            "diaSemana": ""
        },
        'Outro': {
            "unidade": "",
            "quantidade": "",
        },
        "": {}
    }

    let detalhesFrequenciasFG = form.get("detalhesFrequencia")

    if (!(detalhesFrequenciasFG instanceof FormGroup)) return

    removeAllControls(detalhesFrequenciasFG)

    if (frequencia === "Outro") {
        form.get(proximaDataKey)!.addValidators([Validators.required])
    }

    addControls(
        detalhesFrequenciasFG,
        detalhesFrequenciaFormFields[frequencia]
    )
}