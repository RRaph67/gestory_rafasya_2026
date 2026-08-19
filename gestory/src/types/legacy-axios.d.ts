declare module "axios" {
  // Keep compatibility for app code that expects apiClient to return raw ApiResponse<T>.
  // We only loosen typings here so TS doesn't treat it as AxiosResponse<T>.
}

