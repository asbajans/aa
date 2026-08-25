import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "es"],
  defaultLocale: "tr",
  localePrefix: "never", // geçici: tüm diller prefix'siz (ileride as-needed + [locale] klasörü ile aktif edilecek)
});
