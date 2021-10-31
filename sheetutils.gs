function getAvailableSheet() {
  const sheetId = "YOUR_SHEET_ID";
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName("LINE用");
  return sheet;
}

function getSheetData() {
  const sh = getAvailableSheet();
  const lastRow = sh.getLastRow();
  const lastColumn = sh.getLastColumn();

  const data = sh.getRange(1, 1, lastRow, lastColumn).getValues();

  const result = shape_data(data);

  return result;
}

function setSheetData(data) {
  const sh = getAvailableSheet();

  const data4set = deshape_data(data);

  const lastRow = data4set.length;
  const lastColumn = data4set[0].length;


  sh.getRange(1, 1, lastRow, lastColumn).setValues(data4set);
}

function shape_data(data) {
  /* 配列となっているdataを変数・ユーザに分けて返す */
  result = {};
  result["var"] = {};
  for (var i=0; i<data[0].length; i++) {
    k = data[0][i]; // 1行目; 変数名の行
    v = data[1][i]; // 2行目; 値の行
    result["var"][k] = v;
  }

  result["user"] = {};
  const data4user = transpose(data.slice(3));
  for (row of data4user) {
    if (row[0].length==0) break;
    result["user"][row[0]] = {};
    result["user"][row[0]]["名前"] = row[1];
    result["user"][row[0]]["金額"] = row.slice(2);
  }
  return result;
}

function deshape_data(data) {
  /* shape_dataの逆変換 */
  const result = []
  const row1 = []
  const row2 = []
  const row3 = []
  const idRow = [] // row4
  const nameRow = [] // row5
  const moneyColumn = [] // row6

  for (var k in data["user"]) {
    idRow.push(k);
    nameRow.push(data["user"][k]["名前"]);
    moneyColumn.push(data["user"][k]["金額"]);
  }

  const user_maxWidth = Object.keys(data["user"]).length;
  const user_maxHeight = Math.max(...moneyColumn.map(it=> it.length));
  const var_maxWidth = Object.keys(data["var"]).length;
  const maxlen = user_maxWidth > var_maxWidth ? user_maxWidth : var_maxWidth;

  for (var k in data["var"]) {
    row1.push(k);
    row2.push(data["var"][k]);
    row3.push("");
  }

  result.push(fill_len(row1, maxlen));
  result.push(fill_len(row2, maxlen));
  result.push(fill_len(row3, maxlen));
  result.push(fill_len(idRow, maxlen));
  result.push(fill_len(nameRow, maxlen));

  const moneyColumn_fill = moneyColumn.map(it=> fill_len(it, user_maxHeight));

  for (var row of transpose(moneyColumn_fill)) {
    result.push(row);
  }
  return result;
}

function fill_len(arr, len) {
  while (arr.length<len) arr.push("");
  return arr
}

function sum(arr) {
  return arr.reduce(function(prev, current, i, arr) {
    return Number(prev)+Number(current);
  });
}

function transpose(a) {
  return a[0].map((_, c) => a.map(r => r[c]))
}

function getSumValue(data) {
  result = "";
  for (var k in data["user"]) {
    if (data["user"][k]["名前"]=="名前") continue
    result += `${data["user"][k]["名前"]}\t${sum(data["user"][k]["金額"])}円\n`
  }
  return result;
}

function exchangeMoney(text) {
  text = text.trim()
          .replace("円", "").replace(",", "")
          .replace(" ", "").replace("　", "")
  mon = Number(text);
  if (mon==NaN) return false;
  else return mon;
}

function test() {
  data = getSheetData()
  console.log(data)
  console.log(getSumValue(data))
}
