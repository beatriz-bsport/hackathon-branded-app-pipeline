import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { MaterialStyleType } from '../../../utils/types';
import type { Member } from '../types';

type OwnProps = {
  member: Member;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

export const MemberArchiveBanner = (props: Props) => {
  const { t, classes } = props;
  const { member } = props;
  if (!member?.archived) {
    return null;
  }
  return (
    <div className={classes.archiveMemberBanner}>
      <div className={classes.text}>
        {t('archive.archivedMember', {
          name: member?.name,
        })}
      </div>
    </div>
  );
};
const styles = (theme: Theme) => ({
  archiveMemberBanner: {
    height: theme.spacing(3),
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    color: 'red',
  },
  text: {
    color: '#FEFEFE',
    fontSize: 14,
    alignItems: 'center',
    flexDirection: 'row',
    display: 'flex',
    padding: theme.spacing(1) / 4,
    '&>*': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
});
export default compose<any, OwnProps>(
  withTranslation('member'),
  withStyles(styles),
)(MemberArchiveBanner);
