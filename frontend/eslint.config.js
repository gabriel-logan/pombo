const simpleImportSort = require("eslint-plugin-simple-import-sort");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            ["^\\u0000"],
            ["^react", "^react-native", "^expo", "^@?\\w"],
            ["^@/"],
            ["^src/"],
            ["^\\."],
          ],
        },
      ],
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
