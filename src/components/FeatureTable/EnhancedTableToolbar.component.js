// @flow
import React from 'react';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { withTranslation } from 'react-i18next';

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing(1),
  },
  highlight:
    // prettier-ignore
    theme.palette.type === 'light' ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

type Props = {
  numSelected: number,
  title: string,
  t: (x: string) => string,
  classes: Object,
  selectionFeature: string,
};
const EnhancedTableToolbar = (props: Props) => {
  const { numSelected, title, t, classes, selectionFeature } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} {t('common.selected').toLowerCase()}
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? selectionFeature : null}
      </div>
    </Toolbar>
  );
};

export default withStyles(toolbarStyles)(
  withTranslation()(EnhancedTableToolbar),
);
