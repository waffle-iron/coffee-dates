import Button from '../Button';

import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { spy } from 'sinon';

describe('<Button />', () => {
  it('renders a single html button', () => {
    const button = shallow(<Button />);
    expect(button.find('button').length).toBe(1);
    expect(button.children().length).toBe(0);
  });

  it('contains text from text prop', () => {
    const button = shallow(<Button text="first thing's first" />);
    expect(button.text()).toEqual('first thing\'s first');
  });

  it('calls onClick prop on click', () => {
    function cb() { return null; }
    const cbSpy = spy(cb);
    const button = shallow(<Button onClick={cbSpy} />);
    button.simulate('click');
    expect(cbSpy.calledOnce).toBe(true);
  });
});
