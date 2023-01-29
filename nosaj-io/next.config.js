/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['data'],
  webpack: config => {
    // camelCase style names from css modules
    config.module.rules
      .find(({ oneOf }) => !!oneOf)
      .oneOf.filter(({ use }) => JSON.stringify(use)?.includes('css-loader'))
      .reduce((acc, { use }) => acc.concat(use), [])
      .forEach(({ options }) => {
        if (options.modules) {
          // 'dashes' will only camelCase "-" words, ie. my_class-name => my_className
          options.modules.exportLocalsConvention = 'dashes';
        }
      });

    return config;
  },
};

module.exports = nextConfig;
