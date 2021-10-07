import React, { Component } from 'react';

import { replace } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';

import { RootState } from '../reducers';

const styles = (theme: Theme) =>
  createStyles({
    container: {},
  });

type OwnProps = {
  title: string;
};
type State = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class ClassComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { classes, t, title, bar } = this.props;
    return (
      <div className={classes.container}>
        <Typography variant="h1">{title}</Typography>
        <Typography>{t('bar')}</Typography>
        <Button onClick={() => replace('/')}>{bar}</Button>
      </div>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    bar: state.foo.bar,
  }),
  {
    replace,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['foo']),
  connector,
)(ClassComponent);