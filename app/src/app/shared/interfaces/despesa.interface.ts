export interface Despesa {
    userId: string;
    despesaId: string;
    descricao: string;
    tipoPagamento: string;
    categoriaPagamento: string;
    valor: number | string
    diaPagamento: number | string;
    mesesRecorrencia: number | string;
    parcelado: boolean;
}