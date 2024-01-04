export interface IAddCategoryRequestBody {
  categoryName: string;
  adminId: number;
}

export interface ICategory {
  id: number;
  categoryName: string;
  createdAt: string;
  modifiedAt: string;
}
