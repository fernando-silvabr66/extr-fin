import axios from 'axios';
import { config } from './config.js';

/**
 * Realiza uma chamada autenticada à API Omie.
 * @param {string} endpoint  - Ex: 'financas/extrato'
 * @param {string} call      - Nome do método Omie. Ex: 'ListarExtrato'
 * @param {object} params    - Parâmetros específicos da chamada
 */
export async function omieCall(endpoint, call, params = {}) {
  const url = `${config.baseUrl}/${endpoint}/`;

  const payload = {
    call,
    app_key: config.appKey,
    app_secret: config.appSecret,
    param: [params],
  };

  try {
    const { data } = await axios.post(url, payload);

    // A Omie retorna erros dentro do JSON com status 200
    if (data.faultstring) {
      throw new Error(`Erro Omie: ${data.faultstring}`);
    }

    return data;
  } catch (err) {
    if (err.response) {
      throw new Error(
        `Erro HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      );
    }
    throw err;
  }
}