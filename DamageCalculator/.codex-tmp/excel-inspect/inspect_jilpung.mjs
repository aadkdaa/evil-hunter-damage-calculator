import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbookPath = "C:/Users/Public/Shared/DamageCalculator/계산기_1.xlsx";
const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));

const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 4000 });
console.log("SHEETS\n" + sheets.ndjson);

for (const term of ["질풍신", "질풍", "공격력증폭", "공격력 증폭"]) {
  const matches = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    summary: `search ${term}`,
    maxChars: 12000,
  });
  console.log(`MATCH ${term}\n${matches.ndjson}`);
}

const formulas = await workbook.inspect({
  kind: "formula",
  sheetId: "계산기(복사해서쓰세요)",
  range: "A1:P110",
  options: { maxResults: 500 },
  maxChars: 30000,
});
console.log("FORMULAS\n" + formulas.ndjson);

for (const range of ["A56:Q63", "A92:Q95"]) {
  const table = await workbook.inspect({
    kind: "table",
    sheetId: "계산기(복사해서쓰세요)",
    range,
    include: "values,formulas",
    tableMaxRows: 20,
    tableMaxCols: 20,
    maxChars: 16000,
  });
  console.log(`TABLE ${range}\n${table.ndjson}`);
}

const sheet = workbook.worksheets.getItem("계산기(복사해서쓰세요)");
for (const range of ["C57:J62", "H93:P95"]) {
  const r = sheet.getRange(range);
  console.log(`DIRECT ${range}\n` + JSON.stringify({ values: r.values, formulas: r.formulas }, null, 2));
}

const trace = await workbook.trace("계산기(복사해서쓰세요)!C92");
console.log("TRACE C92\n" + JSON.stringify(trace, null, 2).slice(0, 20000));

for (const sheetName of ["계산기(복사해서쓰세요)", "측정기 원본", "비교계산기"]) {
  const s = workbook.worksheets.getItem(sheetName);
  const r = s.getRange("C58:J62");
  console.log(`SHEET ${sheetName} C58:J62\n` + JSON.stringify({ values: r.values, formulas: r.formulas }, null, 2));
}

for (const s of workbook.worksheets.items) {
  if (s.name === "비교계산기") continue;
  const r = s.getRange("C59:J59");
  console.log(`ROW59 ${s.name}\n` + JSON.stringify({ values: r.values, formulas: r.formulas }));
}
