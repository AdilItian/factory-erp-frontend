const getEnvironment = () => {
  return process.env.NEXT_PUBLIC_APP_ENV || 'live';
};

const configs = {
  live: {
    CORE_SERVICE_BASE_URL: 'https://core-api.we-aid.org',
    USER_SERVICE_BASE_URL: 'https://user-api.we-aid.org'
  }
};

export const environment = getEnvironment() || 'dev';
const variables = configs[environment] || configs.dev;

export default variables;
