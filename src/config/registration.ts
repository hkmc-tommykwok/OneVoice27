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
export const REGISTRATION_ENDPOINT = "https://script.google.com/macros/s/AKfycbzRdkfcm6lEAZWF7yXVED-aO-PBKX-myWDiRNgRAs0D0cC12_DpfscvMCCy2pqaE4lpRg/exec";

export type RegistrationPayload = {
  lightType: "individual" | "group";
  groupName: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  consent: boolean;
  ipAddress: string;
  submittedAt: string;
};

export function isRegistrationEnabled(): boolean {
  return REGISTRATION_ENDPOINT.startsWith("https://script.google.com/");
}

/**
 * 取得訪客的公開 IP 位址。
 * Apps Script 收到的請求經過 Google 代理，無法在伺服器端取得真實 IP，
 * 因此改由瀏覽器端查詢公開 IP 服務後一併送出。
 * 同時向多個服務查詢並取最快回應，單一服務被擋（廣告攔截、地區限制）時仍有備援；
 * 全部失敗時回傳空字串，不影響報名送出。
 */
export async function getClientIp(): Promise<string> {
  const providers = [
    "https://api.ipify.org?format=json",
    "https://api64.ipify.org?format=json",
    "https://ipapi.co/json/",
    "https://api.seeip.org/jsonip",
  ];
  const attempts = providers.map(async (url) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { ip?: string };
      if (!data.ip) throw new Error("no ip");
      return data.ip;
    } finally {
      clearTimeout(timer);
    }
  });
  try {
    return await Promise.any(attempts);
  } catch {
    return "";
  }
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
