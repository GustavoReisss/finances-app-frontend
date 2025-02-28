export type WeekDay = {
    label: string
    value: string
}

export const TODAY = new Date()

export const WEEK_DAYS: WeekDay[] = [
    { "label": "Segunda-feira", "value": "0" },
    { "label": "Terça-feira", "value": "1" },
    { "label": "Quarta-feira", "value": "2" },
    { "label": "Quinta-feira", "value": "3" },
    { "label": "Sexta-feira", "value": "4" },
    { "label": "Sábado", "value": "5" },
    { "label": "Domingo", "value": "6" },
]