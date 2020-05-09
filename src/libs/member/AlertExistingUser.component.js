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
  existingMemberId: number,

  linkMember: (number) => void,
  goToMember: (number) => void,
  goToMerge: (number, number) => void,

  email?: string,
  phonenumber?: string,
};

export function AlertExistingUser(props: Props) {
  const { t, classes } = props;
  const {
    existingMemberId,
    memberId,
    goToMember,
    linkMember,
    email,
    phonenumber,
    goToMerge,
  } = props;
  const userKey = existingMemberId ? 'member' : 'user';
  const textKey = email
    ? `${userKey}.existsWithEmail`
    : `${userKey}.existsWithPhone`;
  const button = existingMemberId ? (
    <div>
      <Button
        onClick={() => goToMember(existingMemberId)}
        variant="outlined"
        classes={{ outlined: classes.buttonOutlined }}
      >
        {t('exists.goTo')}
      </Button>
      {memberId && existingMemberId ? (
        <Button
          onClick={() => goToMerge(memberId, existingMemberId)}
          variant="outlined"
          classes={{ outlined: classes.buttonOutlined }}
          className={classes.mergButton}
        >
          {t('exists.merge')}
        </Button>
      ) : null}
    </div>
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
    padding: theme.spacing(2),
    color: 'white',
  },
  mergButton: {
    marginLeft: theme.spacing(1),
  },
  buttonOutlined: {
    borderColor: 'white',
    color: 'white',
  },
});

export default withNamespaces(['member'])(
  withStyles(styles)(AlertExistingUser),
);
