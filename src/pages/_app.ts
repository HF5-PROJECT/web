import type { App } from "vue";
import { createI18n } from "vue-i18n";

import en from "../lang/en";
import da from "../lang/da";

const i18nPlugin = createI18n({
  locale: "en",
  messages: {
    en: en,
    da: da,
  },
});

export default (app: App) => {
  app.use(i18nPlugin);
};
