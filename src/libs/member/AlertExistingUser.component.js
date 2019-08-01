// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import Button from '@material-ui/core/Button';

import LinkMemberDialog from './LinkMemberDialog.component';

type Props = {
  classes: { [string]: string },
  t: TFunction,
  memberId: number,
  linkMember: (number) => void,
  goToMember: (number) => void,
  email?: string,
  phonenumber?: string,
};

export function AlertExistingUser(props: Props) {
  const { t, classes } = props;
  const { memberId, goToMember, linkMember, email, phonenumber } = props;
  const userKey = memberId ? 'member' : 'user';
  const textKey = email
    ? `member.${userKey}.existsWithEmail`
    : `member.${userKey}.existsWithPhone`;
  const button = memberId ? (
    <Button
      onClick={() => goToMember(memberId)}
      variant="outlined"
      classes={{ outlined: classes.buttonOutlined }}
    >
      {t('member.exists.goTo')}
    </Button>
  ) : (
    <LinkMemberDialog onConfirm={linkMember} t={t} />
  );

  return (
    <div className={classes.info}>
      <p>{t(textKey, { email, phonenumber })}</p>
      {button}
    </div>
  );
}

AlertExistingUser.defaultProps = {
  email: null,
  phonenumber: null,
};

const styles = (theme) => ({
  info: {
    width: '100%',
    backgroundColor: '#03A33B',
    padding: theme.spacing.unit * 2,
    color: 'white',
  },
  buttonOutlined: {
    borderColor: 'white',
    color: 'white',
  },
});

export default withNamespaces([])(withStyles(styles)(AlertExistingUser));
