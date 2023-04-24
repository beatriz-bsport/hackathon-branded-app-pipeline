// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';

import { alpha } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';

import { Member } from '#libs/member/types';
import MemberRelationNavigationList from '#libs/relationship/components/MemberRelationNavigationList.component';

type NavigationBetweenRelationsProps = {
  controlableMemberList?: Array<Member>;
  navigateToRelationAccount?: (memberId: number) => void;
  isRelationNavigation?: boolean;
  navigateBackToMasterRelation?: () => void;
};

const AppBarNavigationBetweenRelations: React.FC<
  NavigationBetweenRelationsProps
> = ({
  controlableMemberList,
  navigateBackToMasterRelation,
  isRelationNavigation,
  navigateToRelationAccount,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['translation', 'consumerSpace']);

  if (!controlableMemberList?.length && !isRelationNavigation) return null;

  if (!!controlableMemberList?.length && !isRelationNavigation)
    return (
      <>
        <MemberRelationNavigationList
          relations={controlableMemberList}
          onClickRelation={navigateToRelationAccount}
        />
        <Divider className={classes.dividerRelations} />
      </>
    );

  return (
    <Button
      className={classes.returnButton}
      onClick={navigateBackToMasterRelation}
    >
      {t('consumerSpace:navigation.backToRelationMasterSpace')}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  returnButton: {
    color: theme.palette.primary.main,
    border: 'solid',
    borderColor: theme.palette.primary.main,
    borderWidth: 1,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    borderRadius: theme.spacing(3),
    marginBottom: 0,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    margin: theme.spacing(2),
    zIndex: 2,
  },
  dividerRelations: {
    width: '100%',
  },
}));

export default AppBarNavigationBetweenRelations;
