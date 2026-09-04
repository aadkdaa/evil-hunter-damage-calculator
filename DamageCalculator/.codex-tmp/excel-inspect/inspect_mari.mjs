import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const workbook = await SpreadsheetFile.importXlsx(
  await FileBlob.load("C:/Users/Public/Shared/DamageCalculator/계산기_1.xlsx")
);

for (const term of ["143543760", "143,543,760", "1742004", "1,742,004", "마리", "데드아이"]) {
  const result = await workbook.inspect({
    kind: "match",
    searchTerm: term,
    options: { useRegex: false, maxResults: 100 },
    maxChars: 10000,
  });
  console.log(`MATCH ${term}\n${result.ndjson}`);
}

const sheet = workbook.worksheets.getItem("계산기(복사해서쓰세요)");
for (const row of [15, 21, 27, 33, 34, 39, 47, 48]) {
  const r = sheet.getRange(`A${row}:H${row}`);
  console.log(`MOVE ROW ${row}\n` + JSON.stringify({ values: r.values, formulas: r.formulas }));
}
{
  const r = sheet.getRange("A12:H12");
  console.log("MOVE PVE ROW 12\n" + JSON.stringify({ values: r.values, formulas: r.formulas }));
}
