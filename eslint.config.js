import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {ignores: ['dist', '.next', 'node_modules']},
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            // Allow metadata exports in Next.js App Router pages
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true,
                    allowExportNames: ['metadata', 'generateMetadata', 'dynamic']
                }
            ],
            "@typescript-eslint/ban-ts-comment": "off",
            // Enforce no unused vars (catches errors that fail in CI/CD)
            "@typescript-eslint/no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }]
        },
    },
)
