// types.ts
export interface Technician {
  _id?: string;
  Technician_Person_name: string;
  Address: string;
  City: string;
  Mobile_1: string;
  Mobile_2: string;
  date: string;
  rowNumber?: number; // Optional for displaying row number
}
