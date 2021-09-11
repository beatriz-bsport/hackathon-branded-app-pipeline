import React from 'react';

import { replace } from 'connected-react-router';
import { connect, ConnectedProps } from 'react-redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { RootState } from '../reducers';

const useStyles = makeStyles((theme: Theme) => ({
  container: {},
}));

type OwnProps = {
  title: string;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export const ClassComponent = (props: Props) => {
  const { title } = props;
  const classes = useStyles();

  const { t } = useTranslation(['foo']);

  return (
    <div className={classes.container}>
      <Typography variant="h1">{title}</Typography>
      <Typography>{t('bar')}</Typography>
      <Button onClick={() => replace('/')}>{props.bar}</Button>
    </div>
  );
};

const connector = connect(
  (state: RootState) => ({
    bar: state.foo.bar,
  }),
  {
    replace,
  },
);

export default connector(ClassComponent);
