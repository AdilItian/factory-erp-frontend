export function getApiErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.description ??
    error?.response?.data?.message ??
    error?.message ??
    fallback
  );
}
