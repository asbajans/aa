import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en", "es"],
  defaultLocale: "tr",
  localePrefix: "as-needed", // tr prefix yok, en/es var
});
