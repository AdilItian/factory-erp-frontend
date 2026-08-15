const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_APP_ENV || "local";
};

const FACTORY_ERP_API = 'https://factory-erp-backend.vercel.app';

const configs = {
  local: {
    BOILER_PLATE_BACKEND_BASE_URL: 'http://localhost:5000',
    API_BASE_URL: FACTORY_ERP_API
  },
  dev: {
    BOILER_PLATE_BACKEND_BASE_URL: FACTORY_ERP_API,
    API_BASE_URL: FACTORY_ERP_API
  },
  live: {
    BOILER_PLATE_BACKEND_BASE_URL:
      process.env.NEXT_PUBLIC_BOILER_PLATE_BACKEND_BASE_URL || FACTORY_ERP_API,
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || FACTORY_ERP_API
  }
};

export const environment = getEnvironment() || "local";
const variables = configs[environment] || configs.local;

export default variables;
