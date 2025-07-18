import React, { useEffect, useState } from 'react';
import './GoogleTranslator.css';
import { Languages } from "lucide-react";



const GoogleTranslate = () => {
  const [isStylePickerOpen, setIsStylePickerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const Languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'it', name: 'Italian' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'he', name: 'Hebrew' },
    { code: 'id', name: 'Indonesian' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
    { code: 'fa', name: 'Persian' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ur', name: 'Urdu' },
    { code: 'pa', name: 'Punjabi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ro', name: 'Romanian' },
    { code: 'cs', name: 'Czech' },
    { code: 'el', name: 'Greek' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'bg', name: 'Bulgarian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'hr', name: 'Croatian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'lv', name: 'Latvian' },
    { code: 'et', name: 'Estonian' },
    { code: 'ms', name: 'Malay' },
    { code: 'sw', name: 'Swahili' },
    { code: 'tl', name: 'Filipino' },
    { code: 'my', name: 'Burmese' },
    { code: 'km', name: 'Khmer' },
    { code: 'lo', name: 'Lao' },
    { code: 'am', name: 'Amharic' },
    { code: 'zu', name: 'Zulu' },
    { code: 'xh', name: 'Xhosa' },
    { code: 'yo', name: 'Yoruba' },
    { code: 'ig', name: 'Igbo' }
  ];
  

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' },
          'google_translate_element'
        );
      };

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.id = 'google-translate-script';

      if (!document.getElementById('google-translate-script')) {
        document.body.appendChild(script);
      }
    }
  }, []);

  const changeLanguage = (langCode) => {
  const interval = setInterval(() => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
      googleSelect.value = langCode;
      googleSelect.dispatchEvent(new Event('change'));
      clearInterval(interval);
    }
  }, 500); // retry every 500ms

  setSelectedLanguage(langCode);
  setIsStylePickerOpen(false);
};

  

  return (
    
    <div className={`dt-style-picker-wrapper lang-selector ${isStylePickerOpen ? 'openss' : ''} notranslate`}>
      <div className="dt-style-picker">
        <span
          className="google-translate-icon"
          title={`Language: ${Languages.find((l) => l.code === selectedLanguage)?.name || 'English'}`}
          onClick={() => setIsStylePickerOpen(prev => !prev)}
        >
          <img src="./assets/translate.png" alt="translate "/>
        </span>
        

        {isStylePickerOpen && (
          <select
            className="custom-language-select"
            value={selectedLanguage}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="" disabled hidden>
              {selectedLanguage ? Languages.find((l) => l.code === selectedLanguage)?.name : 'Choose Language'}
            </option>
            {Languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        )}

        <div
          id="google_translate_element"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, opacity: 0 }}
        ></div>
      </div>
    </div>
  );
};

export default GoogleTranslate;
