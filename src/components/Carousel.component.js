// @flow
import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CardMedia from '@material-ui/core/CardMedia';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

type Props = {
  classes: Object,
  images: Object,
};
type State = {
  checked: number,
  direction: string,
};

class Carousel extends Component<Props, State> {
  state = {
    checked: 0,
    direction: 'left',
  };

  handleBackButton = (totalImages) => {
    this.setState((state) => ({
      checked: (state.checked > 0 ? state.checked : totalImages) - 1,
      direction: 'right',
    }));
  };

  handleForwardButton = (totalImages) => {
    this.setState((state) => ({
      checked: (state.checked + 1) % totalImages,
      direction: 'left',
    }));
  };

  renderImages(slides) {
    return slides.map((slide, index) => {
      if (this.state.checked === index) {
        return (
          <Slide in direction={this.state.direction} mountOnEnter unmountOnExit>
            <CardMedia
              className={this.props.classes.media}
              image={slide}
              title="Activity"
            />
          </Slide>
        );
      }
      return (
        <Slide
          in={false}
          direction={this.state.direction}
          mountOnEnter
          unmountOnExit
        >
          <CardMedia
            className={`${this.props.classes.media} ${this.props.classes.cardMedia}`}
            image={slide}
            title="Activity"
          />
        </Slide>
      );
    });
  }

  render() {
    const { images, classes } = this.props;

    return images.length > 1 ? (
      <React.Fragment>
        {this.renderImages(images)}
        {this.state.checked > 0 ? (
          <IconButton
            className={classes.backButton}
            onClick={() => this.handleBackButton(images.length)}
          >
            <ChevronLeftIcon className={classes.largeIcon} />
          </IconButton>
        ) : null}

        {this.state.checked < images.length - 1 ? (
          <IconButton
            className={classes.forwardButton}
            variant="extendedFab"
            onClick={() => this.handleForwardButton(images.length)}
          >
            <ChevronRightIcon className={classes.largeIcon} />
          </IconButton>
        ) : null}
      </React.Fragment>
    ) : (
      <CardMedia className={classes.media} image={images[0]} title="Activity" />
    );
  }
}

const styles = () => ({
  media: {
    height: 450,
  },
  backButton: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,.3)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.8)',
    },
    top: '40%',
    left: 10,
  },
  forwardButton: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,.3)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.8)',
    },
    top: '40%',
    right: 10,
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  cardMedia: {
    position: 'absolute',
  },
});

export default withStyles(styles)(Carousel);
