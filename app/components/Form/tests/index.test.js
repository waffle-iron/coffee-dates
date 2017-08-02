import Form from '../index';
import Field from '../Field';
import Button from '../Button';

import expect from 'expect';
import { shallow, mount } from 'enzyme';
import React from 'react';

import { spy } from 'sinon';

describe('<Form />', () => {
  it('defaults to the \'default\' type with innocuous onChange function', () => {
    const form = mount(<Form />);
    expect(form.prop('type')).toBe('default');
    expect(form.prop('onChange')()).toEqual({});
  });

  it('default renders two nested divs and one Field', () => {
    const form = shallow(<Form />);
    const divs = form.find('div');
    expect(divs.length).toBe(2);
    // NB: 'find' must insert nested layers at front
    expect(divs.last().find('div').length).toBe(1);
    expect(divs.first().find(Field).length).toBe(1);
  });

  it('renders login form when specified in type prop, with default values', () => {
    const form = shallow(<Form type="login" />);
    const fields = form.find(Field);
    expect(fields.length).toBe(2);
    expect(fields.first().prop('label')).toBe('USERNAME');
    expect(fields.first().prop('value')).toBe('');
    expect(fields.last().prop('label')).toBe('PASSWORD');
    expect(fields.last().prop('value')).toBe('');
  });

  // TODO: assert that the onChange function is called properly

  it('calls onSubmit prop with form value on submit', () => {
    function cb(val) { return val; }
    const cbSpy = spy(cb);
    const form = shallow(<Form onSubmit={cbSpy} />);
    const submitButton = form.find(Button);
    submitButton.simulate('click');
    expect(cbSpy.calledOnce).toBe(true);
    expect(cbSpy.calledWithExactly(form.state()));
  });
});
