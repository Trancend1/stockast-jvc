import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    ignores: [
      '.next/**',
      'next-env.d.ts',
      'node_modules/**',
      'supabase/.branches/**',
      'src/lib/db/types.ts',
    ],
  },
  {
    rules: {
      // Forbidden constructs per ENGINEERING_STANDARDS.md §8.4
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      // Anti-slop: disallow inline English UI strings via custom rule when added
      // For now: encourage centralization via lint-staged grep in pre-commit (lefthook)
    },
  },
];

export default config;
