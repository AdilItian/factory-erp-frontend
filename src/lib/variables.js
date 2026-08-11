const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_APP_ENV || "local";
};

const configs = {
  local: {
    BOILER_PLATE_BACKEND_BASE_URL: 'http://localhost:5000',
    API_BASE_URL: 'https://company-os-ten-beta.vercel.app'
  },
  dev: {
    BOILER_PLATE_BACKEND_BASE_URL: 'https://company-os-ten-beta.vercel.app',
    API_BASE_URL: 'https://company-os-ten-beta.vercel.app'
  },
  live: {
    BOILER_PLATE_BACKEND_BASE_URL:
      process.env.NEXT_PUBLIC_BOILER_PLATE_BACKEND_BASE_URL,
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
  }
};

export const environment = getEnvironment() || "local";
const variables = configs[environment] || configs.local;

export default variables;
