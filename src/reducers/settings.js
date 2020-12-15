import {
  SET_CURRENCY,
  SET_LANGUAGE,
  GET_CURRENCIES,
  GET_LANGUAGES,
  RESTORE_STATE,
} from '../constants';

const initialState = {
  selectedCurrency: {
    symbol: '',
    currencyCode: '',
  },
  selectedLanguage: {
    langCode: '',
    name: '',
  },
  languages: null,
  currencies: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENCY:
      const newSelectedCurrency = {
        currencyCode: action.payload.currencyCode,
        symbol: action.payload.symbol,
      };
      return {
        ...state,
        selectedCurrency: newSelectedCurrency,
      };

    case GET_CURRENCIES:
      return {
        ...state,
        currencies: action.payload.map((el) => {
          return {
            selected: el.currency_code === state.selectedCurrency.currencyCode,
            currencyCode: el.currency_code,
            symbol: el.symbol,
          };
        }),
      };

    case SET_LANGUAGE:
      const newSelectedLanguage = {
        langCode: action.payload.langCode,
        name: action.payload.name,
      };
      return {
        ...state,
        selectedLanguage: newSelectedLanguage,
      };

    case GET_LANGUAGES:
      return {
        ...state,
        languages: action.payload.map((el) => {
          return {
            selected: el.lang_code === state.selectedLanguage.langCode,
            langCode: el.lang_code,
            name: el.name,
          };
        }),
      };

    case RESTORE_STATE:
      return {
        ...state,
        ...action.payload.settings,
      };

    default:
      return state;
  }
}
