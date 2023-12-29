import { AppConfigType } from './config.type';

const isLocalhostActive = true;

const host = isLocalhostActive
  ? 'http://localhost:3000'
  : 'https://fakestoreapi.com';

export const AppConfigurations: AppConfigType = {
  api: {
    restaurants: host + '/restaurant',
    admins: host + '/admins',
    addAdmin: host + '/api/user/register',
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
