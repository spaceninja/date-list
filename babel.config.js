module.exports = (api) => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  if (!isTest) return {};

  return {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  };
};
