const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_APP_ENV || "live";
};

const configs = {
  local: {
    BOILER_PLATE_BACKEND_BASE_URL: "http://localhost:5000",
  },
  live: {
    BOILER_PLATE_BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BOILER_PLATE_BACKEND_BASE_URL,
  },
};

export const environment = getEnvironment() || "dev";
const variables = configs[environment] || configs.dev;

export default variables;
