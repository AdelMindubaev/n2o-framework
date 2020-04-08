import {
  insertModal,
  showOverlay,
  hideOverlay,
  destroyOverlay,
  closeOverlay,
  hidePrompt,
  showPrompt,
} from './overlays';
import {
  INSERT,
  DESTROY,
  HIDE,
  SHOW,
  CLOSE,
  SHOW_PROMPT,
  HIDE_PROMPT,
} from '../constants/overlays';

const name = 'MODAL_NAME';

describe('Тесты экшенов overlays', () => {
  describe('Проверка экшена insertModal', () => {
    it('Генирирует правильное событие', () => {
      const action = insertModal(
        name,
        true,
        'TITLE',
        'lg',
        true,
        'page_id',
        'TableWidget'
      );
      expect(action.type).toEqual(INSERT);
    });
    it('Возвращает правильный payload', () => {
      const action = insertModal(
        name,
        true,
        'drawer',
        'TITLE',
        'lg',
        true,
        'page_id',
        'TableWidget'
      );
      expect(action.payload).toMatchObject({
        0: 'TITLE',
        1: 'lg',
        2: true,
        3: 'page_id',
        4: 'TableWidget',
        mode: 'drawer',
        name: 'MODAL_NAME',
        visible: true,
      });
    });
  });

  describe('Проверка экшена showOverlay', () => {
    it('Генирирует правильное событие', () => {
      const action = showOverlay(name);
      expect(action.type).toEqual(SHOW);
    });
    it('Возвращает правильный payload', () => {
      const action = showOverlay(name);
      expect(action.payload.name).toEqual(name);
    });
  });

  describe('Проверка экшена hideOverlay', () => {
    it('Генирирует правильное событие', () => {
      const action = hideOverlay(name);
      expect(action.type).toEqual(HIDE);
    });
    it('Возвращает правильный payload', () => {
      const action = hideOverlay(name);
      expect(action.payload.name).toEqual(name);
    });
  });

  describe('Проверка экшена destroyOverlay', () => {
    it('Генирирует правильное событие', () => {
      const action = destroyOverlay();
      expect(action.type).toEqual(DESTROY);
    });
  });

  describe('Проверка экшена closeOverlay', () => {
    it('Генирирует правильное событие', () => {
      const action = closeOverlay('test', true);
      expect(action.type).toEqual(CLOSE);
    });
    it('Возвращает правильный payload', () => {
      const action = closeOverlay('test', true);
      expect(action.payload).toEqual({
        name: 'test',
        prompt: true,
      });
    });
  });

  describe('Проверка экшена showPrompt', () => {
    it('Генирирует правильное событие', () => {
      const action = showPrompt('test', true);
      expect(action.type).toEqual(SHOW_PROMPT);
    });
    it('Возвращает правильный payload', () => {
      const action = showPrompt('test');
      expect(action.payload).toEqual({
        name: 'test',
      });
    });
  });

  describe('Проверка экшена hidePrompt', () => {
    it('Генирирует правильное событие', () => {
      const action = hidePrompt('test', true);
      expect(action.type).toEqual(HIDE_PROMPT);
    });
    it('Возвращает правильный payload', () => {
      const action = hidePrompt('test');
      expect(action.payload).toEqual({
        name: 'test',
      });
    });
  });
});
