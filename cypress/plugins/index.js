// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('before:browser:launch', (browser = {}, args) => {
    console.log(browser, args);
    if (browser.name === 'chrome') {
      args.push(
        '--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process',
      );
      //args.push(
      //  '--load-extension=cypress/extensions/Ignore-X-Frame-headers_v1.1',
      //);
      args.push('--disable-site-isolation-trials');
      return args;
    }
  });
};
