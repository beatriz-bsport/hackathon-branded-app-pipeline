<div align="center">
<h1>Bsport React Widget</h1>

Based on - https://seriousben.github.io/embeddable-react-widget

</div>

## Install dependencies

The widget is bult with a link to bsport-saas, you need to :
```sh
cd ../bsport-saas/ # got the saas repo
yarn link
cd -               # back to the widget repo
yarn link bsport-saas
yarn
```

## Running the widget

```sh
yarn start
```

## Troubleshooting

If you ever encounter strange import errors such as 
```sh
ERROR in ./src/App.tsx
    Module not found: Error: Can't resolve 'bsport-saas/src/theme' in 'bsport-widget/src'
     @ ./src/App.tsx 2:212-256 2:5316-5324
     @ ./src/Root.tsx
     @ ./src/index.js
     @ multi ./config.local.js ./src/index.js
```

* Check the saas project is on the right branch (feature-branch or dev usually)
* remove node_modules 
* follow the Install dependencies steps again


### Why not in an iframe?

* Interaction between the frame and the hosting page is tricky and not recommended
* You can only display content within the iframe
* iframe and content resizing is impossible
* iframe sandboxing can result in missing functionalities

### Read more

Read more about about widgets, react and scoping of css.

* https://www.robinwieruch.de/minimal-react-webpack-babel-setup/#hot-module-replacement
* https://codeburst.io/building-react-widget-libraries-using-webpack-e0a140c16ce4
* https://github.com/timarney/react-app-rewired
* https://github.com/premasagar/cleanslate
* https://github.com/krasimir/third-party-react-widget
* https://github.com/jenyayel/js-widget
* https://github.com/anakinjay/react-widget-starter
* https://webpack.js.org/guides/author-libraries/
* https://github.com/webpack-contrib/webpack-serve
* https://medium.freecodecamp.org/part-1-react-app-from-scratch-using-webpack-4-562b1d231e75
* https://github.com/facebook/create-react-app/blob/next/packages/react-scripts/config/webpack.config.prod.js
* https://github.com/webpack-contrib/purifycss-webpack
* https://medium.com/quick-code/from-zero-to-deploy-set-up-react-stack-with-webpack-3-20b57d6cb8d7
* https://medium.com/dailyjs/building-a-react-component-with-webpack-publish-to-npm-deploy-to-github-guide-6927f60b3220
* http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6
* https://github.com/javascript-obfuscator/webpack-obfuscator
* https://github.com/tsileo/embedded-js-widget
* https://thomassileo.name/blog/2014/03/27/building-an-embeddable-javascript-widget-third-party-javascript/
