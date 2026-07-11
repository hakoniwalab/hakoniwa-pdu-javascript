export const PduEncoding = Object.freeze({
    HAKO: 'hako',
    CDR: 'cdr',
});

export function normalizePduEncoding(pduEncoding) {
    if (pduEncoding === PduEncoding.HAKO || pduEncoding === PduEncoding.CDR) {
        return pduEncoding;
    }
    throw new Error(`Unsupported PDU encoding: ${pduEncoding}`);
}
