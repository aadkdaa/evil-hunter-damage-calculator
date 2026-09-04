import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbook = await SpreadsheetFile.importXlsx(
  await FileBlob.load("C:/Users/Public/Shared/DamageCalculator/계산기_1.xlsx")
);
const sheet = workbook.worksheets.getItem("계산기(복사해서쓰세요)");

for (const range of ["C57:K62", "C64:K68", "C70:K74", "C76:K81", "H93:P95"]) {
  const r = sheet.getRange(range);
  console.log(`RANGE ${range}\n${JSON.stringify({ values: r.values, formulas: r.formulas }, null, 2)}`);
}

for (const s of workbook.worksheets.items) {
  const used = s.getUsedRange(true);
  if (!used || used.values.length < 95) continue;
  const rows = s.getRange("C58:J80").values;
  const active = [];
  for (let i = 0; i < rows.length; i++) {
    const [name, pct, equipped, reflected, pvpDamage, pvpAttack, pveDamage, pveAttack] = rows[i];
    if (name && (equipped === true || reflected === true || pvpDamage || pvpAttack || pveDamage || pveAttack)) {
      active.push({ row: 58 + i, name, pct, equipped, reflected, pvpDamage, pvpAttack, pveDamage, pveAttack });
    }
  }
  const totals = s.getRange("H93:P95").values;
  console.log(`SUMMARY ${s.name}\n${JSON.stringify({ active, totals }, null, 2)}`);
}
