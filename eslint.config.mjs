import next from 'eslint-config-next';

// eslint-config-next ships a flat-config array, so it is spread directly.
const config = [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'supabase/**'] },
];

export default config;
