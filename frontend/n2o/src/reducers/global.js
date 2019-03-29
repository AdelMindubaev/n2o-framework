import { handleActions } from 'redux-actions';
import {
  CHANGE_LOCALE,
  REQUEST_CONFIG,
  REQUEST_CONFIG_SUCCESS,
  REQUEST_CONFIG_FAIL,
  CHANGE_ROOT_PAGE
} from '../constants/global';

const defaultState = {
  loading: true,
  error: null,
  locale: 'ru_RU',
  messages: {},
  menu: {},
  rootPageId: null
};

export default handleActions(
  {
    [CHANGE_LOCALE]: (state, action) => ({
      ...state,
      locale: action.payload.locale
    }),
    [REQUEST_CONFIG]: state => ({
      ...state,
      loading: true
    }),
    [REQUEST_CONFIG_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      ...action.payload.config
    }),
    [REQUEST_CONFIG_FAIL]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error
    }),
    [REQUEST_CONFIG_FAIL]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload.error
    }),
    [CHANGE_ROOT_PAGE]: (state, action) => ({
      ...state,
      rootPageId: action.payload.rootPageId
    })
  },
  defaultState
);
