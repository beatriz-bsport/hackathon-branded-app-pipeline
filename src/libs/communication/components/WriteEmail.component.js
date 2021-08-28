// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import TextField from '@material-ui/core/TextField';

type Props = {
  classes: Object,
  t: TFunction,
  title: string,
  mailContent: string,
  onChangeTitle: (string) => void,
  onChangeContent: (string) => void,
};

export function WriteEmail(props: Props) {
  const { t, classes } = props;
  return (
    <div>
      <TextField
        name="Mail title"
        placeholder={t('mail.title')}
        fullWidth
        required
        className={classes.mailTitle}
        value={props.title}
        onChange={(e) => {
          props.onChangeTitle(e.target.value);
        }}
      />
      <TextField
        name="Mail content"
        label={t('mail.content')}
        rows="15"
        value={props.mailContent}
        onChange={(e) => props.onChangeContent(e.target.value)}
        fullWidth
        multiline
        variant="outlined"
      />
    </div>
  );
}

const styles = (theme) => ({
  mailTitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['communication']),
  withStyles(styles),
)(WriteEmail);
