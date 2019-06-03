import React from 'react';
import PropTypes from 'prop-types';
import { pickBy, throttle, debounce } from 'lodash';
import { connect } from 'react-redux';
import { makeAlertsByKeySelector } from '../../selectors/alerts';

/**
 * HOC для контейнеров {@Link InputSelectContainer} и {@Link N2OSelectContainer}
 * @param WrappedComponent - оборачиваемый компонент
 */

function withListContainer(WrappedComponent) {
  /**
   * Класс для хока
   * @reactProps {boolean} loading - флаг анимации загрузки
   * @reactProps {array} options - данные
   * @reactProps {string} labelFieldId - поле для для названия
   * @reactProps {function} onInput - callback при вводе в инпут
   * @reactProps {function} onScrollEnd - callback при прокрутке скролла popup
   * @reactProps {function} onOpen - callback на открытие попапа
   * @reactProps {string} queryId - queryId
   * @reactProps {number} size - size
   * @reactProps {function} fetchData - callback на загрузку данных
   * @reactProps {array} options - данные с сервера
   */

  const WithListContainer = ({
    _fetchData,
    dataProvider,
    onOpen,
    onInput,
    count,
    size,
    page,
    data,
    onScrollEnd,
    loading,
    labelFieldId,
    ...rest
  }) => {
    /**
     * Совершает вызов апи с параметрами
     * @param optionalParams {object} - дополнительные параметра запроса
     * @param concat {boolean} - флаг добавления новых данных к текущим
     */
    const callApiWithParams = (optionalParams = {}, concat = false) => {
      const params = {
        size,
        page,
        [`sorting.${labelFieldId}`]: 'ASC',
        ...optionalParams,
      };
      _fetchData(params, concat);
    };

    /**
     * Обрабатывает открытие попапа
     * @private
     */

    const handleOpen = () => {
      callApiWithParams({ page: 1 });
      onOpen && onOpen();
    };

    /**
     * Обрабатывает серверный поиск
     * @param value - Значение для поиска
     * @param delay - Задержка при вводе
     * @private
     */

    const handleSearch = debounce(value => {
      const quickSearchParam =
        (dataProvider && dataProvider.quickSearchParam) || 'search';

      callApiWithParams({ [quickSearchParam]: value, page: 1 });
    }, 300);

    const handleItemOpen = value => {
      callApiWithParams({ 'filter.parent_id': value }, true);
    };

    /**
     * Обрабатывает изменение инпута
     * @param value {string|number} - новое значение
     * @private
     */

    const handleInputChange = value => {
      onInput && onInput(value);
    };

    /**
     * Обрабатывает конец скролла
     * @private
     */

    const handleScrollEnd = throttle((filter = {}) => {
      if (page && size && count) {
        if (page * size < count) {
          callApiWithParams({ page: page + 1, ...filter }, true);
        }
      }

      onScrollEnd && onScrollEnd();
    }, 400);

    /**
     * Рендер
     */

    return (
      <WrappedComponent
        {...rest}
        labelFieldId={labelFieldId}
        data={data}
        isLoading={loading}
        onInput={handleInputChange}
        onScrollEnd={handleScrollEnd}
        onOpen={handleOpen}
        onSearch={handleSearch}
        handleItemOpen={handleItemOpen}
        _fetchData={_fetchData}
      />
    );
  };

  WithListContainer.propTypes = {
    loading: PropTypes.bool,
    queryId: PropTypes.string,
    size: PropTypes.number,
    labelFieldId: PropTypes.string,
    fetchData: PropTypes.func,
    options: PropTypes.array,
    onOpen: PropTypes.func,
    onInput: PropTypes.func,
    onScrollEnd: PropTypes.func,
    quickSearchParam: PropTypes.string,
  };

  WithListContainer.defaultProps = {
    data: [],
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(WithListContainer);
}

const mapStateToProps = (state, ownProps) => ({
  alerts: makeAlertsByKeySelector(ownProps.form + '.' + ownProps.labelFieldId)(
    state
  ),
});

const mapDispatchToProps = dispatch => ({
  onDismiss: alertId => {
    // dispatch(removeAlert(ownProps.form + '.' + ownProps.labelFieldId, alertId));
  },
});

export default withListContainer;
