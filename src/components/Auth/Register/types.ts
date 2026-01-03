// types.ts
export type User = {
  _id: string;
  username: string;
  email: string;
  Mobile_1: number;
  Mobile_2: number;
  role: "user" | "admin"; // Restrict role to "user" or "admin"
};
