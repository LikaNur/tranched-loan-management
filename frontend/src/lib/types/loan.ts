export interface Loan {
	id: number;
	initialDebt: number;
	paid: number;
}

export function calculateBalance(loan: Loan): number {
	return loan.initialDebt - loan.paid;
}
