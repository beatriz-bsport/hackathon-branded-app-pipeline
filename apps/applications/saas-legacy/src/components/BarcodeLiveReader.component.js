// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import throttle from 'lodash/throttle';
import Quagga from 'quagga';

type Props = {
  classes: Object,
  onDetected: (data: any) => void,
  codeTypeList: Array<string>,
};

export class BarcodeReader extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.throttledOnDetected = throttle(
      (data) => {
        this.props.onDetected(data);
      },
      1000,
      { leading: true, trailing: false },
    );
  }

  componentWillUnmount() {
    this.throttledOnDetected.cancel();
    Quagga.offDetected(this.handleDetected);
    Quagga.stop();
  }

  handleDetected = (data) => {
    if (data && data.codeResult && data.codeResult.code) {
      this.throttledOnDetected(data);
    }
  };

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.querySelector('#camera'), // Or '#yourElement' (optional)
        },
        decoder: {
          readers: this.props.codeTypeList || ['code_128_reader'],
        },
      },
      () => {
        Quagga.start();
        Quagga.onDetected(this.handleDetected);
      },
    );
  }

  render() {
    return (
      <div className={this.props.classes.container}>
        <div id="camera" />
      </div>
    );
  }
}

const styles = () => ({
  container: {
    width: '100%',
  },
});

export default compose(withStyles(styles))(BarcodeReader);
