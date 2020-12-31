// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RefreshIcon from '@material-ui/icons/Refresh';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import type { ReactRefT } from '../../../types';
import { findMemberFromFace as findMemberFromFaceAPI } from '../api';

type Props = {
  processing: boolean,
  setProcessing: (boolean) => void,
  classes: any,
  t: TFunction,
  onDetectMember: (?Member, ?string, ?() => void) => void,
};

type State = {
  previousResult: ?any,
  isPaused: boolean,
  isReady: boolean,
  imageDataWithoutMember: ?string,
  countdownRestart: number,
};

faceapi.env.monkeyPatch({
  Canvas: window.HTMLCanvasElement,
  Image: window.HTMLImageElement,
  ImageData: canvas.ImageData,
  createCanvasElement: () => document.createElement('canvas'),
  createImageElement: () => document.createElement('img'),
});

export class FaceRecognition extends React.Component<Props, State> {
  interval: ?IntervalID;

  countdownRestartInterval: ?IntervalID;

  canvas: ReactRefT<HTMLCanvasElement>;

  stream: ReactRefT<HTMLVideoElement>;

  capture: ReactRefT<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      previousResult: null,
      isPaused: false,
      isReady: false,
      imageDataWithoutMember: null,
      countdownRestart: 0,
    };
    this.stream = React.createRef();
    this.canvas = React.createRef();
    this.capture = React.createRef();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!prevState.isPaused && this.state.isPaused) {
      this.pauseStream();
    }
    if (prevState.isPaused && !this.state.isPaused) {
      this.playStream();
    }
    if (
      prevState.previousResult &&
      this.state.previousResult &&
      !this.state.isPaused
    ) {
      this.captureImage(this.state.previousResult);
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.countdownRestartInterval) {
      clearInterval(this.countdownRestartInterval);
    }
  }

  async componentDidMount() {
    try {
      // await faceapi.nets.tinyFaceDetector.loadFromUri(
      //       'https://bsport-models.s3.eu-west-3.amazonaws.com/',
      //     );
      //
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      this.setState({ isReady: true });
    } catch (err) {
      console.error(err);
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    this.stream.current.srcObject = stream;
  }

  restartAnalyze = (now: boolean = false) => {
    if (this.countdownRestartInterval) return;
    if (now === true) {
      this.setState({
        imageDataWithoutMember: null,
        previousResult: null,
        isPaused: false,
      });
      return;
    }
    this.setState({ countdownRestart: 4 }, () => {
      this.countdownRestartInterval = setInterval(() => {
        if (this.state.countdownRestart > 0) {
          this.setState((prevState) => ({
            countdownRestart: prevState.countdownRestart - 1,
          }));
        } else {
          this.setState({
            imageDataWithoutMember: null,
            previousResult: null,
            isPaused: false,
          });
          clearInterval(this.countdownRestartInterval);
        }
      }, 1000);
    });
  };

  pauseStream = () => {
    this.stream.current.pause();
  };

  playStream = () => {
    this.stream.current.play();
  };

  onPlay = async () => {
    this.interval = setInterval(this.setAnalyzeInterval, 500);
  };

  setAnalyzeInterval = async () => {
    // eslint-disable-next-line
    console.log('loop');

    if (
      !this.state.isReady ||
      this.state.isPaused ||
      (!!this.stream.current && this.stream.current.paused) ||
      (!!this.stream.current && this.stream.current.ended)
    ) {
      // eslint-disable-next-line
      console.log('model not ready or video Failed, reloading in 2s...');
      return;
    }

    const result = await faceapi.detectSingleFace(
      this.stream.current,
      new faceapi.TinyFaceDetectorOptions(),
    );

    if (result && this.interval) {
      // faceapi.draw.drawDetections(
      //       this.canvas.current,
      // faceapi.resizeResults(result, dims),
      // );
      if (result.score > 0.7) {
        this.setState({ previousResult: result });
      }
    }
  };

  captureImage = () => {
    this.props.setProcessing(true);
    const ctx = this.capture.current.getContext('2d');
    this.setState({ isPaused: true });

    ctx.drawImage(
      this.stream.current,
      0,
      0,
      this.capture.current.width,
      this.capture.current.height,
    );

    const imageData = this.capture.current.toDataURL('image/png');
    this.uploadSnapshot(imageData);
  };

  onUndetect = (dataURI: string) => {
    this.props.setProcessing(false);
    this.setState({ imageDataWithoutMember: dataURI });
  };

  onDetectMember = (member: ?Member) => {
    this.props.setProcessing(false);
    this.props.onDetectMember(member, null, this.restartAnalyze);
  };

  createAccount = () => {
    const imageDataURI = this.state.imageDataWithoutMember;
    this.props.onDetectMember(null, imageDataURI, () =>
      this.restartAnalyze(true),
    );
  };

  uploadSnapshot = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const buffer = new ArrayBuffer(byteString.length);
    const data = new DataView(buffer);

    // eslint-disable-next-line
    for (let i = 0; i < byteString.length; i++) {
      data.setUint8(i, byteString.charCodeAt(i));
    }

    const imageBlob = new Blob([buffer], { type: mimeString });
    findMemberFromFaceAPI(imageBlob)
      .then((r) => this.onDetectMember(r.data))
      .catch((err) => {
        console.error(err);
        this.onUndetect(dataURI);
      });
  };

  render() {
    const { classes, t } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <video
            onLoadedMetadata={this.onPlay}
            id="inputVideo"
            autoPlay
            muted
            playsinline
            ref={this.stream}
            style={{
              position: 'absolute',
              width: 500,
              left: 0,
              right: 0,
              height: 500,
            }}
          />

          <canvas
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              width: 500,
              height: 500,
            }}
            id="myCanvas"
            ref={this.canvas}
          />
          <canvas
            ref={this.capture}
            style={{ visibility: 'hidden', width: 500, height: 500 }}
          />
          {this.props.processing && (
            <div className={classes.loadingContainer}>
              <CircularProgress />
            </div>
          )}
          {!!this.state.countdownRestart && (
            <div className={classes.loadingContainer}>
              <Typography variant="h1" component="p" style={{ color: 'white' }}>
                {this.state.countdownRestart}
              </Typography>
            </div>
          )}
          {!!this.state.imageDataWithoutMember && (
            <div className={classes.memberNotFoundContainer}>
              <Typography variant="h4">
                {t('offerDetail.noDetectionResult')}
              </Typography>
              <div className={classes.buttonRow}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.restartAnalyze(true)}
                >
                  <RefreshIcon className={classes.leftIcon} />
                  {t('offerDetail.actions.restartAnalyze')}
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={this.createAccount}
                >
                  <PersonAddIcon className={classes.leftIcon} />
                  {t('offerDetail.actions.createAccount')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    minHeight: 500,
    minWidth: 500,
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    minHeight: 500,
    minWidth: 500,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    zIndex: 9999,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberNotFoundContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonRow: {
    display: 'flex',
    marginTop: theme.spacing(2),
    flexDirection: 'column',
    '&>*': {
      margin: theme.spacing(1),
    },
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['selfCheckIn']),
  withStyles(styles),
  withState('processing', 'setProcessing', false),
)(FaceRecognition);
