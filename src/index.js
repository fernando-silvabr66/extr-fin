import { buscarExtrato } from './services/extrato.js';
import { listarContasCorrentes } from './services/contaCorrente.js';
import { exibirRelatorio } from './utils/relatorio.js';

// ─── Parâmetros de entrada ────────────────────────────────────────────────────
// Adapte aqui ou receba via args de linha de comando / interface
const CONTA_CORRENTE = 11021278131;     // Substitua pelo nCodCC da conta desejada
const DATA_INICIO    = '01/06/2026';
const DATA_FIM       = '15/06/2026';
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  // Opcional: listar contas disponíveis para escolha
  // const contas = await listarContasCorrentes();
  // console.table(contas);

  const extrato = await buscarExtrato(CONTA_CORRENTE, DATA_INICIO, DATA_FIM);
  exibirRelatorio(extrato, CONTA_CORRENTE, DATA_INICIO, DATA_FIM);
}

main().catch((err) => {
  console.error('\n[ERRO]', err.message);
  process.exit(1);
});