/**
*
* Form
*
*/

import React, { PropTypes } from 'react';
import Field from './Field';
import Button from './Button';

// import 'styles from' './'styles.css'';

const valueSchemas = {
  login: {
    USERNAME: {
      text: '',
    },
    PASSWORD: {
      text: '',
      options: {
        password: true,
      },
    },
  },
  default: {
    WELCOME: {
      text: 'type something here...',
    },
  },
};

class Form extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf([
      'login',
      'default',
      'custom',
    ]),
    onChange: PropTypes.func,
    submitMsg: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    type: 'default',
    onChange: () => ({}),
    submitMsg: 'Submit',
    onSubmit: () => ({}),
  }

  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  state = {
    ...valueSchemas[this.props.type],
  }

  onSubmit() {
    this.props.onSubmit(this.state);
  }

  onEnter = (e) => {
    if (e.keyCode === 13) {
      // 13 is enter
      this.onSubmit();
    }
  }

  updateValue(key, value) {
    const newState = this.state;
    newState[key].text = value;
    this.setState(newState);
    this.props.onChange(newState);
  }

  render() {
    return (
      <div className={'styles.container'}>
        <div className={'styles.fields'}>
          {Object.keys(this.state)
            .map((key, index) => (
              <Field
                onEnter={this.onEnter}
                key={index}
                update={changedValue => this.updateValue(key, changedValue)}
                className={'styles.field'}
                label={key}
                value={this.state[key].text}
                password={this.state[key].options ? this.state[key].options.password : false}
              />
            )
          )}
        </div>
        <Button text={this.props.submitMsg} onClick={this.onSubmit} />
      </div>
    );
  }
}

export default Form;
