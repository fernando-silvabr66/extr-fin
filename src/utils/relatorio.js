/**
 * Formata um número como moeda brasileira.
 */
function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Exibe o relatório de extrato no terminal.
 */
export function exibirRelatorio(extrato, conta, dataInicio, dataFim) {
  const linha = '─'.repeat(70);

  console.log(`\n${linha}`);
  console.log(` EXTRATO DE CONTA CORRENTE`);
  console.log(` Conta: ${conta}   |   Período: ${dataInicio} a ${dataFim}`);
  console.log(linha);

  // --- Entradas ---
  console.log('\n ENTRADAS');
  console.log(' ' + '─'.repeat(68));
  if (extrato.entradas.length === 0) {
    console.log('  Nenhuma entrada no período.');
  } else {
    for (const e of extrato.entradas) {
      const desc = e.descricao.padEnd(38).substring(0, 38);
      console.log(`  ${e.data}  ${desc}  ${moeda(e.valor).padStart(14)}`);
    }
  }

  // --- Saídas ---
  console.log('\n SAÍDAS');
  console.log(' ' + '─'.repeat(68));
  if (extrato.saidas.length === 0) {
    console.log('  Nenhuma saída no período.');
  } else {
    for (const s of extrato.saidas) {
      const desc = s.descricao.padEnd(38).substring(0, 38);
      console.log(`  ${s.data}  ${desc}  ${moeda(s.valor).padStart(14)}`);
    }
  }

  // --- Totais ---
  console.log(`\n${linha}`);
  console.log(`  Total de Entradas : ${moeda(extrato.totalEntradas).padStart(14)}`);
  console.log(`  Total de Saídas   : ${moeda(extrato.totalSaidas).padStart(14)}`);
  console.log(`  Saldo do Período  : ${moeda(extrato.saldo).padStart(14)}`);
  console.log(linha + '\n');
}