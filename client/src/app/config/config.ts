import { AppConfigType } from './config.type';

const isLocalhostActive = true;

const host = isLocalhostActive
  ? 'http://localhost:3000'
  : 'https://fakestoreapi.com';

export const AppConfigurations: AppConfigType = {
  api: {
    login: host + '/api/user/login',
    logout: host + '/api/user/logout',
    resetPassword: host + '/api/user/reset-password',
    admins: host + '/api/user/admins',
    addEmployee: host + '/api/user/register',
    employees: host + '/api/user',
    activateEmployee: host + '/api/user/activate',
    addAdmin: host + '/api/user/register',
    activateAdmin: host + '/api/user/activate',
    category: host + '/api/expenseCategory',
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
