import {
  call,
  all,
  take,
  fork,
  takeEvery,
  cancelled,
} from 'redux-saga/effects';
import map from 'lodash/map';
import every from 'lodash/every';
import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import set from 'lodash/set';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';

import evalExpression from '../utils/evalExpression';
import { SET } from '../constants/models';
import { REGISTER_BUTTON } from '../constants/toolbar';
import { REGISTER_COLUMN } from '../constants/columns';
import { resolveButton } from './toolbar';
import { resolveColumn } from './column';

/**
 * Обработчики вызова зависимостей
 */
const ConditionHandlers = {
  [REGISTER_BUTTON]: resolveButton,
  [REGISTER_COLUMN]: resolveColumn,
};

/**
 * резолв кондишена
 * @param conditions
 * @param model
 * @returns {boolean}
 */
export const resolveConditions = (conditions = [], model) =>
  every(conditions, ({ expression, modelLink }) =>
    evalExpression(expression, get(model, modelLink, {}))
  );

/**
 * резолв всех условий
 * @param entities
 * @param action
 */
export function* watchModel(entities, { payload }) {
  const { prefix, key } = payload;
  const groupTypes = keys(entities);
  const modelLink = `models.${prefix}['${key}']`;

  for (let i = 0; i < groupTypes.length; i++) {
    const type = groupTypes[i];
    const entity = get(entities, [type, modelLink], null);

    if (entity) {
      yield all(map(entity, entity => fork(ConditionHandlers[type], entity)));
    }
  }
}

/**
 * Наблюдение за регистрацией сущностей и SET'ом моделей
 * @return
 */
function* watchRegister() {
  try {
    let entities = {};

    while (true) {
      const { type, payload: payloadRegister } = yield take([
        REGISTER_BUTTON,
        REGISTER_COLUMN,
      ]);
      const { conditions } = payloadRegister;

      if (conditions && !isEmpty(conditions)) {
        entities = yield call(prepareEntity, entities, payloadRegister, type);

        yield fork(ConditionHandlers[type], payloadRegister);
        // todo: Перейти на redux-saga@1.0.0 и использовать takeLeading
        yield takeEvery(SET, watchModel, entities);
      }
    }
  } finally {
    if (yield cancelled()) {
      // todo: добавить cancel саги, когда кнопка unregister
    }
  }
}

/**
 * Группировка сущностей по их register_type, которые в свою очередь группируются по modelLink
 * @param entities
 * @param payload
 * @param type
 * @return {any}
 */
export function prepareEntity(entities, payload, type) {
  const { conditions } = payload;
  let newEntities = Object.assign({}, entities);
  let modelsLinkBuffer = [];

  forOwn(conditions, condition =>
    map(condition, ({ modelLink }) => {
      if (!modelsLinkBuffer.includes(modelLink)) {
        const modelLinkArray = get(entities, [type, modelLink], null)
          ? [...get(entities, [type, modelLink], {}), { ...payload }]
          : [{ ...payload }];

        set(newEntities, [type, modelLink], modelLinkArray);
        modelsLinkBuffer.push(modelLink);
      }
    })
  );

  return newEntities;
}

export const conditionsSaga = [fork(watchRegister)];
