import React, { Component } from 'react';
import { Grid, Typography } from '@material-ui/core';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import { Level } from '../components';
import objectFitImages from 'object-fit-images';

export default class ActivityCover extends Component {
  componentDidMount() {
    objectFitImages();
  }
  render() {
    const { cover_thumbnail, levels, parent_category } = this.props.activity;

    const sport = SPORTS.filter((s) => s.id === parent_category)[0];

    const imgStyle = {
      backgroundColor: 'rgba(50,50,50,.5)',
      height: '200px',
      width: '100%',
      objectFit: 'cover',
    };

    let COVER = null;
    if (!cover_thumbnail) {
      // TODO clean this shit
      COVER = (
        <div style={{ position: 'relative' }}>
          <Grid container alignItems="center" justify="center" style={imgStyle}>
            <Grid item>
              <img style={{ margin: 'auto' }} src={sport.icon} />
            </Grid>
          </Grid>
          <div
            style={{ position: 'absolute', top: 10, zIndex: 9000, right: 10 }}
          >
            <Grid container direction="column" spacing={8}>
              {levels.map((l) => (
                <Grid item>
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
          <img style={imgStyle} src={cover_thumbnail} />
          <div
            style={{ position: 'absolute', top: 10, zIndex: 9000, right: 10 }}
          >
            <Grid container direction="column" spacing={8}>
              {levels.map((l) => (
                <Grid item>
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
}
