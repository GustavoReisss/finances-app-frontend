export type Entrada = {
    userId: string
    entradaId: string
    descricao: string
    valor: number
    data: string
}

export type EntradaEditable = Entrada & {
    loading: boolean
    editing: boolean
}