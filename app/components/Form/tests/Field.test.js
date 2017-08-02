import Field from '../Field';

import expect from 'expect';
import { shallow, mount } from 'enzyme';
import React from 'react';

import { spy } from 'sinon';

describe('<Field />', () => {
  it('renders empty <label> and an <input> by default', () => {
    const field = mount(<Field />);
    expect(field.find('label')).toExist();
    expect(field.find('input')).toExist();
    expect(field.find('label').text()).toBe('');
    expect(field.find('input').props().value).toBe('' || undefined);
  });

  it('renders the label prop', () => {
    const field = shallow(<Field label="A Label" />);
    expect(field.find('label').text()).toBe('A Label');
  });

  it('renders the value prop as input', () => {
    const field = shallow(<Field value="A value" />);
    expect(field.find('input').props().value).toBe('A value');
  });

  it('calls the update function with the added value as argument when the input changes', () => {
    function cb(val) { return val; }
    const cbSpy = spy(cb);
    const field = shallow(<Field update={cbSpy} />);
    const input = field.find('input');
    input.simulate('change', { target: { value: 'a' } });
    expect(cbSpy.callCount).toBe(1);
    expect(cbSpy.calledWith('a')).toBe(true);
  });
});
