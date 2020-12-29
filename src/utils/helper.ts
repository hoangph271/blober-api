type okOrDefaultParams = {
  func(): void;
  onError?(error: Error): void;
  defaultValue?: any;
};
export function okOrDefault({ func, onError, defaultValue = {} }: okOrDefaultParams) {
  try {
    return func();
  } catch (error) {
    onError && onError(error);
    return defaultValue;
  }
}
