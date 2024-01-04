import { AppConfigType } from './config.type';

const isLocalhostActive = true;

const host = isLocalhostActive
  ? 'http://localhost:3000'
  : 'https://fakestoreapi.com';

export const AppConfigurations: AppConfigType = {
  api: {
    login: host + '/api/user/login',
    admins: host + '/api/user/admins',
    addEmployee: host + '/api/admin/register',
    addAdmin: host + '/api/user/register',
    activateAdmin: host + '/api/user/activate',
    employees: host + '/api/admin/employees',
    activateEmployee: host + '/api/admin/activate',
    category: host + '/api/user/expenseCategory',
    expense: host + '/api/expense',
  },
  featureFlags: {
    isSearchFilterActive: true,
    isDeleteInvoiceDisabled: true,
    isUpdateInvoiceDisabled: true,
    isUpdateProductActive: true,
    isDeleteProductActive: true,
    isViewProductDetailsActive: true,
  },
};
