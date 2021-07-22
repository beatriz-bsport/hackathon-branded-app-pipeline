async function managerWebpack(baseConfig, options) {
    baseConfig.resolve.extensions.push(".ts", ".tsx");
    baseConfig.module.rules.push({ test: /\.tsx?$/, use: "ts-loader" });
    return baseConfig;
}

module.exports = {
    managerWebpack: managerWebpack,
};
