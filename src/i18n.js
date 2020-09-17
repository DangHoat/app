import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import language_vn from './language/vn'
import language_en from './language/en'

import language_selected from "./language/language_selected"

i18n
    .use(LanguageDetector)
    .init({
        // we init with resources
        resources: {
            en: {
                translations: language_en
            },
            vn: {
                translations: language_vn
            }
        },
        fallbackLng: 'en',

// have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        keySeparator: false, // we use content as keys

        interpolation: {
            escapeValue: false, // not needed for react!!
            formatSeparator: ','
        },

        react: {
            wait: true
        }
    });

i18n.changeLanguage(language_selected)
export default i18n;