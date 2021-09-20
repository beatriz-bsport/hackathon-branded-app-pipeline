// @flow
import React from 'react';
import {
  createStyles,
  Avatar,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { FranchiseCompany } from '../types';

export type OwnProps = {
  companies: FranchiseCompany[];
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseMemberMembership = (props: Props) => {
  const { companies, classes, t } = props;

  return (
    <div>
      <Typography variant="h4">{t('member.franchises')}</Typography>
      <div className={classes.companiesContainer}>
        {companies.map((company, index) => {
          if (!company) return null;
          return (
            <div
              className={classNames(classes.row, {
                [classes.isLast]: index === companies.length - 1,
              })}
              key={company.id}
            >
              <div className={classes.rowTitle}>
                <Avatar
                  className={classes.avatar}
                  alt={company.name}
                  src={company.cover}
                />
                <div>
                  <Typography variant="body1">{company.name}</Typography>
                </div>
              </div>
              {/* TODO Aymeric Redirect to franchise view */}
              <div className={classes.leftNavigation}>
                <ArrowForwardIcon className={classes.icon} />
                <Typography variant="body1">
                  {t('member.seeMembership').toUpperCase()}
                </Typography>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    companiesContainer: {
      marginTop: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      boxShadow: theme.shadows[2],
    },
    row: {
      padding: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid #BEBEBE`,
    },
    isLast: {
      borderBottom: 'none',
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
    icon: {
      marginRight: theme.spacing(2),
    },
    avatar: {
      marginRight: theme.spacing(2),
    },
  });

export default compose(
  withStyles(styles),
  withTranslation(['franchise']),
)(FranchiseMemberMembership);
