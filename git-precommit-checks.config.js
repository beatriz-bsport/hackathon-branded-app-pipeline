module.exports = {
  display: {
    notifications: true,
    offendingContent: true,
    rulesSummary: false,
    shortStats: true,
    verbose: false,
  },
  rules: [
    {
      message: 'You have conflict in your files',
      regex: /^[<>|=]{4,}/m,
    },
    {
      message: 'You have badly named variable',
      regex: /( toto| tata| titi | lol | mdr)/m,
    },
    {
      message: 'Stop commit : you ensure that this should not be commited !',
      regex: /(do not commit|DO NOT COMMIT)/i,
    },
    {
      message: 'Did you forget something ?',
      nonBlocking: true,
      regex: /(?:FIXME|TODO)/,
    },
    {
      message: 'You let a "if (true)" trailing somewhere',
      regex: /if \(true\)/,
    },
    {
      message: 'You let a "if (false)" trailing somewhere',
      regex: /if \(false\)/,
    },
    {
      message: 'You let a "true &&" trailing somewhere',
      regex: /true &&/,
    },
    {
      message: 'You let a "false &&" trailing somewhere',
      regex: /false &&/,
    },
    // JS specific
    {
      filter: /\.(js|ts|tsx|jsx)$/,
      message:
        '😫 It look like your importing to much from material ui please use @material-ui/core or @material-ui/icons or @material-ui/styles',
      regex: /^import \{ .* \} from '@material-ui'/,
    },
    // to UNCOMMENT after the cleaning PR is pass
    {
      filter: /\.(js|ts|tsx|jsx)$/,
      message:
        '😫 It look like your importing to much of lodash use name imported ex: import omit from "lodash/omit"',
      regex: /^.* from 'lodash'/,
    },
  ],
};
