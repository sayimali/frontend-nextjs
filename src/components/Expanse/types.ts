// types/types.ts

export interface Expanse {
	[x: string]: string | number | Date;
  _id: string; // Unique identifier for the expanse
  Expanse_name: string; // Name of the expanse
  Amount: number; // Amount of the expanse
  Category: string; // Category of the expanse
	Remarks: string; // Any remarks associated with the expanse
	Debit: number; // Debit amount
	Account_Title: string; // Title of the account associated with the expanse
	indate: Date;// Date of the expanse in ISO format

}
