// @flow
import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { compose } from 'recompose';
import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  ListItem,
  Button,
} from '@material-ui/core';
import Room from '@material-ui/icons/Room';
import InfoIcon from '@material-ui/icons/Info';

import { Member } from '../../member/types';
import { Establishment } from '../../establishment/types';
import PaginatedListBase from '../../../components/PaginatedListBase.component';

export type OwnProps = {
  companyId: number;
  companyName: string;
  members: Member[];
  memberCounts: number;
  page: number;
  establishmentsByLocation: Record<string, Establishment[]>;
  handleChangePage: (newPage: number) => void;
  goToCompany: () => void;
  goToUser: (memberId: number) => () => void;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

const FranchiseCompanyDetails = (props: Props) => {
  const {
    companyName,
    classes,
    companyId,
    members,
    memberCounts,
    page,
    establishmentsByLocation,
    handleChangePage,
    goToCompany,
    goToUser,
    t,
  } = props;

  return (
    <div>
      {!companyId && (
        <div className={classes.emptySelect}>
          <InfoIcon className={classes.info} />
          <div>
            <Typography variant="body1">
              {t('companies.emptySelect')}
            </Typography>
          </div>
        </div>
      )}
      {!!companyId && companyName && (
        <div>
          <div>
            <Typography variant="h4">{companyName}</Typography>
          </div>
          <div className={classes.divider} />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={goToCompany}
          >
            {t('companies.navigateToCompany')}
          </Button>
          <div className={classes.subtitle}>
            <Typography variant="h5">{t('companies.members')}</Typography>
          </div>
          {members && members.length > 0 ? (
            <div className={classes.table}>
              <PaginatedListBase
                itemPerPage={5}
                items={members}
                page={page}
                count={memberCounts ?? 0}
                nbItems={memberCounts ?? 0}
                onPageRequested={handleChangePage}
                renderItem={(member: Member) => {
                  if (!member) return null;

                  return (
                    <ListItem
                      divider
                      button
                      className={classes.row}
                      key={member.id}
                      onClick={goToUser(member.id)}
                    >
                      <Avatar
                        className={classes.avatar}
                        alt={member?.name}
                        src={member?.photo}
                      />
                      <Typography variant="body1">{member?.name}</Typography>
                    </ListItem>
                  );
                }}
              />
            </div>
          ) : (
            <div className={classes.emptySelect}>
              <InfoIcon className={classes.info} />
              <Typography variant="body1">
                {t('companies.membersEmptyState')}
              </Typography>
            </div>
          )}
          {establishmentsByLocation && (
            <div className={classes.establishment}>
              <div className={classes.subtitle}>
                <Typography variant="h5">
                  {t('companies.establishment')}
                </Typography>
              </div>
              <div className={classes.table}>
                <Table aria-labelledby="establishment">
                  <TableBody>
                    {Object.keys(establishmentsByLocation).map((address) => {
                      if (!address || address === 'undefined') return null;

                      return (
                        <React.Fragment key={address}>
                          <TableRow>
                            <TableCell>
                              <div className={classes.row}>
                                <Room
                                  color="disabled"
                                  className={classes.pin}
                                />
                                <Typography variant="body1">
                                  {address}
                                </Typography>
                              </div>
                            </TableCell>
                          </TableRow>
                          {establishmentsByLocation?.[address]?.map(
                            (establishment) => (
                              <TableRow key={establishment?.id}>
                                <TableCell>
                                  <div className={classes.establishmentRow}>
                                    <Avatar
                                      className={classes.avatar}
                                      alt={establishment?.title}
                                      src={establishment?.cover}
                                    />
                                    <Typography variant="body1">
                                      {establishment?.title}
                                    </Typography>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              {(!establishmentsByLocation ||
                Object.keys(establishmentsByLocation).length === 0) && (
                <div className={classes.emptySelect}>
                  <InfoIcon className={classes.info} />
                  <Typography variant="body1">
                    {t('companies.establishmentEmptyState')}
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    emptySelect: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(2),
    },
    info: {
      marginBottom: theme.spacing(2),
    },
    divider: {
      width: '100%',
      height: 1,
      backgroundColor: theme.palette.divider,
      marginTop: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(1),
    },
    table: {
      backgroundColor: theme.palette.common.white,
      borderRadius: 5,
      boxShadow: theme.shadows[2],
    },
    subtitle: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    pin: {
      marginRight: theme.spacing(1),
    },
    pointer: {
      cursor: 'pointer',
    },
    headerTable: {
      height: theme.spacing(2),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    establishment: {
      marginTop: theme.spacing(4),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    establishmentRow: {
      paddingLeft: theme.spacing(2),
      display: 'flex',
      alignItems: 'center',
    },
    avatar: {
      marginRight: theme.spacing(2),
    },
  });

export default compose(
  withTranslation(['franchise']),
  withStyles(styles, { withTheme: true }),
)(FranchiseCompanyDetails);
