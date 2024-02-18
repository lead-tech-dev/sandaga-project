

export const generatePurchaseId = (): string => {
    let purchaseId: string = "13369";
    let seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

    return purchaseId + seq;
}