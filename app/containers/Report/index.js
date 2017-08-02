import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
// import 'styles from' './'styles.css'';
import defaultQs from './qs';
import { RADIO, SHORT_ANSWER, LONG_ANSWER } from './enum';
import pageIsValid from './pageIsValid';

import Radio from './components/Radio';
import ShortAnswer from './components/ShortAnswer';
import LongAnswer from './components/LongAnswer';
import Button from 'components/Button';

import { answerField, pushReportRequest } from './reducer';
import { push } from 'react-router-redux';

export class Report extends React.Component {
  static propTypes = {
    qs: PropTypes.array, // shape of ./qs
    dispatch: PropTypes.func.isRequired,
    report: PropTypes.object.isRequired,
    rushee: PropTypes.object,
  };
  static defaultProps = {
    qs: defaultQs,
  };
  state = {
    pageNo: 0,
    buttonText: 'Next',
  }

  componentWillMount() {
    if (!this.props.rushee) {
      this.props.dispatch(push('/rush'));
    }
  }

  onCompleteHandler = (report) => {
    this.props.dispatch(pushReportRequest(report));
  }

  onCancel = () => {
    const { pageNo } = this.state;
    Object.keys(this.props.report[pageNo]).forEach(brief => {
      this.props.dispatch(answerField(pageNo, brief, null));
    });
    this.props.dispatch(push('/rush'));
  }

  onButtonClick = () => {
    const maxPageNo = this.props.qs.length - 1;
    if (this.state.pageNo === maxPageNo) {
      this.onCompleteHandler(this.props.report);
      return;
    } else if (this.state.pageNo === (maxPageNo - 1)) {
      this.setState({
        buttonText: 'Submit',
      });
    }
    this.setState({
      pageNo: this.state.pageNo + 1,
    });
  }

  onChange = (brief, value) => {
    this.props.dispatch(answerField(this.state.pageNo, brief, value));
  }

  render() {
    const page = this.props.qs[this.state.pageNo];
    return (
      <div className={'styles.page'}>
        <Helmet
          title="Rush Report"
          meta={[
            { name: 'description', content: 'Rush report' },
          ]}
        />
        <div className={'styles.container'}>
          <h1 className={'styles.header'}>{page.title}</h1>
          {page.fields && page.fields.map((field, key) => {
            let component;
            switch (field.type) {
              case RADIO:
                component = (
                  <Radio
                    key={key}
                    id={key}
                    onChange={this.onChange}
                    {...field}
                  />
                );
                break;
              case SHORT_ANSWER:
                component = (
                  <ShortAnswer
                    key={key}
                    id={key}
                    onChange={this.onChange}
                    {...field}
                  />
                );
                break;
              case LONG_ANSWER:
                component = (
                  <LongAnswer
                    key={key}
                    id={key}
                    onChange={this.onChange}
                    {...field}
                  />
                );
                break;
              default:
                component = null;
            }
            return component;
          })}
          <div className={'styles.buttonCont'}>
            <Button
              className={'styles.grayButton'}
              text="Cancel"
              onClick={this.onCancel}
            />
            <Button
              text={this.state.buttonText}
              onClick={this.onButtonClick}
              active={pageIsValid(this.state.pageNo, page, this.props.report)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  const report = state.get('report').toJS();
  return {
    report: report.pages,
    rushee: report.rushee,
    fetching: report.fetching,
    error: report.error,
  };
})(Report);
