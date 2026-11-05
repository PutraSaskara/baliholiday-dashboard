import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    rules: {
      // New React Compiler-era rules flagging the pre-existing
      // fetch-inside-useEffect pattern across the codebase.
      // Downgraded to warnings to keep the lint baseline of the upgrade;
      // address them in a dedicated refactor.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
