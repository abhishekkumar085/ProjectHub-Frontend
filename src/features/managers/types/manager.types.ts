// export type ManagerStatus =
//   | "ACTIVE"
//   | "INACTIVE";

export interface Manager {
  id: string;
  name: string;
  email: string;
  empId: string;
  designation: string;
  // createdAt?: string;
}

export interface CreateManagerPayload {
  name: string;
  email: string;
  empId: string;
  designation: string;
  password?: string;
  confirmPassword?: string;
//   status: ManagerStatus;
}