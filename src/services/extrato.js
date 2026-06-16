import { omieCall } from '../omieClient.js';

/**
 * Busca uma página do extrato.
 */
async function buscarPagina(nCodCC, dDtInicio, dDtFim, nPagina) {
  return omieCall('financas/extrato', 'ListarExtrato', {
    nCodCC,
    dDtInicio,
    dDtFim,
    nPagina,
    nRegPorPagina: 50,
  });
}

/**
 * Busca o extrato completo (todas as páginas) de uma conta corrente.
 * @param {number} codContaCorrente - Código Omie da conta corrente
 * @param {string} dataInicio       - Formato DD/MM/AAAA
 * @param {string} dataFim          - Formato DD/MM/AAAA
 * @returns {object} { lancamentos, totalEntradas, totalSaidas, saldo }
 */
export async function buscarExtrato(codContaCorrente, dataInicio, dataFim) {
  let pagina = 1;
  let totalPaginas = 1;
  const todosLancamentos = [];

  console.log(`\nBuscando extrato — Conta: ${codContaCorrente} | ${dataInicio} → ${dataFim}`);

  do {
    const dados = await buscarPagina(codContaCorrente, dataInicio, dataFim, pagina);

    totalPaginas = dados.nTotPaginas ?? 1;
    const lancamentos = dados.lancamentos ?? [];

    console.log(`  Página ${pagina}/${totalPaginas} — ${lancamentos.length} lançamento(s)`);

    todosLancamentos.push(...lancamentos);
    pagina++;

  } while (pagina <= totalPaginas);

  return processarLancamentos(todosLancamentos);
}

/**
 * Separa e totaliza entradas e saídas.
 */
function processarLancamentos(lancamentos) {
  const entradas = [];
  const saidas = [];

  for (const lanc of lancamentos) {
    const item = {
      data:      lanc.dData        ?? '',
      descricao: lanc.cDescricao   ?? '',
      documento: lanc.cNumDoc      ?? '',
      valor:     lanc.nValor       ?? 0,
      tipo:      lanc.cTipo        ?? '',   // 'E' entrada / 'S' saída — validar na doc
    };

    // Separação por sinal do valor ou campo cTipo (o que a API retornar)
    if (item.valor >= 0) {
      entradas.push(item);
    } else {
      saidas.push({ ...item, valor: Math.abs(item.valor) });
    }
  }

  const totalEntradas = entradas.reduce((acc, e) => acc + e.valor, 0);
  const totalSaidas   = saidas.reduce((acc, s) => acc + s.valor, 0);
  const saldo         = totalEntradas - totalSaidas;

  return { entradas, saidas, totalEntradas, totalSaidas, saldo };
}