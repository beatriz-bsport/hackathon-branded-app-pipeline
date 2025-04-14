const getTranslations = async () => {
  // Async script to retrieve data from any package like @bsport/common

  return {
    goodbye: "Goodbye world",
    nested: {
      item1: "I'm the first item !",
      item2: "I'm the second item !",
    },
  };
};

exports.default = getTranslations();
