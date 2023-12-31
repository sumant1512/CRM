import { AppConfigType } from './config.type';

const isLocalhostActive = true;

const host = isLocalhostActive
  ? 'http://localhost:3000'
  : 'https://fakestoreapi.com';

export const AppConfigurations: AppConfigType = {
  api: {
    login: host + '/api/user/login',
    admins: host + '/api/user/admins',
    addAdmin: host + '/api/user/register',
    category: host + '/api/user/expenseCategory',
    activateAdmin: host + '/api/user/activate',
    employees: host + '/api/admin/employees',
    activateEmployee: host + '/api/admin/activate',
    addEmployee: host + '/api/admin/register',
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
