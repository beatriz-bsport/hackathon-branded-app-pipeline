import React, { Component } from 'react';
import SimpleDayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

type Props = {
  handleDayClick: () => void,
};

export default class DayPicker extends Component<Props> {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selectedDays: null,
    };
  }

  componentWillMount() {
    const today = new Date();
    this.setState({ selectedDays: today });
    this.props.handleDayClick(today);
  }

  static defaultProps = {
    handleDayClick: () => {},
  };

  handleClick(day, { selected }) {
    const selectedDays = selected ? undefined : day;
    this.setState({
      selectedDays,
    });
    this.props.handleDayClick(selectedDays);
  }

  render() {
    return (
      <SimpleDayPicker
        {...this.props}
        selectedDays={this.state.selectedDays}
        onDayClick={this.handleClick}
      />
    );
  }
}
