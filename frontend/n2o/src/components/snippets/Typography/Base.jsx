import React, {
  createElement,
  Fragment,
  createContext,
  Component,
} from 'react';
import { propTypes, defaultProps } from './propTypes';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { keys, pick, flowRight, values, pickBy } from 'lodash';
import { delay, wrapTags } from './utils';
import ContentEditable from './ContentEditable';

const PropsEnd = createContext();

const EndTag = () => (
  <PropsEnd.Consumer>
    {({ value, children }) => <Fragment>{value || children}</Fragment>}
  </PropsEnd.Consumer>
);

const MainTag = ({ tag, color, ...props }) =>
  createElement(tag, {
    className: color && `text-${color} disabled`,
    ...props,
  });

/**
 * Базовый компонент для наследования остальных компонентов
 * @reactProps {boolean} code - отображать в виде кода
 * @reactProps {boolean} mark - марк
 * @reactProps {boolean} strong - отображать в виде жирным
 * @reactProps {boolean} underline - нижнее подчеркивание
 * @reactProps {boolean} small - отображать маленьким
 * @reactProps {string} value - значение
 * @reactProps {node} children - внутреннее содержимое компонента
 * @reactProps {function} onChange - callback на изменение
 * @reactProps {string} color - цвет
 * @reactProps {string} editable - редактируемое поле
 * @reactProps {string} copyable - возможность копировать
 */
class Base extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      edit: false,
    };

    this.copyLinkClick = this.copyLinkClick.bind(this);
    this.editLinkClick = this.editLinkClick.bind(this);
    this.editableTagOnBlur = this.editableTagOnBlur.bind(this);
    this.handleContentEditable = this.handleContentEditable.bind(this);
  }

  async copyLinkClick(e) {
    e.preventDefault();
    this.setState({ copied: true });
    await delay(3000);
    this.setState({ copied: false });
  }

  editLinkClick(e) {
    e.preventDefault();
    this.setState({ edit: true });
  }

  editableTagOnBlur() {
    this.setState({ edit: false });
  }

  handleContentEditable(e) {
    const { onChange } = this.props;
    onChange(e.currentTarget.textContent);
  }

  render() {
    const {
      tag,
      value,
      children,
      color,
      copyable,
      editable,
      ...rest
    } = this.props;

    const { copied, edit } = this.state;

    const wrapperObj = pick(wrapTags, keys(pickBy(rest)));

    const wrapperFns = values(wrapperObj);
    const Wrappers = flowRight(wrapperFns)(EndTag);

    const copyIcon = !copied ? 'fa fa-files-o' : 'fa fa-check';

    const copiableFragment = (
      <Fragment>
        <CopyToClipboard text={value}>
          <a href="#" className="pl-2" onClick={this.copyLinkClick}>
            <i className={copyIcon} />
          </a>
        </CopyToClipboard>
      </Fragment>
    );

    const editableFragment = edit ? null : (
      <Fragment>
        <a href="#" className="pl-2" onClick={this.editLinkClick}>
          <i className="fa fa-pencil" />
        </a>
      </Fragment>
    );

    return (
      <MainTag tag={tag} onBlur={this.editableTagOnBlur} color={color}>
        <ContentEditable editable={edit} onChange={this.handleContentEditable}>
          <PropsEnd.Provider value={{ value, children }}>
            <Wrappers />
          </PropsEnd.Provider>
        </ContentEditable>
        {copyable && copiableFragment}
        {editable && editableFragment}
      </MainTag>
    );
  }
}

Base.propTypes = propTypes;

Base.defaultProps = defaultProps;

export default Base;
