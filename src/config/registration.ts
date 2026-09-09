/**
 * Google 試算表寫入端點設定
 *
 * 啟用方式：
 * 1. 依專案根目錄的《GOOGLE_SHEETS_SETUP.md》部署 Google Apps Script Web App。
 * 2. 把部署後取得的 Web App URL（結尾是 /exec）貼到下面 REGISTRATION_ENDPOINT。
 * 3. 重新建置並保存版本。
 *
 * 在貼上 URL 之前，表單會維持「展示模式」：只顯示成功訊息，不送出資料。
 */
export const REGISTRATION_ENDPOINT = "";

export type RegistrationPayload = {
  lightType: "individual" | "group";
  groupName: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  consent: boolean;
  submittedAt: string;
};

export function isRegistrationEnabled(): boolean {
  return REGISTRATION_ENDPOINT.startsWith("https://script.google.com/");
}

export async function submitRegistration(payload: RegistrationPayload): Promise<void> {
  // Apps Script Web App 不回傳 CORS 標頭，因此使用 no-cors 送出；
  // 回應雖不可讀取，但資料會寫入試算表。送出失敗（網路中斷等）才會拋錯。
  await fetch(REGISTRATION_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
}
