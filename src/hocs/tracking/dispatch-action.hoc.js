export const withIntercomAction = (actionName) => (stuffToExecute) => (
  ...args
) => {
  if (window.Intercom) {
    window.Intercom('trackEvent', actionName);
  }
  return stuffToExecute(...args);
};

export default withIntercomAction;
