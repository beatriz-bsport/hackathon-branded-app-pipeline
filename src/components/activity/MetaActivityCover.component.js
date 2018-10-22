// @flow
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import objectFitImages from 'object-fit-images';

import SPORTS from 'bsport-commons/lib/master-data/sports';
import { Level } from '../category';
import type { MetaActivity } from '../../api/types';

type Props = {
  metaActivity: MetaActivity,
  large: ?boolean,
};
export default class MetaActivityCover extends Component<Props> {
  componentDidMount() {
    objectFitImages();
  }

  render() {
    const { cover_main, levels, parent_category } = this.props.metaActivity;

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
    if (!cover_main) {
      // TODO clean this shit
      COVER = (
        <div style={{ position: 'relative' }}>
          <Grid container alignItems="center" justify="center" style={imgStyle}>
            <Grid item>
              <img style={{ margin: 'auto' }} src={sport.icon} alt="sport" />
            </Grid>
          </Grid>
          <div
            style={{ position: 'absolute', top: 10, zIndex: 9000, right: 10 }}
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
          <img style={imgStyle} src={cover_main} alt="Activity" />
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
