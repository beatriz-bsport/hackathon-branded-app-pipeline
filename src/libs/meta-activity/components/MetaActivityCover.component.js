// @flow
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import objectFitImages from 'object-fit-images';
import SPORTS from '@bsport/common/lib/master-data/sports';
import Carousel from '../../../components/Carousel.component';
import { Level } from '../../../components/category';
import type { MetaActivity } from '../../../api/types';

type Props = {
  metaActivity: MetaActivity,
  large: ?boolean,
  coverImages: Array<Object>,
};
const styles = () => ({
  media: {
    height: 450,
  },
  backButton: {
    position: 'absolute',
    top: '40%',
    left: '10px',
  },
  forwardButton: {
    position: 'absolute',
    top: '40%',
    right: '10px',
  },
  largeIcon: {
    width: 50,
    height: 50,
  },
  cardMedia: {
    position: 'absolute',
  },
});

export default withStyles(styles)(
  class MetaActivityCover extends Component<Props> {
    componentDidMount() {
      objectFitImages();
    }

    render() {
      const { metaActivity, coverImages } = this.props;
      const { cover_main, levels, parent_category } = metaActivity;
      const sport = SPORTS.filter((s) => s.id === parent_category)[0];

      const imgStyle = this.props.large
        ? {
            backgroundColor: 'rgba(50,50,50,.5)',
            height: '450px',
            width: '100%',
            objectFit: 'cover',
          }
        : {
            backgroundColor: 'rgba(50,50,50,.5)',
            height: '300px',
            width: '100%',
            objectFit: 'cover',
          };

      let COVER = null;

      const images = [cover_main].concat(
        (coverImages || []).map((e) => {
          return e.image;
        }),
      );

      if (!cover_main) {
        COVER = (
          <div style={{ position: 'relative' }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              style={imgStyle}
            >
              <Grid item>
                <img style={{ margin: 'auto' }} src={sport.icon} alt="sport" />
              </Grid>
            </Grid>
            <div
              style={{ position: 'absolute', top: 10, zIndex: 1000, right: 10 }}
            >
              <Grid container direction="column" spacing={8}>
                {levels.map((l) => (
                  <Grid item key={l.id}>
                    <Level levelId={l.id} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        );
      } else {
        COVER = (
          <div style={{ position: 'relative' }}>
            <Carousel images={images} />
            <div
              style={{ position: 'absolute', top: 10, zIndex: 1000, right: 10 }}
            >
              <Grid container direction="column" spacing={8}>
                {levels.map((l) => (
                  <Grid item key={l.id}>
                    <Level levelId={l.id} />
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        );
      }
      return COVER;
    }
  },
);
