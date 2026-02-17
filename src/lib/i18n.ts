import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../assets/locales/en/translation.json';
import es from '../assets/locales/es/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en
            },
            es: {
                translation: es
            }
        },
        lng: 'es', // Set explicit default language
        fallbackLng: 'es',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
