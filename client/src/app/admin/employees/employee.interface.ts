export interface IAddEmployeeRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  roleId: number;
  adminId?: number;
}

export interface IEmployees extends IAddEmployeeRequestBody {
  createdAt: string;
  id: number;
  isActive: number;
  isVerified: number;
  modifiedAt: string;
  transactionCount?: number;
}
