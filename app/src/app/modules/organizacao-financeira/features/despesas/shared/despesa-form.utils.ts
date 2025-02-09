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


export const TODAY = new Date()
export const FIRST_DAY_OF_THE_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)


export const addControls = (fg: FormGroup, newControls: { [key: string]: any }) => {
    Object.entries(newControls).forEach(([controlName, initialValue]) => {
        let control = (initialValue instanceof FormGroup) ? initialValue : new FormControl(initialValue, [Validators.required])
        fg.addControl(controlName, control)
    })
}

const removeAllControls = (fg: FormGroup) => {
    Object.keys(fg.controls).forEach(controlKey => fg.removeControl(controlKey))
}


export const removeControls = (fg: FormGroup, controls: string[]) => {
    controls.forEach(control => fg.removeControl(control))
}


export function setDetalhesFrequenciaFields(form: FormGroup, frequencia: Frequencia | "") {

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

    removeAllControls(detalhesFrequenciasFG)

    addControls(
        detalhesFrequenciasFG,
        detalhesFrequenciaFormFields[frequencia]
    )
}