import I18n from 'react-native-i18n';
import vi from './vi';
import en from './en';

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

// I18n.initAsync();

// Add different defaultLocale here (default is 'en').
// It will be used as a fallback when device locale isn't found in translations
// I18n.defaultLocale = 'nl'

// Add translations here
I18n.defaultLocale = 'vi_VN';
I18n.translations = {
    vi_VN: vi,
    en: en
};

export default I18n;
