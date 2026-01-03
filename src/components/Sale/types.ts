export type Sale = {
  _id: string;
  Sale_Person_name: string;
  Address: string;
  City: string;
  Mobile_1: string;
  Mobile_2: string;
  date: string;
  Deluxe?: string;
  Ultimate?: string;
  Self?: string;
  rowNumber?: number; // Add this field
};
