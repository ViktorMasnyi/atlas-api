export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  apiKey: process.env.API_KEY ?? 'dev-api-key',
  adminApiKey: process.env.ADMIN_API_KEY ?? 'dev-admin-key',
  adminApiKeyLabel: process.env.ADMIN_API_KEY_LABEL ?? 'admin',
  crimeAnalysis: {
    zylaApiKey: process.env.ZYLA_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY,
    crimeRateWeight: parseFloat(process.env.CRIME_RATE_WEIGHT ?? '0.3'),
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    name: process.env.DB_NAME ?? 'atlas',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    ssl: process.env.DB_SSL === 'true',
  },
});
