import { omieCall } from '../omieClient.js';

/**
 * Lista todas as contas correntes cadastradas no Omie.
 */
export async function listarContasCorrentes() {
  const resultado = await omieCall(
    'geral/contacorrente',
    'ListarContasCorrentes',
    { nPagina: 1, nRegPorPagina: 50 }
  );

  // Retorna array de contas com código e descrição
  return (resultado.ListarContasCorrentes || []).map((cc) => ({
    codigo: cc.nCodCC,
    descricao: cc.cDescricao,
    banco: cc.cCodBanco,
  }));
}