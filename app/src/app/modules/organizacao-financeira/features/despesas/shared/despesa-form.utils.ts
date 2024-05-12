import { FormControl, FormGroup, Validators } from "@angular/forms"

// Types
export type tipoPagamento = "Recorrente" | "Parcelado" | "À Vista"
export type Frequencia = "Mensal" | "Semanal" | "Outro"
export type UnidadeFrequencia = "Dias" | "Semanas" | "Meses" | "Anos"

// Form Options
export const daysOptions = [
    { "label": "Segunda-feira", "value": "0" },
    { "label": "Terça-feira", "value": "1" },
    { "label": "Quarta-feira", "value": "2" },
    { "label": "Quinta-feira", "value": "3" },
    { "label": "Sexta-feira", "value": "4" },
    { "label": "Sábado", "value": "5" },
    { "label": "Domingo", "value": "6" },
]

export const frequenciasOptions: Frequencia[] = ["Mensal", "Semanal", "Outro"]


const TODAY = new Date()
const FIRST_DAY_OF_THE_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)


// functions
export function getMinDate(quantidade: number, unidade: UnidadeFrequencia): string {
    let currentDate = new Date()

    const dateHandlers: { [key in UnidadeFrequencia]: any } = {
        "Dias": (dias: number) => currentDate.setDate(currentDate.getDate() - dias),
        "Semanas": (semanas: number) => currentDate.setDate(currentDate.getDate() - (7 * semanas)),
        "Meses": (meses: number) => currentDate.setMonth(currentDate.getMonth() - meses),
        "Anos": (anos: number) => currentDate.setFullYear(currentDate.getFullYear() - anos),
    }


    if (!quantidade || !unidade) {
        return ""
    }

    dateHandlers[unidade as UnidadeFrequencia](Number(quantidade))

    return (
        FIRST_DAY_OF_THE_MONTH < currentDate ? FIRST_DAY_OF_THE_MONTH : currentDate
    )
        .toLocaleDateString('en-ca')
}

export function setDetalhesFrequenciaFields(form: FormGroup, frequencia: Frequencia | "") {
    const removeControls = (fg: FormGroup) => {
        Object.keys(fg.controls).forEach(controlKey => fg.removeControl(controlKey))
    }

    const addControls = (fg: FormGroup, newControls: { [key: string]: any }) => {
        Object.entries(newControls).forEach(([controlName, initialValue]) => {
            fg.addControl(controlName, new FormControl(initialValue, [Validators.required]))
        })
    }

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
            "quantidade": ""
        },
        "": {}
    }

    let detalhesFrequenciasFG = form.get("detalhesFrequencia")

    if (!(detalhesFrequenciasFG instanceof FormGroup)) return

    removeControls(detalhesFrequenciasFG)

    addControls(
        detalhesFrequenciasFG,
        detalhesFrequenciaFormFields[frequencia]
    )
}