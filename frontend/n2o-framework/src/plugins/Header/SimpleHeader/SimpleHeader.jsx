import React from 'react';

import isEmpty from 'lodash/isEmpty';

import PropTypes from 'prop-types';
import Navbar from 'reactstrap/lib/Navbar';
import Nav from 'reactstrap/lib/Nav';
import NavItem from 'reactstrap/lib/NavItem';
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import Input from 'reactstrap/lib/Input';
import map from 'lodash/map';
import NavbarBrand from 'reactstrap/lib/NavbarBrand';
import NavbarToggler from 'reactstrap/lib/NavbarToggler';
import Collapse from 'reactstrap/lib/Collapse';

import NavbarBrandContent from './NavbarBrandContent';
import NavItemContainer from './NavItemContainer';
import SearchBarContainer from '../../../components/snippets/SearchBar/SearchBarContainer';

/**
 * Хедер-плагин
 * @param {Object} props - пропсы
 * @param {string|element} props.brand - брэнд
 * @param {string|element} props.brandImage - изображение брэнда
 * @param {array} props.items - элементы навбар-меню (левое меню)
 * @param {boolean} props.fixed - фиксированный хэдер или нет
 * @param {array} props.extraItems - элементы навбар-меню (правое меню)
 * @param {boolean} props.collapsed - находится в состоянии коллапса или нет
 * @param {boolean} props.search - есть поле поиска / нет поля поиска
 * @param {boolean} props.color - стиль хэдера (default или inverse)
 * @param {boolean} props.className - css-класс
 * @param {boolean} props.style - объект стиля
 * @example
 * //каждый item состоит из id {string}, label {string}, type {string} ('text', 'type' или 'dropdown'),
 * //href {string}(для ссылок), linkType {string}(для ссылок; значения - 'outer' или 'inner')
 * //badge {string} (текст баджа), badgeColor {string} (цвет баджа), target {string} ('_blank' или null)
 * //subItems {array} (массив из элементов дропдауна)
 *<SimpleHeader  items = { [
 *     {
 *       id: 'link',
 *       label: 'link',
 *       href: '/test',
 *       type: 'link',
 *       target: '_blank',
 *     },
 *     {
 *       id: 'dropdown',
 *       label: 'dropdown',
 *       type: 'dropdown',
 *       subItems: [{id: 'test1',label: 'test1', href: '/', badge: 'badge1', badgeColor: 'color1'},
 *       {id: 'test123', label: 'test1', href: '/',  badge: 'badge2', badgeColor: 'color2'}]
 *     },
 *     {
 *       id: 'test',
 *       label: 'test',
 *       type: 'dropdown',
 *       subItems: [{id: 'test123s',label: 'test1', href: '/', badge: 'badge1', badgeColor: 'color1'},
 *       {id: 'test12asd3',label: 'test1', href: '/',  badge: 'badge2', badgeColor: 'color2'}]
 *     }
 *     ] }
 *     extraItems = { [
 *     {
 *       id: "213",
 *       label: 'ГКБ №7',
 *       type: 'text',
 *     },
 *     {
 *       id: "2131",
 *       label: 'Постовая медсестра',
 *       type: 'dropdown',
 *       subItems: [{label: 'test1', href: '/', linkType: 'inner'}, {label: 'test1', href: '/'}]
 *     },
 *     {
 *       id: "2131",
 *       label: 'admin',
 *       type: 'dropdown',
 *       subItems: [{label: 'test1', href: '/'}, {label: 'test1', href: '/'}]
 *     }
 *     ] }
 *    brand="N2O"
 *    brandImage= "http://getbootstrap.com/assets/brand/bootstrap-solid.svg"
 *    activeId={"test123"}/>
 *
 */

class SimpleHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    const {
      color,
      fixed,
      items,
      activeId,
      extraItems,
      brandImage,
      brand,
      style,
      className,
      search,
      homePageUrl,
    } = this.props;

    const isInversed = color === 'inverse';
    const navColor = isInversed ? 'primary' : 'light';
    const mapItems = (items, options) =>
      map(items, (item, i) => (
        <NavItemContainer
          key={i}
          item={item}
          activeId={activeId}
          options={options}
        />
      ));

    const navItems = mapItems(items);
    const extraNavItems = mapItems(extraItems, { right: true });

    return (
      <div
        style={style}
        className={`navbar-container-${
          fixed ? 'fixed' : 'relative'
        } ${className} n2o-header n2o-header-${color} `}
      >
        <Navbar
          color={navColor}
          light={!isInversed}
          dark={isInversed}
          expand="md"
        >
          {brandImage && (
            <NavbarBrand className="n2o-brand" href={homePageUrl}>
              <NavbarBrandContent brandImage={brandImage} />
            </NavbarBrand>
          )}
          {brand && (
            <a href={homePageUrl} className="navbar-brand">
              {brand}
            </a>
          )}
          {!isEmpty(items) && <NavbarToggler onClick={this.toggle} />}
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="main-nav" navbar>
              {navItems}
            </Nav>
            <Nav className="ml-auto main-nav-extra" navbar>
              {extraNavItems}
              {search && <SearchBarContainer />}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

SimpleHeader.propTypes = {
  /**
   * ID активного элемента
   */
  activeId: PropTypes.string,
  /**
   * Бренд хедера
   */
  brand: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * Картинка бренда
   */
  brandImage: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /**
   * Элементы хедера
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      linkType: PropTypes.oneOf(['inner', 'outer']),
      type: PropTypes.oneOf(['dropdown', 'link', 'text']).isRequired,
      subItems: PropTypes.array,
      badge: PropTypes.string,
      badgeColor: PropTypes.string,
      target: PropTypes.string,
    })
  ),
  /**
   * Extra элементы хедера
   */
  extraItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      linkType: PropTypes.oneOf(['inner', 'outer']),
      type: PropTypes.oneOf(['dropdown', 'link', 'text']).isRequired,
      subItems: PropTypes.array,
      badge: 'badge',
      badgeColor: 'color',
      target: PropTypes.string,
    })
  ),
  /**
   * Строка поиска
   */
  search: PropTypes.bool,
  /**
   * Адрес ссылка бренда
   */
  homePageUrl: PropTypes.string,
  /**
   * Цвет хедера
   */
  color: PropTypes.oneOf(['inverse', 'default']),
  /**
   * Флаг фиксированного хедера
   */
  fixed: PropTypes.bool,
  /**
   * Флаг сжатости хедера
   */
  collapsed: PropTypes.bool,
  /**
   * Класс
   */
  className: PropTypes.string,
  /**
   * Стили
   */
  style: PropTypes.object,
};

SimpleHeader.defaultProps = {
  color: 'default',
  fixed: true,
  homePageUrl: '/',
  collapsed: true,
  className: '',
  items: [],
  extraItems: [],
  search: false,
  style: {},
  list: [],
};

export default SimpleHeader;
