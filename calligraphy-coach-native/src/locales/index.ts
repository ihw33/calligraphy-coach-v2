import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en';
import ko from './ko';

// 번역 설정
const i18n = new I18n({
  en,
  ko,
  // zh와 ja는 추후 추가
});

// 기본 언어 설정
i18n.locale = Localization.locale;
i18n.enableFallback = true;
i18n.defaultLocale = 'ko';

export default i18n;

// 타입 정의
export type TranslationKeys = keyof typeof ko;