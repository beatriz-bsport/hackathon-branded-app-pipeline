import React from 'react';
import { useTranslation } from 'react-i18next';

import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Chip from '@material-ui/core/Chip';
import clsx from 'clsx';
import { compose } from 'recompose';
// eslint-disable-next-line bsport/no-redux-in-component
import { ConnectedProps, connect } from 'react-redux';
import type { FranchiseUserMember } from '#src/libs/franchise/types';
import { MEMBER_ARCHIVED_CHIP_COLOR } from '#src/libs/franchise/constants';
import {
  getAllowedFranchisees,
  getFranchiseCompany,
} from '#src/libs/franchise/selectors';
import type { RootState } from '#src/reducers';

type ParamsProps = {
  member: FranchiseUserMember;
  onClick?: () => void;
  isLast?: boolean;
};

type Props = ParamsProps & ConnectedProps<typeof connector>;

const FranchiseMemberRowItem: React.FC<Props> = ({
  member,
  onClick,
  isLast,
  company,
  allowedFranchiseeIds,
}) => {
  const { t } = useTranslation(['franchise', 'member']);
  const classes = useStyles();

  const isAllowed = React.useCallback(
    (companyId: number) =>
      !allowedFranchiseeIds?.length || allowedFranchiseeIds.includes(companyId),
    [allowedFranchiseeIds],
  );

  if (!member || !company) return null;

  return (
    <div>
      <ListItem
        key={company.id}
        disableGutters
        button={isAllowed(company.id) || undefined}
        className={clsx(classes.listItem, {
          [classes.lastItem]: isLast,
        })}
        disabled={!isAllowed(company.id)}
        onClick={!!onClick && isAllowed(company.id) ? onClick : null}
      >
        <div className={classes.rowTitle}>
          <Avatar
            alt={company.name}
            className={classes.avatar}
            src={company.cover}
          />
          <div>
            <Typography variant="body1">{company.name}</Typography>
          </div>
          {member.archived && (
            <div className={classes.chipContainer}>
              <Chip className={classes.chip} label={t('member:archived')} />
            </div>
          )}
        </div>
        <Button
          className={classes.leftNavigation}
          disabled={!isAllowed(company.id)}
          onClick={onClick}
          startIcon={<ArrowForwardIcon />}
        >
          <Typography variant="body1">
            {t('franchise:member.seeMemberInCompany').toUpperCase()}
          </Typography>
        </Button>
      </ListItem>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
    alignSelf: 'stretch',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  lastItem: {
    borderBottom: 'none',
  },
  chipContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  chip: {
    backgroundColor: MEMBER_ARCHIVED_CHIP_COLOR,
  },
  rowTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  leftNavigation: {
    color: theme.palette.primary.main,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
}));

const connector = connect((state: RootState, props: ParamsProps) => ({
  company: props.member?.company_id
    ? getFranchiseCompany(parseInt(props.member.company_id))(state)
    : null,
  allowedFranchiseeIds: getAllowedFranchisees(state),
}));

export default compose<Props, ParamsProps>(
  React.memo,
  connector,
)(FranchiseMemberRowItem);
