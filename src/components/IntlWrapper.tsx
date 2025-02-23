import React from 'react';
import { IntlProvider } from 'react-intl';
import { useLanguage } from '../contexts/LanguageContext';
import en from '../translations/en';
import ro from '../translations/ro';

const messages = { en, ro };

export const IntlWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { locale } = useLanguage();

  return (
    <IntlProvider
      messages={messages[locale as keyof typeof messages]}
      locale={locale}
      defaultLocale="en"
    >
      {children}
    </IntlProvider>
  );
}; 