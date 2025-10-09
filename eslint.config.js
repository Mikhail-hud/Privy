// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginImport from "eslint-plugin-import";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default tseslint.config(
    pluginJs.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    pluginReact.configs.flat.recommended,
    pluginReactHooks.configs.recommended,
    {
        files: ["src/**/*.{js,jsx,ts,tsx}"],
        plugins: {
            import: pluginImport,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                JSX: true,
            },
            parserOptions: {
                project: true,
                ecmaFeatures: { jsx: true },
            },
        },
        settings: {
            react: { version: "detect" },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                    moduleDirectory: ["node_modules", "src/"],
                },
                typescript: true,
            },
        },
        rules: {
            ...pluginImport.configs.recommended.rules,
            ...pluginImport.configs.typescript.rules,
            "react/react-in-jsx-scope": "off",
            "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/no-floating-promises": "off"
        },
    },

    {
        plugins: {
            prettier: pluginPrettier,
        },
        rules: {
            "prettier/prettier": "warn",
        },
    },
    configPrettier,
    {
        ignores: [
            "dist/",
            "node_modules/",
            ".vite/",
            "coverage/",
            "*.cjs",
            ".eslintrc-auto-import.json",
            "auto-imports.d.ts",
        ],
    }
);
