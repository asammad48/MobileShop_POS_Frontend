import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// 🔹 Import translations
import enTranslation from "../locales/en/translation.json";
import urTranslation from "../locales/ur/translation.json";

// 🔹 List of RTL languages
const rtlLanguages = ["ar", "ur", "fa", "he"];

// 🔹 Initialize i18next
i18n
  .use(LanguageDetector) // Auto-detect browser language
  .use(initReactI18next) // Connect with React
  .init({
    fallbackLng: "en", // Default language
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: { translation: enTranslation },
      ur: { translation: urTranslation },
    },
  });

// 🔹 Function to set text direction (RTL / LTR)
const setDocumentDirection = (lang: string) => {
  const dir = rtlLanguages.includes(lang) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;

  // 🔹 Optional Tailwind helper class
  document.body.classList.toggle("rtl", dir === "rtl");
  document.body.classList.toggle("ltr", dir === "ltr");
};

// 🔹 Apply direction when language changes
i18n.on("languageChanged", (lng) => {
  setDocumentDirection(lng);
});

// 🔹 Apply direction on initial load
const currentLang = i18n.language || "en";
setDocumentDirection(currentLang);

export default i18n;
