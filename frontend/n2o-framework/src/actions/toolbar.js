import {
  CHANGE_BUTTON_COLOR,
  CHANGE_BUTTON_COUNT,
  CHANGE_BUTTON_DISABLED,
  CHANGE_BUTTON_TITLE,
  CHANGE_BUTTON_SIZE,
  CHANGE_BUTTON_VISIBILITY,
  CHANGE_BUTTON_HINT,
  CHANGE_BUTTON_CLASS,
  CHANGE_BUTTON_STYLE,
  REGISTER_BUTTON,
  CALL_ACTION_IMPL,
  TOGGLE_BUTTON_VISIBILITY,
  TOGGLE_BUTTON_DISABLED,
  CHANGE_BUTTON_ICON,
} from '../constants/toolbar';
import createActionHelper from './createActionHelper';

/**
 * Вызов функции эшкен импла
 * @param key
 * @param actionSrc
 * @param options
 */
export function callActionImpl(actionSrc, options) {
  return createActionHelper(CALL_ACTION_IMPL)({ actionSrc, options });
}

/**
 * Экшен смены видимости кнопки
 * @param key
 * @param visible
 */
export function changeButtonVisiblity(key, buttonId, visible) {
  return createActionHelper(CHANGE_BUTTON_VISIBILITY)({ key, buttonId, visible });
}

/**
 * Экшен показа кнопки
 * @param key
 */
export function setButtonVisible(key, buttonId) {
  return changeButtonVisiblity(key, buttonId, true);
}

/**
 * Экшен скрытия кнопки
 * @param key
 */
export function setButtonHidden(key, buttonId) {
  return changeButtonVisiblity(key, buttonId, false);
}

/**
 * Экшен изменения видимости кнопки на противоположенное
 * @param key
 */
export function toggleButtonVisiblity(key, buttonId) {
  return createActionHelper(TOGGLE_BUTTON_VISIBILITY)({ key, buttonId });
}

/**
 * Экшен изменения свойства блокировки
 * @param key
 * @param disabled
 */
export function changeButtonDisabled(key, buttonId, disabled) {
  return createActionHelper(CHANGE_BUTTON_DISABLED)({ key, buttonId, disabled });
}

/**
 * Экшен блокирования кнопки
 * @param key
 */
export function setButtonDisabled(key, buttonId) {
  return changeButtonDisabled(key, buttonId, true);
}

/**
 * Экшен разблокирования кнопки
 * @param key
 */
export function setButtonEnabled(key, buttonId) {
  return changeButtonDisabled(key, buttonId, false);
}

/**
 * Экшен изменнения свойства блокировки на противоположенное
 * @param key
 */
export function toggleButtonDisabled(key, buttonId) {
  return createActionHelper(TOGGLE_BUTTON_DISABLED)({ key, buttonId });
}

/**
 * Экшен изменения заголовка кнопки
 * @param key
 * @param title
 */
export function changeButtonTitle(key, buttonId, title) {
  return createActionHelper(CHANGE_BUTTON_TITLE)({ key, buttonId, title });
}

/**
 * Экшен изменения размера кнопки
 * @param key
 * @param size
 */
export function changeButtonSize(key, buttonId, size) {
  return createActionHelper(CHANGE_BUTTON_SIZE)({ key, buttonId, size });
}

/**
 * Экшен изменения цета кнопки
 * @param key
 * @param color
 */
export function changeButtonColor(key, buttonId, color) {
  return createActionHelper(CHANGE_BUTTON_COLOR)({ key, buttonId, color });
}

/**
 * Экшен изменения счетчика кнопки
 * @param key
 * @param count
 */
export function changeButtonCount(key, buttonId, count) {
  return createActionHelper(CHANGE_BUTTON_COUNT)({ key, buttonId, count });
}

/**
 * Экшен изменения подсказки кнопки
 * @param key
 * @param hint
 */
export function changeButtonHint(key, buttonId, hint) {
  return createActionHelper(CHANGE_BUTTON_HINT)({ key, buttonId, hint });
}

/**
 * Экшен изменения иконки кнопки
 * @param key
 * @param icon
 */
export function changeButtonIcon(key, buttonId, icon) {
  return createActionHelper(CHANGE_BUTTON_ICON)({ key, buttonId, icon });
}

/**
 * Экшен изменения объекта стиля кнопки
 * @param key
 * @param style
 */
export function changeButtonStyle(key, buttonId, style) {
  return createActionHelper(CHANGE_BUTTON_STYLE)({ key, buttonId, style });
}

/**
 * Экшен изменения css-класса кнопки
 * @param key
 * @param className
 */
export function changeButtonClass(key, buttonId, className) {
  return createActionHelper(CHANGE_BUTTON_CLASS)({ key, buttonId, className });
}

/**
 * Экшен регистрации кнопки в редаксе
 * @param key
 * @param buttonId
 * @param count
 * @param visible
 * @param disabled
 * @param conditions
 */
export function registerButton(
  key,
  buttonId,
  {
    id,
    size,
    title,
    count,
    icon,
    color,
    resolveEnabled,
    visible,
    parentId,
    disabled,
    hint,
    className,
    style,
    containerKey,
    conditions,
    hintPosition,
  }
) {
  return createActionHelper(REGISTER_BUTTON)({
    key,
    buttonId,
    count,
    visible,
    disabled,
    containerKey,
    conditions,
    resolveEnabled,
    hintPosition,
  });
}
