export const getEnv = () => {
  if (window.runtime && window.runtime.env) {
    return window.runtime.env;
  }
  if (window.runtimeBsport && window.runtimeBsport.env) {
    return window.runtimeBsport.env;
  }
  return {};
};
