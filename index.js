import PROJECT_ID from './.env';

const projectId = PROJECT_ID;

// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;
const fs = require('fs');

// Instantiates a client
const translate = new Translate({ projectId });

const languageCodes = [
  'ar',
  'ca',
  'cz',
  'da',
  'de',
  'en',
  'es',
  'fi',
  'fr',
  'is',
  'it',
  'ko',
  'lv',
  'nl',
  'no',
  'pl',
  'pt',
  'ro',
  'ru',
  'sv',
  'tr',
  'zh - Hans',
  'zh - Hant',
];

const mazeToGoogleMap = {
  ar: 'ar',
  ca: 'ca',
  cz: 'cs',
  da: 'da',
  de: 'de',
  en: 'en',
  es: 'es',
  fi: 'fi',
  fr: 'fr',
  is: 'is',
  it: 'it',
  ko: 'ko',
  lv: 'lv',
  nl: 'nl',
  no: 'no',
  pl: 'pl',
  pt: 'pt',
  ro: 'ro',
  ru: 'ru',
  sv: 'sv',
  tr: 'tr',
  'zh - Hans': 'zh-CN',
  'zh - Hant': 'zh-TW',
};

const getTranslation = async (phrase, languageCode) => {
  const [translation] = await translate.translate(phrase, languageCode);
  return translation;
};

const text = {
  largerScreen: {
    title: 'This page needs a larger screen',
    description:
      'It looks like your browser isn’t fully expanded or your screen isn’t large enough, please expand your browser or try a larger device',
  },
};

const writeToJSON = (objToWrite, fileName) => {
  try {
    const data = JSON.stringify(objToWrite, null, 4);
    fs.writeFileSync(`./${fileName}.json`, data, 'utf8');

    console.log(`File saved`);
  } catch (err) {
    console.log(`Error writing file: ${err}`);
  }
};

const performTranslations = async () => {
  const results = {};
  for (let i = 0; i < languageCodes.length; i++) {
    const mazeCode = languageCodes[i];
    const googleCode = mazeToGoogleMap[mazeCode];
    console.log({ mazeCode, googleCode });
    const translatedPhrase = { largerScreen: {} };
    try {
      translatedPhrase.largerScreen.title = await getTranslation(
        text.largerScreen.title,
        googleCode
      );
      translatedPhrase.largerScreen.description = await getTranslation(
        text.largerScreen.description,
        googleCode
      );
    } catch (error) {
      console.error('HERES DAT ERROR', error);
    }
    results[mazeCode] = translatedPhrase;
  }
  writeToJSON(results, 'translations');
};
performTranslations();
