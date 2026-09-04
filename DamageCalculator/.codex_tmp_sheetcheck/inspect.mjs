import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load("C:/Users/Public/Shared/DamageCalculator/계산기_1.xlsx"));
const requests = [
  ["계산기(복사해서쓰세요)", "A82:Q104"],
  ["방어력계산기", "A1:O18"],
  ["비교계산기", "A1:AI15"],
  ["비교계산기", "A80:AI104"],
  ["측정기 원본", "A80:Q103"],
  ["데미지검증기", "A1:S30"],
];
for (const [sheetId, range] of requests) {
  const x = await wb.inspect({kind:"table", sheetId, range, include:"values,formulas", maxChars:18000, tableMaxRows:40, tableMaxCols:40, tableMaxCellChars:200});
  console.log(`\n### ${sheetId} ${range}\n${x.ndjson}`);
}
