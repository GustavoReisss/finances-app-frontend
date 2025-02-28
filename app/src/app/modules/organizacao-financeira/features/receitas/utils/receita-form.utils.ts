// import { FormGroup, Validators } from "@angular/forms"
// import { addControls, removeAllControls } from "../../../../../shared/utils/form.utils"
// import { Frequencia } from "../../despesas/shared/despesa-form.utils"

// export function setDetalhesFrequenciaFields(form: FormGroup, frequencia: Frequencia | "") {

//     let detalhesFrequenciaFormFields: {
//         [key in Frequencia | ""]: any
//     } = {
//         'Mensal': {
//             "diaPagamento": ""
//         },
//         'Semanal': {
//             "diaSemana": ""
//         },
//         'Outro': {
//             "unidade": "",
//             "quantidade": "",
//         },
//         "": {}
//     }

//     let detalhesFrequenciasFG = form.get("detalhesFrequencia")

//     if (!(detalhesFrequenciasFG instanceof FormGroup)) return

//     removeAllControls(detalhesFrequenciasFG)

//     if (frequencia === "Outro") {
//         form.get("dataProximoPagamento")!.addValidators([Validators.required])
//     }

//     addControls(
//         detalhesFrequenciasFG,
//         detalhesFrequenciaFormFields[frequencia]
//     )

//     console.log(form)
// }