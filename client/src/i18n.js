import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Dashboard": "Dashboard",
      "Admin Panel": "Admin Panel",
      "Community": "Community",
      "Track": "Track Status",
      "Login": "Login",
      "Register": "Register",
      "Logout": "Logout",
      "Lodge New Grievance": "Lodge New Grievance",
      "Issue Title": "Issue Title *",
      "Category": "Category *",
      "Precise Location": "Precise Location *",
      "Detailed Description": "Detailed Description *",
      "Submit Grievance": "Submit Grievance",
    }
  },
  ta: {
    translation: {
      "Home": "முகப்பு",
      "Dashboard": "டாஷ்போர்டு",
      "Admin Panel": "நிர்வாகி குழு",
      "Community": "சமூக பார்வை",
      "Track": "நிலை அறிய",
      "Login": "உள்நுழைய",
      "Register": "பதிவு செய்",
      "Logout": "வெளியேறு",
      "Lodge New Grievance": "புதிய குறையை பதிவு செய்க",
      "Issue Title": "தலைப்பு *",
      "Category": "வகை *",
      "Precise Location": "இடம் *",
      "Detailed Description": "விரிவான விளக்கம் *",
      "Submit Grievance": "குறையை சமர்ப்பி",
    }
  },
  hi: {
    translation: {
      "Home": "होम",
      "Dashboard": "डैशबोर्ड",
      "Admin Panel": "व्यवस्थापक पैनल",
      "Community": "समुदाय",
      "Track": "स्थिति ट्रैक करें",
      "Login": "लॉग इन",
      "Register": "पंजीकरण करें",
      "Logout": "लॉग आउट",
      "Lodge New Grievance": "नई शिकायत दर्ज करें",
      "Issue Title": "समस्या का शीर्षक *",
      "Category": "श्रेणी *",
      "Precise Location": "सटीक स्थान *",
      "Detailed Description": "विस्तृत विवरण *",
      "Submit Grievance": "शिकायत दर्ज करें",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
