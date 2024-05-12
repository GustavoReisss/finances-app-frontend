export interface Despesa {
    userId: string;
    despesaId: string;
    descricao: string;
    frequencia?: string;
    tipoPagamento: string;
    categoriaPagamento: string;
    valor: number | string
    diaPagamento: number | string;
    quantidadeParcelas?: number
    parcelaAtual?: number
    detalhesFrequencia?: {
        diaSemana?: string,
        diaPagamento?: string,
        quantidade?: string,
        unidade?: string
    }
    ultimoPagamento?: string
}