export interface Despesa {
    userId: string;
    despesaId: string;
    descricao: string;
    tipoPagamento: string;
    categoriaPagamento: string;
    valor: number | string
    diaPagamento: number | string;
    quantidadeParcelas?: number
    parcelaAtual?: number
    detalhesFrequencia?: Object
}