/**
 * Created by emamoshin on 25.09.2017.
 */
// Глобал enzyme
import Enzyme, { shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';

registerRequireContextHook();

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global._n2oEvalContext = {};

console.error = message => {
  // throw new Error(message);
};
