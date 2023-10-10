/** @type {import('next').NextConfig} */

const withFonts = require("next-fonts");

const nextConfig = {
  webpack(config, options) {
    return config;
  },
};
module.exports = withFonts(nextConfig);
