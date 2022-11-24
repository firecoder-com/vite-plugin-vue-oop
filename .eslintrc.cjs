module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended",
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        "comma-dangle": ["error", "always-multiline"],
        "indent": ["error", 4],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-duplicate-imports": ["off"],
        "no-multiple-empty-lines": ["error", { max: 2, maxEOF: 0, maxBOF: 0 }],
        "import/no-duplicates": ["off"],
        "padded-blocks": ["off"],
        "quotes": ["error", "double", { allowTemplateLiterals: true }],
        "quote-props": ["error", "consistent-as-needed"],
        "semi": ["error", "always"],
        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],
    },
    overrides: [
        {
            files: [
                ".eslintrc.cjs",
                "vue.config.cjs",
                "vue.config.js",
                "babel.config.js",
            ],
            rules: {
                "@typescript-eslint/no-var-requires": ["off"],
            },
        },
    ],
    ignorePatterns: [
        "dist/**", "lib/**",
    ],
};
