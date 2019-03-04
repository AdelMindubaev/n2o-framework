import PropTypes from 'prop-types';

export const defaultProps = {
  disabled: false,
  loading: false,
  parentFieldId: 'parentId',
  valueFieldId: 'id',
  labelFieldId: 'label',
  iconFieldId: 'icon',
  imageFieldId: 'image',
  badgeFieldId: 'badge',
  badgeColorFieldId: 'color',
  hasCheckboxes: false,
  datasource: [],
  parentIcon: '',
  childIcon: '',
  draggable: true,
  multiselect: true,
  prefixCls: 'n2o-rc-tree',
  icon: '',
  selectable: true,
  showLine: false,
  filter: '',
  expandBtn: false,
  onResolve: () => {}
};

export const propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  parentFieldId: PropTypes.string,
  valueFieldId: PropTypes.string,
  labelFieldId: PropTypes.string,
  iconFieldId: PropTypes.string,
  imageFieldId: PropTypes.string,
  badgeFieldId: PropTypes.string,
  badgeColorFieldId: PropTypes.string,
  hasCheckboxes: PropTypes.bool,
  datasource: PropTypes.array,
  parentIcon: PropTypes.string,
  childIcon: PropTypes.string,
  prefixCls: PropTypes.string,
  draggable: PropTypes.bool,
  multiselect: PropTypes.bool,
  icon: PropTypes.string,
  selectable: PropTypes.bool,
  showLine: PropTypes.bool,
  filter: PropTypes.string,
  expandBtn: PropTypes.bool,
  onResolve: PropTypes.func
};

export const TREE_PROPS = [
  'loading',
  'disabled',
  'draggable',
  'selectable',
  'showLine',
  'prefixCls'
];

export const TREE_NODE_PROPS = [
  'labelFieldId',
  'iconFieldId',
  'imageFieldId',
  'badgeFieldId',
  'badgeColorFieldId',
  'childIcon',
  'parentIcon',
  'valueFieldId',
  'parentFieldId',
  'prefixCls'
];
