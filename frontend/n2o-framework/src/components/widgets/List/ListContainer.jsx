import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { makeWidgetPageSelector } from '../../../selectors/widgets';
import map from 'lodash/map';
import forOwn from 'lodash/forOwn';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import find from 'lodash/find';
import widgetContainer from '../WidgetContainer';
import List from './List';
import withColumn from '../Table/withColumn';
import TableCell from '../Table/TableCell';
import { withWidgetHandlers } from '../AdvancedTable/AdvancedTableContainer';
import { withContainerLiveCycle } from '../Table/TableContainer';
import { createStructuredSelector } from 'reselect';
import { setTableSelectedId } from '../../../actions/widgets';

const ReduxCell = withColumn(TableCell);

/**
 * Контейнер виджета ListWidget
 * @reactProps {string} widgetId - id виджета
 * @reactProps {object} toolbar - конфиг тулбара
 * @reactProps {boolean} disabled - флаг активности
 * @reactProps {object} actions - объект экшенов
 * @reactProps {string} pageId - id страницы
 * @reactProps {object} paging - конфиг пагинации
 * @reactProps {string} className - класс
 * @reactProps {object} style - объект стилей
 * @reactProps {object} filter - конфиг фильтра
 * @reactProps {object} dataProvider - конфиг dataProvider
 * @reactProps {boolean} fetchOnInit - флаг запроса при инициализации
 * @reactProps {object} list - объект конфиг секций в виджете
 * @reactProps {object|null} rowClick - кастомный клик
 * @reactProps {boolean} hasMoreButton - флаг включения загрузки по нажатию на кнопку
 * @reactProps {number} maxHeight - максимальная высота виджета
 * @reactProps {boolean} fetchOnScroll - запрос при скролле
 * @reactProps {boolean} hasSelect - флаг выбора строк
 */
class ListContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      needToCombine: false,
      datasource: props.datasource,
    };

    this.getWidgetProps = this.getWidgetProps.bind(this);
    this.mapSectionComponents = this.mapSectionComponents.bind(this);
    this.renderCell = this.renderCell.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleFetchMore = this.handleFetchMore.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { datasource: prevDatasource } = prevProps;
    const { datasource: currentDatasource, onResolve, selectedId } = this.props;
    const { needToCombine } = this.state;
    if (currentDatasource && !isEqual(prevDatasource, currentDatasource)) {
      let newDatasource = [];
      if (needToCombine) {
        newDatasource = [...this.state.datasource, ...currentDatasource];
      } else {
        newDatasource = currentDatasource.slice();
      }

      this.setState(
        {
          needToCombine: false,
          datasource: newDatasource,
        },
        () => {
          const model = selectedId
            ? find(currentDatasource, item => item.id === selectedId)
            : currentDatasource[0];
          if (model) onResolve(model);
        }
      );
    }
  }

  renderCell(section) {
    if (!section) return;
    return (
      <ReduxCell
        {...section}
        widgetId={this.props.widgetId}
        positionFixed={false}
        modifiers={{}}
        className={cn('n2o-widget-list-cell', get(section, 'className', ''))}
      />
    );
  }

  handleItemClick(index) {
    const { onResolve, datasource, rowClick, onRowClickAction } = this.props;
    onResolve(datasource[index]);
    if (rowClick) {
      onRowClickAction();
    }
  }

  handleFetchMore() {
    const { page, datasource, onFetch } = this.props;
    if (!isEmpty(datasource)) {
      this.setState({ needToCombine: true }, () => onFetch({ page: page + 1 }));
    }
  }

  mapSectionComponents() {
    const { list } = this.props;
    const { datasource } = this.state;
    return map(datasource, item => {
      let mappedSection = {};
      forOwn(list, (v, k) => {
        mappedSection[k] = this.renderCell({
          ...list[k],
          id: v.id,
          model: item,
        });
      });
      return mappedSection;
    });
  }

  getWidgetProps() {
    const {
      hasMoreButton,
      rowClick,
      placeholder,
      maxHeight,
      fetchOnScroll,
      divider,
      hasSelect,
      selectedId,
      rows,
    } = this.props;

    return {
      onFetchMore: this.handleFetchMore,
      onItemClick: this.handleItemClick,
      data: this.mapSectionComponents(),
      rowClick,
      hasMoreButton,
      placeholder,
      maxHeight,
      fetchOnScroll,
      divider,
      hasSelect,
      selectedId,
      rows,
    };
  }
  render() {
    return <List {...this.getWidgetProps()} />;
  }
}

ListContainer.propTypes = {
  widgetId: PropTypes.string,
  toolbar: PropTypes.object,
  disabled: PropTypes.bool,
  actions: PropTypes.object,
  pageId: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  filter: PropTypes.object,
  dataProvider: PropTypes.object,
  fetchOnInit: PropTypes.bool,
  list: PropTypes.object,
  fetchOnScroll: PropTypes.bool,
  rowClick: PropTypes.func,
  hasMoreButton: PropTypes.bool,
  maxHeight: PropTypes.number,
  datasource: PropTypes.array,
  hasSelect: PropTypes.bool,
};

ListContainer.defaultProps = {
  datasource: [],
  rowClick: null,
  hasMoreButton: false,
  toolbar: {},
  disabled: false,
  actions: {},
  className: '',
  style: {},
  filter: {},
  list: {},
  fetchOnScroll: false,
  hasSelect: false,
};

const mapStateToProps = createStructuredSelector({
  page: (state, props) => makeWidgetPageSelector(props.widgetId)(state),
});

export default compose(
  widgetContainer(
    {
      mapProps: props => {
        return {
          ...props,
          onResolve: newModel => {
            props.onResolve(newModel);
            if (props.selectedId != newModel.id) {
              props.dispatch(setTableSelectedId(props.widgetId, newModel.id));
            }
          },
        };
      },
    },
    'ListWidget'
  ),
  withContainerLiveCycle,
  withWidgetHandlers,
  connect(mapStateToProps)
)(ListContainer);
