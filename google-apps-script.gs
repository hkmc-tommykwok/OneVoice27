/**
 * 同聲傳揚27「加入你的身影」報名接收腳本
 *
 * 部署方式詳見專案根目錄的 GOOGLE_SHEETS_SETUP.md。
 * 把 SPREADSHEET_ID 換成你的 Google 試算表 ID。
 */

// 試算表網址 https://docs.google.com/spreadsheets/d/【這一段】/edit
const SPREADSHEET_ID = "把你的試算表ID貼在這裡";
const SHEET_NAME = "報名資料";

const HEADERS = [
  "送出時間",
  "光的類型",
  "機構名稱",
  "名字",
  "姓氏",
  "地址",
  "電子郵件",
  "同意接收電子報",
];

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      data.submittedAt || new Date().toISOString(),
      data.lightType === "group" ? "群體燈塔" : "個人之光",
      data.groupName || "",
      data.firstName || "",
      data.lastName || "",
      data.address || "",
      data.email || "",
      data.consent ? "是" : "否",
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// 測試用：在 Apps Script 編輯器直接執行一次，確認能寫入。
function testWrite() {
  doPost({
    postData: {
      contents: JSON.stringify({
        lightType: "individual",
        groupName: "",
        firstName: "測試",
        lastName: "資料",
        address: "",
        email: "test@example.com",
        consent: true,
        submittedAt: new Date().toISOString(),
      }),
    },
  });
}
