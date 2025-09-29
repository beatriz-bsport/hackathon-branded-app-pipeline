# Bsport React Widget

## Quickstart

### Install dependencies

The widget uses a symlink to the `saas-legacy` folder and relies on its source code (instead of the build output of `saas-legacy`).

To instruct pnpm to create the link:

```sh
pnpm i
```

### Running the widget

To run with local saas-legacy and backend:

```sh
pnpm run start
```

To test the integration of a deployed widget:

```sh
# Run with widgets hosted on localhost:3000 and local backend
pnpm run start:local
# Run with widgets hosted on localhost:3000 and dev backend (start-dev)
pnpm run start:mix
# Run with widgets deployed on dev
pnpm run start:dev
# Run with widgets deployed on staging
pnpm run start:staging
# Run with widgets deployed on production
pnpm run start:production
```

You just need to adapt `public/index.html` file with the right parameters to display the desired widget.

## Widget types

A widgetType is a standalone component that can be displayed anywhere in the client website.

Some of them are :

- Calendar
- Newsletter registration form
- Workshop
- LoginButton

They should load fast and not clutter the main website interface. They are little to no dependant on the user displaying it.

## Display complex pages

### Why simple widgetTypes is not enough ?

These widgets are nice but we may want to display more complex stuff, a calendar is nice but we want to book a class with it (3-4 differents screens). Or also :

- payment pages for pass
- client profile pages
- private service booking

### Our solution: the Modal and dialogMode

See `libs/modal/`

To resolve this problem, we can open a new "window" which has navigation inside of it. Depending on the website we provide 3 ways :

- DIALOG_MODE_IFRAME: (nice) a modal built in the widget, but which content is actually an iframe of carefully built pages of the backoffice for that. The whole container of the modal (including close button) is still inside the widget
- DIALOG_MODE_POPUP: (bad) a simple popup that opens these pages of the backoffice
- DIALOG_MODE_TAB: (worst, and legacy) open a new browser tab in which the navigation will continue

Each of these are able to communicate with the widget, and can even autoclose when the main action is finished (e.g: when booking is done, or login/signup)

## Data Bridge

See `libs/bridge/`

We want to display stuff from the user account directly into the widget. The main problem here is that the widget is regular HTML _inside_ the studio website, and we dont want to transmit personal info there.

For privacy reasons obviously but mainly for security concerns. A studio website is usually not maintained, outdated, and easily compromised. Thus we want to avoid making any auth token going through it.

So how do we make a HTTP request from the widget to gather for e.g number of booking ?

### Concept: iframes' magic

An iframe is a complete different website encapsulated into another. It does not share any cookie/localStorage/whatever.

We leverage this feature to build a _bridge_ between the widget and the @bsport/saas-legacy project.

### The BackofficeDataBridge

Inside `libs/bridge/BackofficeDataBridge` we spawn a 1px iframe that displays an empty, fully isolated page.

This webpage has the following properties :

- does not share any data by default with the main website (except browser compromised)
- it is automatically authenticated to the bsport servers, as is the main backoffice
- has the full redux store of @bsport/saas-legacy (consumer-side)
- it can receive message from the main website via `postMessage`
- it can answer non privacy-sensitive messages with the widget (aka the whole website)

### Data flow

1. Mount the iframe

In `libs/bridge/BackofficeDataBridge`

- when mounted it prepare an iframe of the backoffice (`pages/widget/WidgetBridge`)
- if an iframe with this ID already exists, it mounts but without the iframe, not to load too much js several times and for consistency

2. When needed dispatch actions

In `libs/bridge/actions`

- has a few requestBridgeXXXXX methods to speak the backoffice
- when dispatched it updates its reducer store to put some loading for instance

3. Handled by @bsport/saas-legacy

In `@bsport/saas-legacy: pages/widget/WidgetBridge.page`

- has an eventListener and prepare the data based on each message type
- send the postMessage containing what it needs to be transmitted

4. Sanitized data handled by the widget

In `libs/bridge/BackofficeDataBridge`

- has an event listener for these messages
- dispatch other success redux actions to update the redux store when received

## But why a widget and not just a global iframe?

- Interaction between the frame and the hosting page is tricky and not recommended
- You can only display content within the iframe, no floating button or modal
- iframe and content resizing is impossible or very clumsy / hard
- iframe sandboxing can result in missing functionalities, also no responsiveness (the iframe only know its size, not the webpage one)

## My selector doesn't work ?

If your selector doesn't work, it can be because the widget has his own reducer. Add the field you want in `src/reducers/index.ts`

### Read more

Based on - https://seriousben.github.io/embeddable-react-widget

Read more about about widgets, react and scoping of css.

- https://www.robinwieruch.de/minimal-react-webpack-babel-setup/#hot-module-replacement
- https://codeburst.io/building-react-widget-libraries-using-webpack-e0a140c16ce4
- https://github.com/timarney/react-app-rewired
- https://github.com/premasagar/cleanslate
- https://github.com/krasimir/third-party-react-widget
- https://github.com/jenyayel/js-widget
- https://github.com/anakinjay/react-widget-starter
- https://webpack.js.org/guides/author-libraries/
- https://github.com/webpack-contrib/webpack-serve
- https://medium.freecodecamp.org/part-1-react-app-from-scratch-using-webpack-4-562b1d231e75
- https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js
- https://github.com/webpack-contrib/purifycss-webpack
- https://medium.com/quick-code/from-zero-to-deploy-set-up-react-stack-with-webpack-3-20b57d6cb8d7
- https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220
- http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6
- https://github.com/javascript-obfuscator/webpack-obfuscator
- https://github.com/tsileo/embedded-js-widget
- https://thomassileo.name/blog/2014/03/27/building-an-embeddable-javascript-widget-third-party-javascript/
