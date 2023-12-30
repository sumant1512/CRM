export interface IAddAdminRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  roleId: number;
}

export interface IAdmins extends IAddAdminRequestBody {
  createdAt: string;
  id: number;
  isActive: number;
  isVerified: number;
  modifiedAt: string;
  roleId: number;
  supervisorId?: number;
  transactionCount: number;
}
