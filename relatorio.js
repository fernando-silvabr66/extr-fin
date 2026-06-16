import fs from 'fs';
import path from 'path';

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const caminhoArquivo = path.join(__dirname, './json/lista_movimentacao.json');

// Função auxiliar para formatar valores monetários em Real (R$)
const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Função principal que gera o relatório
function gerarRelatorio() {
  try {
    // 1. Ler o arquivo de forma síncrona (ou use fs.promises para assíncrono)
    const dadosBrutos = fs.readFileSync(caminhoArquivo, 'utf8');
    
    // 2. Converter o texto para objeto JavaScript
    const dados = JSON.parse(dadosBrutos);
    const movimentos = dados.movimentos || [];

    // Variáveis para acumular os totais do relatório
    let totalPagar = 0;
    let totalReceber = 0;
    let totalAberto = 0;
    let totalPago = 0;

    console.log('==========================================================================================');
    console.log('                            RELATÓRIO DE MOVIMENTAÇÃO FINANCEIRA                         ');
    console.log(` Página: ${dados.nPagina} / ${dados.nTotPaginas}  |  Registros nesta página: ${dados.nRegistros}  |  Total Geral: ${dados.nTotRegistros}`);
    console.log('==========================================================================================\n');

    // Cabeçalho das colunas do relatório
    console.log(
      'Vencimento'.padEnd(12) + 
      'Cód. Título'.padEnd(13) + 
      'Grupo'.padEnd(18) + 
      'Parc.'.padEnd(9) + 
      'Status'.padEnd(11) + 
      'Valor Título'.padStart(13) + 
      'Valor Aberto'.padStart(14)
    );
    console.log('-'.repeat(90));

    // 3. Iterar por cada movimentação para exibir os dados e somar totais
    movimentos.forEach(item => {
      const { detalhes, resumo } = item;

      // Alinha os dados em colunas usando padEnd e padStart
      const vencimento = detalhes.dDtVenc;
      const codTitulo = String(detalhes.nCodTitulo);
      const grupo = detalhes.cGrupo;
      const parcela = detalhes.cNumParcela;
      const status = detalhes.cStatus;
      const valorTituloStr = formatarMoeda(detalhes.nValorTitulo);
      const valorAbertoStr = formatarMoeda(resumo.nValAberto);

      console.log(
        vencimento.padEnd(12) +
        codTitulo.padEnd(13) +
        grupo.padEnd(18) +
        parcela.padEnd(9) +
        status.padEnd(11) +
        valorTituloStr.padStart(13) +
        valorAbertoStr.padStart(14)
      );

      // Regra de Negócio: Calcular os totais com base no grupo de lançamentos
      if (detalhes.cGrupo === 'CONTA_A_PAGAR') {
        totalPagar += detalhes.nValorTitulo;
      } else if (detalhes.cGrupo === 'CONTA_A_RECEBER') {
        totalReceber += detalhes.nValorTitulo;
      }

      // Acumula os saldos de pagamentos/abertos
      totalAberto += resumo.nValAberto;
      totalPago += resumo.nValPago;
    });

    // 4. Exibir o resumo financeiro consolidado ao final
    console.log('\n' + '='.repeat(90));
    console.log('                               RESUMO FINANCEIRO DO LOTE                                  ');
    console.log('='.repeat(90));
    console.log(`Total de Contas a Pagar (Débito Bruto):   ${formatarMoeda(totalPagar).padStart(15)}`);
    console.log(`Total de Contas a Receber (Crédito Bruto): ${formatarMoeda(totalReceber).padStart(15)}`);
    console.log(`Total que já foi Pago/Amortizado:          ${formatarMoeda(totalPago).padStart(15)}`);
    console.log(`Total que ainda está em Aberto:            ${formatarMoeda(totalAberto).padStart(15)}`);
    console.log('-'.repeat(90));
    
    // Saldo projetado (Receber - Pagar)
    const saldoProjetado = totalReceber - totalPagar;
    console.log(`Saldo Líquido Projetado:                  ${formatarMoeda(saldoProjetado).padStart(15)} (${saldoProjetado >= 0 ? 'SUPERÁVIT' : 'DÉFICIT'})`);
    console.log('==========================================================================================\n');

  } catch (erro) {
    console.error('Erro ao processar o arquivo de movimentações:', erro.message);
  }
}

// Executa a função
gerarRelatorio();