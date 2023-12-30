export interface IAddEmployeeRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  roleId: number;
}

export interface IEmployees extends IAddEmployeeRequestBody {
  createdAt: string;
  id: number;
  isActive: number;
  isVerified: number;
  modifiedAt: string;
  roleId: number;
  supervisorId?: number;
  transactionCount: number;
}
