import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      sidebar: {
        feed: 'Personalized Feed',
        trending: 'Trending',
        favorites: 'Favorites',
        settings: 'Settings',
        profile: 'Profile',
      },
      navbar: {
        searchPlaceholder: 'Search across news, movies, and social...',
        notifications: 'Notifications',
        logout: 'Log Out',
        login: 'Log In',
      },
      categories: {
        technology: 'Technology',
        science: 'Science',
        entertainment: 'Entertainment',
        business: 'Business',
        sports: 'Sports',
        politics: 'Politics',
        health: 'Health',
        all: 'All Categories',
      },
      dashboard: {
        title: 'Personalized Content Hub',
        welcome: 'Welcome back, {{name}}!',
        layoutSettings: 'Dashboard Layout',
        layoutDescription: 'Drag and reorder the sections below to customize your feed view.',
        newsSection: 'News Headlines',
        moviesSection: 'Recommended Movies',
        socialSection: 'Social Feed',
        noResults: 'No content found matching your search.',
        favoritesEmpty: 'Your favorites list is empty. Click the bookmark icon on any card to save it!',
        favoritesTitle: 'Bookmarked Favorites',
        trendingTitle: 'What\'s Buzzing Now',
        realTimeTitle: 'Live Notifications Stream',
        loadMore: 'Load More Content',
        loading: 'Fetching updates...',
        readMore: 'Read Article',
        viewMovie: 'View Details',
        reorderTip: 'Tip: You can drag and drop cards to reorder your layout!',
      },
      settings: {
        title: 'User Preferences',
        categoriesLabel: 'Favorite Categories',
        categoriesDesc: 'Select categories you want prioritized in your feed.',
        langLabel: 'Preferred Language',
        themeLabel: 'Interface Theme',
        themeLight: 'Light Mode',
        themeDark: 'Dark Mode',
        compactLabel: 'Compact Cards Layout',
        saveBtn: 'Save Preferences',
        savedSuccess: 'Preferences saved successfully!',
      },
    },
  },
  hi: {
    translation: {
      sidebar: {
        feed: 'व्यक्तिगत फ़ीड',
        trending: 'ट्रेंडिंग',
        favorites: 'पसंदीदा',
        settings: 'सेटिंग्स',
        profile: 'प्रोफ़ाइल',
      },
      navbar: {
        searchPlaceholder: 'समाचार, फ़िल्में और सोशल में खोजें...',
        notifications: 'सूचनाएं',
        logout: 'लॉग आउट',
        login: 'लॉग इन',
      },
      categories: {
        technology: 'प्रौद्योगिकी',
        science: 'विज्ञान',
        entertainment: 'मनोरंजन',
        business: 'व्यवसाय',
        sports: 'खेल',
        politics: 'राजनीति',
        health: 'स्वास्थ्य',
        all: 'सभी श्रेणियां',
      },
      dashboard: {
        title: 'व्यक्तिगत सामग्री हब',
        welcome: 'स्वागत है, {{name}}!',
        layoutSettings: 'डैशबोर्ड लेआउट',
        layoutDescription: 'अपने फ़ीड दृश्य को कस्टमाइज़ करने के लिए नीचे दिए गए अनुभागों को खींचें और पुनर्व्यवस्थित करें।',
        newsSection: 'समाचार सुर्खियां',
        moviesSection: 'अनुशंसित फ़िल्में',
        socialSection: 'सोशल फ़ीड',
        noResults: 'आपकी खोज से मेल खाती कोई सामग्री नहीं मिली।',
        favoritesEmpty: 'आपकी पसंदीदा सूची खाली है। इसे सहेजने के लिए किसी भी कार्ड पर बुकमार्क आइकन पर क्लिक करें!',
        favoritesTitle: 'बुकमार्क किए गए पसंदीदा',
        trendingTitle: 'अब क्या चर्चा में है',
        realTimeTitle: 'लाइव सूचनाएं स्ट्रीम',
        loadMore: 'और सामग्री लोड करें',
        loading: 'अपडेट प्राप्त हो रहे हैं...',
        readMore: 'लेख पढ़ें',
        viewMovie: 'विवरण देखें',
        reorderTip: 'सुझाव: आप अपने लेआउट को पुनर्व्यवस्थित करने के लिए कार्ड को ड्रैग और ड्रॉप कर सकते हैं!',
      },
      settings: {
        title: 'उपयोगकर्ता प्राथमिकताएं',
        categoriesLabel: 'पसंदीदा श्रेणियां',
        categoriesDesc: 'उन श्रेणियों का चयन करें जिन्हें आप अपने फ़ीड में प्राथमिकता देना चाहते हैं।',
        langLabel: 'पसंदीदा भाषा',
        themeLabel: 'इंटरफ़ेस थीम',
        themeLight: 'लाइट मोड',
        themeDark: 'डार्क मोड',
        compactLabel: 'सघन कार्ड लेआउट',
        saveBtn: 'प्राथमिकताएं सहेजें',
        savedSuccess: 'प्राथमिकताएं सफलतापूर्वक सहेजी गईं!',
      },
    },
  },
};

// Client-side execution guard
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    });
} else {
  // Safe init for server rendering
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
