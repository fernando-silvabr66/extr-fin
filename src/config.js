import 'dotenv/config';

export const config = {
  appKey: process.env.OMIE_APP_KEY,
  appSecret: process.env.OMIE_APP_SECRET,
  baseUrl: 'https://app.omie.com.br/api/v1',
};

if (!config.appKey || !config.appSecret) {
  throw new Error('OMIE_APP_KEY e OMIE_APP_SECRET são obrigatórios no .env');
}