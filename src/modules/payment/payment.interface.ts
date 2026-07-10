export interface ICreatePaymentRequest {
    bookingId: string;
    paymentMethod?: string;
}

export interface IConfirmPaymentRequest {
    transactionId: string;
}
