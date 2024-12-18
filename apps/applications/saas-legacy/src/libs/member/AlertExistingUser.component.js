// @flow

import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation, TFunction } from 'react-i18next';

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
  emailConfirmed: boolean,

  goToButtonText?: string,
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
    emailConfirmed,
    goToButtonText,
  } = props;
  const userKey = existingMemberId ? 'member' : 'user';
  let textKey = email
    ? `${userKey}.existsWithEmail`
    : `${userKey}.existsWithPhone`;
  if (existingMemberId && !emailConfirmed) {
    textKey = textKey.concat('ButNotConfirmed');
  }
  const button =
    existingMemberId && emailConfirmed ? (
      <div>
        <Button
          classes={{ outlined: classes.buttonOutlined }}
          onClick={() => goToMember(existingMemberId)}
          variant="outlined"
        >
          {t(goToButtonText ?? 'exists.goTo')}
        </Button>
        {memberId && existingMemberId && goToMerge ? (
          <Button
            classes={{ outlined: classes.buttonOutlined }}
            className={classes.mergButton}
            onClick={() => goToMerge(memberId, existingMemberId)}
            variant="outlined"
          >
            {t('exists.merge')}
          </Button>
        ) : null}
      </div>
    ) : (
      <>
        {linkMember ? <LinkMemberDialog onConfirm={linkMember} t={t} /> : null}
      </>
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

export default withTranslation(['member'])(
  withStyles(styles)(AlertExistingUser),
);
