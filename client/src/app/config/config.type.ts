export interface AppConfigType {
  api: ApiType;
  featureFlags?: FeatureFlagType;
}

export interface ApiType {
  login: string;
  admins: string;
  addAdmin: string;
  activateAdmin: string;
  employees: string;
  activateEmployee: string;
  addEmployee: string;
  category: string;
  expense: string;
}

export interface FeatureFlagType {
  isSearchFilterActive?: boolean;
  isDeleteInvoiceDisabled?: boolean;
  isUpdateInvoiceDisabled?: boolean;
  isUpdateProductActive?: boolean;
  isDeleteProductActive?: boolean;
  isViewProductDetailsActive?: boolean;
}
