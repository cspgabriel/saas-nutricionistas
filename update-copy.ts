import fs from 'fs';

function replaceInFile(filepath: string, replacements: {from: RegExp, to: string}[]) {
  let content = fs.readFileSync(filepath, 'utf8');
  let hasChanges = false;
  replacements.forEach(r => {
    if (r.from.test(content)) {
      content = content.replace(r.from, r.to);
      hasChanges = true;
    }
  });
  if (hasChanges) {
    fs.writeFileSync(filepath, content);
    console.log(`Updated ${filepath}`);
  }
}

replaceInFile('src/pages/LandingPage.tsx', [
  { from: /Faturamento TISS\/TUSS/g, to: 'Cálculo de Recordatório 24H' },
  { from: /Faturamento TISS\/TUSS Automático/g, to: 'Exportação em PDF do Plano Alimentar e Avaliação' },
  { from: /Prontas para gerar guias TISS\/TUSS/g, to: 'Histórico completo de medidas, dietas e anamnese' }
]);
