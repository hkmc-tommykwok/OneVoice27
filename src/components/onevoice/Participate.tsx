import { useState, type FormEvent } from "react";
import { CircleCheck, CircleAlert, LoaderCircle, User, Users } from "lucide-react";
import { content } from "@/content";
import {
  isRegistrationEnabled,
  submitRegistration,
  type RegistrationPayload,
} from "@/config/registration";
import ShineButton from "./ShineButton";

type LightType = "individual" | "group";
type SubmitState = "idle" | "submitting" | "success" | "error";

export default function Participate() {
  const c = content.participate;
  const [lightType, setLightType] = useState<LightType>("individual");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const liveEnabled = isRegistrationEnabled();

  const inputCls =
    "w-full rounded-lg bg-[#1b1236]/80 border border-[#3a2d63] px-4 py-3 text-sm text-white placeholder-[#6f6599] focus:outline-none focus:border-[#e2549e] focus:ring-1 focus:ring-[#e2549e]/50 transition-colors";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitState === "submitting") return;

    // 未設定 Apps Script 端點前維持展示模式：只顯示完成狀態，不送出資料。
    if (!liveEnabled) {
      setSubmitState("success");
      return;
    }

    const form = new FormData(e.currentTarget);
    const payload: RegistrationPayload = {
      lightType,
      groupName: lightType === "group" ? String(form.get("groupName") ?? "") : "",
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      address: String(form.get("address") ?? ""),
      email: String(form.get("email") ?? ""),
      consent: form.get("consent") === "on",
      submittedAt: new Date().toISOString(),
    };

    setSubmitState("submitting");
    try {
      await submitRegistration(payload);
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  return (
    <section id="participate" className="section-glow py-24 px-5">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <p className="eyebrow mb-4">{c.eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-5">{c.title}</h2>
        <p className="text-[#b9b1dd] leading-relaxed">{c.subtitle}</p>
      </div>

      {submitState === "success" ? (
        <div className="max-w-3xl mx-auto card-glass rounded-2xl p-12 text-center">
          <CircleCheck className="w-14 h-14 text-[#43c6d8] mx-auto mb-5" />
          <p className="text-xl font-semibold">{c.success}</p>
        </div>
      ) : (
        <form className="max-w-3xl mx-auto space-y-6" onSubmit={handleSubmit}>
          <fieldset>
            <legend className="text-sm font-semibold mb-3">{c.lightType}</legend>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: "individual" as LightType, icon: User, ...c.individual },
                { key: "group" as LightType, icon: Users, ...c.group },
              ].map((option) => (
                <label
                  key={option.key}
                  className={`card-glass rounded-xl p-6 cursor-pointer flex gap-4 items-start ${
                    lightType === option.key ? "!border-[#e2549e]/70" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="lightType"
                    value={option.key}
                    checked={lightType === option.key}
                    onChange={() => setLightType(option.key)}
                    className="sr-only"
                  />
                  <option.icon
                    className={`w-6 h-6 shrink-0 mt-0.5 ${
                      lightType === option.key ? "text-[#e88ec0]" : "text-[#8d84b8]"
                    }`}
                  />
                  <span className="flex-1">
                    <span className="block font-bold mb-1">{option.title}</span>
                    <span className="block text-sm text-[#b9b1dd] leading-relaxed">{option.desc}</span>
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 mt-1 transition-colors ${
                      lightType === option.key
                        ? "border-[#e2549e] bg-[#e2549e]"
                        : "border-[#5a4a8f]"
                    }`}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {lightType === "group" && (
            <div>
              <label htmlFor="groupName" className="block text-sm font-semibold mb-2">
                {c.groupName} <span className="text-[#e2549e]">*</span>
              </label>
              <input id="groupName" name="groupName" required className={inputCls} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
                {c.firstName} <span className="text-[#e2549e]">*</span>
              </label>
              <input id="firstName" name="firstName" required className={inputCls} />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold mb-2">
                {c.lastName} <span className="text-[#e2549e]">*</span>
              </label>
              <input id="lastName" name="lastName" required className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-semibold mb-2">
              {c.address}
            </label>
            <input id="address" name="address" placeholder={c.addressPlaceholder} className={inputCls} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              {c.email} <span className="text-[#e2549e]">*</span>
            </label>
            <input id="email" name="email" type="email" required className={inputCls} />
          </div>

          <label className="flex items-start gap-3 text-sm text-[#cfc9ec] cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 w-4 h-4 rounded border-[#5a4a8f] bg-[#1b1236] accent-[#e2549e]"
            />
            <span>
              {c.consent} <span className="text-[#e2549e]">*</span>
            </span>
          </label>

          {submitState === "error" && (
            <p role="alert" className="flex items-center justify-center gap-2 text-sm text-[#ff9ed2]">
              <CircleAlert className="w-4 h-4 shrink-0" />
              {c.error}
            </p>
          )}
          {!liveEnabled && (
            <p className="text-center text-xs text-[#6f6599]">{c.demoNote}</p>
          )}

          <ShineButton type="submit" className="w-full">
            {submitState === "submitting" ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                {c.sending}
              </>
            ) : (
              c.submit
            )}
          </ShineButton>
        </form>
      )}
    </section>
  );
}
