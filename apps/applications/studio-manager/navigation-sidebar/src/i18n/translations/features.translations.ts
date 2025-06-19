exports.default = {
  temporaryPassword: {
    title: "Temporary password",
    description:
      "You may generate and request a temporary password which will be valid for up to 1 week to share it with our Support Team for assistance. Your main and usual password won't be affected.",
    buttons: {
      close: "Close",
      generate: "Generate",
    },
    generatedPassword: {
      copyToClipboard: "Copy the password to the clipboard",
      copiedToClipboard: "Password copied",
      validity:
        "This password is valid until {{- expirationDate }}. Your main password has not changed.",
    },
  },
};
