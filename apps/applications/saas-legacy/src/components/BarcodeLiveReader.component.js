// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import Quagga from 'quagga';

type Props = {
  classes: Object,
  onDetected: (data: any) => void,
  codeTypeList: Array<string>,
};

export class BarcodeReader extends React.Component<Props> {
  waiting: boolean = false;

  componentWillUnmount() {
    Quagga.stop();
  }

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
        Quagga.onDetected((data) => {
          if (!BarcodeReader.waiting) {
            if (data && data.codeResult && data.codeResult.code) {
              this.props.onDetected(data);
              BarcodeReader.waiting = true;
              setTimeout(() => {
                BarcodeReader.waiting = false;
              }, 3000);
            }
          }
        });
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
