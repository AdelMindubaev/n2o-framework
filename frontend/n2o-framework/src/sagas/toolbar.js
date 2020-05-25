import { call, put, select } from '@redux-saga/core/effects';
import get from 'lodash/get';
import filter from 'lodash/filter';
import every from 'lodash/every';
import some from 'lodash/some';

import { resolveConditions } from './conditions';
import {
  changeButtonDisabled,
  changeButtonVisiblity,
  changeButtonMessage,
} from '../actions/toolbar';
import { getContainerButtons } from '../selectors/toolbar';

/**
 * Resolve buttons conditions
 * @param button
 * @return
 */
export function* resolveButton(button) {
  const state = yield select();

  if (button.conditions) {
    const { visible, enabled } = button.conditions;

    if (visible) {
      const nextVisible = resolveConditions(visible, state).resolve;
      yield put(
        changeButtonVisiblity(button.key, button.buttonId, nextVisible)
      );
      yield call(setParentVisibleIfAllChildChangeVisible, button);
    }

    if (enabled) {
      const nextEnable = resolveConditions(enabled, state).resolve;
      yield put(changeButtonDisabled(button.key, button.buttonId, !nextEnable));
    }
    if (!resolveConditions(enabled, state).resolve) {
      yield put(
        changeButtonMessage(
          button.key,
          button.buttonId,
          resolveConditions(enabled, state).message
        )
      );
    }
  }

  if (button.resolveEnabled) {
    const { modelLink, on } = button.resolveEnabled;
    const modelOnLink = get(state, modelLink, {});
    const nextEnabled = on.some(o => modelOnLink[o]);
    yield put(changeButtonDisabled(button.key, button.buttonId, !nextEnabled));
  }
}

/**
 * Функция для мониторинга изменения видимости родителя списка
 * @param key
 * @param id
 */
export function* setParentVisibleIfAllChildChangeVisible({ key, id }) {
  const buttons = yield select(getContainerButtons(key));
  const currentBtn = get(buttons, id);
  const parentId = get(currentBtn, 'parentId');

  if (parentId) {
    const currentBtnGroup = filter(buttons, ['parentId', parentId]);

    const isAllChildHidden = every(currentBtnGroup, ['visible', false]);
    const isAllChildVisible = some(currentBtnGroup, ['visible', true]);
    const isParentVisible = get(buttons, [parentId, 'visible'], false);

    if (isAllChildHidden && isParentVisible) {
      yield put(changeButtonVisiblity(key, parentId, false));
    }
    if (isAllChildVisible && !isParentVisible) {
      yield put(changeButtonVisiblity(key, parentId, true));
    }
  }
}

// export function* handleAction(action) {
//   const buttons = yield select(
//     getContainerButtons(action.payload.key || action.payload.widgetId)
//   );
//   yield all(values(buttons || []).map(v => call(resolveEntity, v)));
// }
