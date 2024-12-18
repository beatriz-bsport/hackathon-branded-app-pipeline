// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation, TFunction } from 'react-i18next';
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
        fullWidth
        required
        className={classes.mailTitle}
        name="Mail title"
        onChange={(e) => {
          props.onChangeTitle(e.target.value);
        }}
        placeholder={t('mail.title')}
        value={props.title}
      />
      <TextField
        fullWidth
        multiline
        label={t('mail.content')}
        name="Mail content"
        onChange={(e) => props.onChangeContent(e.target.value)}
        rows="15"
        value={props.mailContent}
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
