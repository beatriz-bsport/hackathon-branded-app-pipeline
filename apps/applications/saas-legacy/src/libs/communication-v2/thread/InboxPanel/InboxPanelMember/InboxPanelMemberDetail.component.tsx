import React, { memo, useCallback, useState } from 'react';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import BarCode from 'react-barcode';
import type { CallHistoryMethodAction } from 'connected-react-router';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ButtonBase from '@material-ui/core/ButtonBase';
import Cake from '@material-ui/icons/Cake';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PlaceIcon from '@material-ui/icons/Place';
import TodayIcon from '@material-ui/icons/Today';
import Typography from '@material-ui/core/Typography';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { ChatThreadKinds } from '@bsport/common/lib/master-data/communication-inbox.js';
import { CustomChip } from '#src/components/chip/CustomChip.component';
import { formatAsDate } from '#src/utils/datetime';
import EmergencyContactItemComponent from '#src/libs/communication/components/EmergencyContactItem.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';

import type { Member } from '#src/libs/member/types';

type Props = {
  member: Member;
  goToMemberPage?: (id: number) => CallHistoryMethodAction<[string, unknown?]>;
};

const InboxPanelMemberDetail: React.FC<Props> = ({
  member,
  goToMemberPage,
}) => {
  const classes = useStyles();
  const { t } = useTranslation(['member', 'communication']);

  const theme = useTheme();

  const [displayBarcodeDialog, setDisplayBarcodeDialog] = useState(false);

  const age = Math.floor(
    DateTime.now()
      .diff(
        DateTime.fromISO(member?.birthday || DateTime.now().toISO()),
        'years',
      )
      .as('years'),
  );

  const today = DateTime.now();
  const birthday = DateTime.fromISO(member?.birthday || today.toISO());
  const isBirthday = member?.birthday
    ? birthday.month === today.month && birthday.day === today.day
    : false;

  const barcode = member?.barcode || t('barcode.none');

  const handleClickBarcode = useCallback(() => {
    setDisplayBarcodeDialog(true);
  }, []);

  const handleCloseBarcode = useCallback(() => {
    setDisplayBarcodeDialog(false);
  }, []);

  const handleClickMemberRedirection = useCallback(() => {
    return goToMemberPage(member?.id);
  }, [goToMemberPage, member]);

  // Problem of address not typed well on member and consumer
  // @ts-expect-error
  const address = member?.address || member?.consumer?.address;

  const primaryAddress = `${address?.address_line_1 || ''} - ${
    address?.address_line_2 || ''
  }`;
  const secondaryAddress = `${address?.city || ''} - ${address?.state || ''}${
    address?.zipcode || ''
  } ${address?.state ? '- ' : ''}${(address?.country || '').toUpperCase()}`;

  return (
    <ObjectLevelPermissionProvider
      requiredPermission={[
        'member.allowed_actions.readInfo',
        'member.allowed_actions.accessProfile',
      ]}
    >
      {([
        hasMemberReadInfoPermission,
        hasMemberProfileAccessPermission,
      ]: boolean[]) => (
        <div>
          <div className={classes.memberSummaryContainer}>
            <div className={classes.contactMember}>
              {member?.phone_number && hasMemberReadInfoPermission && (
                <div className={classes.contactItemContainer}>
                  <CustomChip
                    displayedValue={member?.phone_number}
                    icon="LocalPhone"
                    mainColor={theme.palette.primary.main}
                  />
                </div>
              )}

              {member?.email && hasMemberReadInfoPermission && (
                <div className={classes.contactItemContainer}>
                  <CustomChip
                    displayedValue={member?.email}
                    icon="Mail"
                    mainColor={theme.palette.primary.main}
                  />
                </div>
              )}
            </div>
            <div className={classes.signupDate}>
              <Typography noWrap color="textSecondary">
                {t('memberSince') + formatAsDate(member?.date_joined)}
              </Typography>
            </div>

            <List dense disablePadding className={classes.section}>
              {!!member?.birthday && hasMemberReadInfoPermission && (
                <ListItem dense disableGutters>
                  <TodayIcon />
                  <ListItemText
                    className={classes.listItemText}
                    primary={
                      <div className={classes.rowInfo}>
                        <div>
                          {' '}
                          {`${t('member:birth.bornIn', {
                            context: member?.gender,
                            date: DateTime.fromISO(member?.birthday).toFormat(
                              'D',
                            ),
                            age,
                          })}`}
                        </div>
                        <div>{isBirthday && <Cake color="secondary" />}</div>
                      </div>
                    }
                  />
                </ListItem>
              )}
              <ListItem dense disableGutters>
                <PersonOutlineIcon />
                <ListItemText
                  className={classes.listItemText}
                  primary={`N°${member?.membership_ID}`}
                />
              </ListItem>
            </List>

            <div className={classes.section}>
              <ListItem
                disableGutters
                classes={{ root: classes.denseListItem }}
              >
                <ViewWeekIcon />
                <ListItemText
                  className={classes.listItemText}
                  primary={
                    <div className={classes.rowInfo}>
                      {`${barcode}`}
                      <IconButton
                        className={classes.visibilityIcon}
                        onClick={handleClickBarcode}
                      >
                        <VisibilityIcon color="primary" />
                      </IconButton>
                    </div>
                  }
                />
              </ListItem>
            </div>

            {address && hasMemberReadInfoPermission && (
              <div className={classes.section}>
                <ListItem
                  disableGutters
                  classes={{ root: classes.denseListItem }}
                >
                  <PlaceIcon />
                  <ListItemText
                    className={classes.listItemText}
                    primary={primaryAddress}
                    secondary={secondaryAddress}
                  />
                </ListItem>
              </div>
            )}

            {member?.emergency_contact && hasMemberReadInfoPermission && (
              <div className={classes.emergencyContact}>
                <EmergencyContactItemComponent
                  disableGutters
                  denseListItem={classes.denseListItem}
                  emergency_contact={member?.emergency_contact}
                />
              </div>
            )}
            {hasMemberProfileAccessPermission && (
              <ButtonBase onClick={handleClickMemberRedirection}>
                <Typography color="primary">
                  {t(
                    `communication:thread.panel.navigation.${ChatThreadKinds.Member}`,
                  ).toUpperCase()}
                </Typography>
                <ArrowForwardIcon
                  className={classes.arrowIcon}
                  color="primary"
                />
              </ButtonBase>
            )}
          </div>

          <Dialog onClose={handleCloseBarcode} open={displayBarcodeDialog}>
            <BarCode
              background={theme.palette.grey[50]}
              value={member?.barcode}
            />
          </Dialog>
        </div>
      )}
    </ObjectLevelPermissionProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  memberSummaryContainer: {
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
  },
  contactMember: {
    display: 'flex',
    paddingBottom: theme.spacing(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactItemContainer: {
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  icon: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(0.5),
  },
  signupDate: {
    paddingBottom: theme.spacing(2),
  },
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  rowInfo: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  visibilityIcon: {
    marginLeft: theme.spacing(1),
  },
  section: {
    paddingBottom: theme.spacing(2),
  },
  denseListItem: {
    width: '100%',
    display: 'flex',
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxSizing: 'border-box',
    paddingBottom: 0,
    paddingTop: 0,
  },
  arrowIcon: {
    paddingLeft: theme.spacing(1),
  },
  emergencyContact: {
    paddingBottom: theme.spacing(2),
  },
}));

export default memo(InboxPanelMemberDetail);
