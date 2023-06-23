// @ts-nocheck
// @flow
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import Button from '@material-ui/core/Button';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';

import VisibilityIcon from '@material-ui/icons/Visibility';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import LockIcon from '@material-ui/icons/Lock';
import Hidden from '@material-ui/core/Hidden';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import TodayIcon from '@material-ui/icons/Today';
import EditIcon from '@material-ui/icons/Edit';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PlaceIcon from '@material-ui/icons/Place';
import ViewWeekIcon from '@material-ui/icons/ViewWeek';
import BarCode from 'react-barcode';
import ButtonBase from '@material-ui/core/ButtonBase';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import moment from 'moment-timezone';

import { WithTranslation, withTranslation } from 'react-i18next';

import { compose, withState } from 'recompose';

import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Cake } from '@material-ui/icons';

import FeatureListProvider from '../../company/hocs/feature-list-provider.hoc';
import CreditMemberBadge from './CreditMemberBadge.component';

import { formatAsDate } from '../../../utils/datetime';
import Avatar from '../../../components/Avatar.component';
import type { Member } from '../types';

import EmailItem from '../../communication/components/EmailItem.component';
import PhoneItem from '../../communication/components/PhoneItem.component';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';
import DEPRECATEDCommunicationDrawer from '../../communication/components/DEPRECATEDCommunicationDrawer.component';
import EmergencyContactItemComponent from '../../communication/components/EmergencyContactItem.component';
import VaccinationStatus from './VaccinationStatus.component';
import { EstablishmentGroup } from '../../establishment/types';
import FavouriteEstablishmentGroupItemComponent from '../../establishment/components/FavouriteEstablishmentGroupItem.component';
import {
  EmailTemplateDetail,
  ResolvedGenericTags,
} from '#libs/email-editor/types';
import {
  ALLOWED_COUNTRIES_FOR_STATES,
  SMALL_MOBILE_CRITICAL_SIZE,
} from '#libs/member/constants';
import { UPSELL_IDENTIFIER_SMS } from '#libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';

const SELECT_EMAIL = 1;
const SEND_SMS = 2;

type OwnProps = {
  editMember?: () => void;
  mergeMember?: () => void;
  goToMember?: () => void;
  member: Member<number>;
  companyCountry?: string;
  hideContactButton?: boolean;
  showTermsAndConditions?: boolean;
  setShowTermsAndConditions?: (show: boolean) => void;
  showTermsOfUse?: boolean;
  setShowTermsOfUse?: (show: boolean) => void;
  getEmails?: () => void;
  getEmailDetail?: (id: number) => void;
  emailListLoading?: boolean;
  emails?: Array<any>;
  emailDetailLoading?: boolean;
  emailDetails?: Record<string, EmailTemplateDetail>;
  sendCommunication?: (com: any) => void;

  showVaccinationStatus: boolean;
  favoriteEstablishmentGroupList?: Array<EstablishmentGroup>;
  resolvedGenericTags: ResolvedGenericTags;
  handleOpenResetPasswordDialog: () => void;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

export class MemberSummaryCard extends Component<Props> {
  state = {
    displayMailDialog: false,
    displayBarcodeDialog: false,
    sendSms: false,
  };

  renderMembershipAndBirthday = () => {
    const { member, t } = this.props;

    const age = moment().diff(moment(member.consumer.birthday), 'years');

    const isBirthday = member.consumer?.birthday
      ? moment().format('MM-DD') ===
        moment(member.consumer.birthday).format('MM-DD')
      : false;

    return (
      <List dense>
        <ListItem>
          <TodayIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={
              <div className={this.props.classes.rowInfo}>
                <div>
                  {' '}
                  {`${
                    member.consumer.birthday
                      ? t('member:birth.bornIn', {
                          context: member.consumer.gender,
                          date: moment(member.consumer.birthday).format('L'),
                          age,
                        })
                      : t('member:birth.unknown', {
                          context: member.consumer.gender,
                        })
                  }`}
                </div>
                <div>{isBirthday && <Cake color="secondary" />}</div>
              </div>
            }
          />
        </ListItem>
        <ListItem>
          <PersonOutlineIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={`N°${member.membership_ID}`}
          />
        </ListItem>
      </List>
    );
  };

  renderBarCode = () => {
    const barcode =
      this.props.member.barcode || this.props.t('member:barcode.none');
    return (
      <List dense>
        <ListItem>
          <ViewWeekIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={
              <div className={this.props.classes.rowInfo}>
                {`${barcode}`}
                <IconButton
                  className={this.props.classes.visibilityIcon}
                  onClick={() => this.setState({ displayBarcodeDialog: true })}
                >
                  <VisibilityIcon color="primary" />
                </IconButton>
              </div>
            }
          />
        </ListItem>
      </List>
    );
  };

  renderNotificationSettings = () => {
    const { member } = this.props;
    return (
      <List dense>
        <FeatureListProvider>
          {(featureList: FeatureList) => (
            <PhoneItem
              phoneNumber={
                member.consumer.phonenumber &&
                member.consumer.phonenumber.phone_number
              }
              accept_contact={member.accept_sms}
              notificationIcon
              openSmsDialog={() => {
                if (!hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)) {
                  window.location = `sms:${member.consumer.phonenumber.phone_number}`;
                } else {
                  this.setState({ displayMailDialog: true, sendSms: true });
                }
              }}
              hideContactButton={this.props.hideContactButton}
            />
          )}
        </FeatureListProvider>
        <EmailItem
          email={member.consumer.email}
          pending_email={member.pending_email}
          accept_email={member.accept_email}
          notificationIcon
          openMailDialog={
            // eslint-disable-next-line
            () => this.setState({ displayMailDialog: true })
          }
          hideContactButton={this.props.hideContactButton}
        />
        {member.emergency_contact && (
          <EmergencyContactItemComponent
            emergency_contact={member.emergency_contact}
          />
        )}
        {this.props.favoriteEstablishmentGroupList &&
          this.props.favoriteEstablishmentGroupList?.length !== 0 && (
            <FavouriteEstablishmentGroupItemComponent
              establishmentGroupList={this.props.favoriteEstablishmentGroupList}
            />
          )}
        {this.props.showVaccinationStatus && (
          <VaccinationStatus vaccinationStatus={member.vaccination_status} />
        )}
        {this.state.displayMailDialog && (
          <DEPRECATEDCommunicationDrawer
            getEmails={this.props.getEmails}
            emails={this.props.emails}
            getEmailDetail={this.props.getEmailDetail}
            emailDetails={this.props.emailDetails}
            emailListLoading={this.props.emailListLoading}
            emailDetailLoading={this.props.emailDetailLoading}
            send={this.props.sendCommunication}
            open={this.state.displayMailDialog}
            fullscreen
            membersToDisplay={[{ ...member, phone: member.phone_number }]}
            allIds={[member.id]}
            allIdsWithEmail={member.email ? [member.id] : []}
            allIdsWithPhone={member.phone_number ? [member.id] : []}
            onCancel={() =>
              this.setState({ displayMailDialog: false, sendSms: false })
            }
            receiversNotEditable
            actionType={this.state.sendSms ? SEND_SMS : SELECT_EMAIL}
            showEmailConsentWarning={!member.accept_email}
            showSmsConsentWarning={!member.accept_sms}
            resolvedGenericTags={this.props.resolvedGenericTags}
          />
        )}
      </List>
    );
  };

  renderAddress = () => {
    const { address } = this.props.member.consumer;
    const { companyCountry } = this.props;
    let primary = '';
    let secondary = '';
    if (address) {
      primary = `${address.address_line_1 || ''} ${
        address.address_line_2 || ''
      }`;
      secondary = `${address.city || ''} - ${
        ALLOWED_COUNTRIES_FOR_STATES.includes(companyCountry) && address.state
          ? `${address.state} `
          : ''
      }${address.zipcode || ''} ${
        ALLOWED_COUNTRIES_FOR_STATES.includes(companyCountry) && address.state
          ? '- '
          : ''
      }${(address.country || '').toUpperCase()}`;
    }
    return (
      <List>
        <ListItem>
          <PlaceIcon />
          <ListItemText
            className={this.props.classes.listItemText}
            primary={primary}
            secondary={secondary}
          />
        </ListItem>
      </List>
    );
  };

  renderAvatarAndName = () => {
    const {
      t,
      member,
      classes,
      handleOpenResetPasswordDialog,
      mergeMember,
      editMember,
      goToMember,
    } = this.props;

    return (
      <div className={classes.avatarContainer}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <CreditMemberBadge
            credit={member.credit_account_balance}
            unpaidAmount={member.total_unpaid_amount}
          >
            <Avatar user={member.consumer} variant="mediumNoname" noname />
          </CreditMemberBadge>
          <div className={this.props.classes.consumerName}>
            <Typography noWrap>
              {member.consumer.first_name} {member.consumer.last_name}
            </Typography>
            <Typography noWrap>
              {t('member:memberSince') + formatAsDate(member.date_joined)}
            </Typography>
          </div>
        </div>
        <div className={classes.icons}>
          {mergeMember && (
            <Button
              onClick={mergeMember}
              color="secondary"
              disabled={member?.archived}
            >
              <Hidden xsDown>{t('common.merge')}</Hidden>
              <MergeTypeIcon className={classes.rightIcon} />
            </Button>
          )}
          {editMember && (
            <Button onClick={editMember} color="primary">
              <Hidden xsDown>{t('common.edit')}</Hidden>
              <EditIcon className={classes.rightIcon} />
            </Button>
          )}
          {goToMember && (
            <Button onClick={goToMember} color="primary">
              <Hidden xsDown>{t('common.show')}</Hidden>
              <ArrowForwardIcon className={classes.rightIcon} />
            </Button>
          )}
          {handleOpenResetPasswordDialog && this.props.member?.email && (
            <Button onClick={handleOpenResetPasswordDialog} color="primary">
              <Hidden xsDown>{t('member:resetPassword.button')}</Hidden>
              <LockIcon className={classes.rightIcon} />
            </Button>
          )}
        </div>
      </div>
    );
  };

  renderTermsAndConditions = () => {
    const {
      general_terms_and_conditions_date_accepted,
      general_terms_and_conditions_accepted,
    } = this.props.member;

    if (
      general_terms_and_conditions_accepted &&
      general_terms_and_conditions_date_accepted
    ) {
      return (
        <div className={this.props.classes.termsAndConditions}>
          <Typography inline component="div" variant="caption" color="default">
            <ButtonBase
              onClick={() => this.props.setShowTermsAndConditions(true)}
            >
              <Typography inline variant="caption" color="secondary">
                {this.props.t('member:termsAndConditions')}
              </Typography>
            </ButtonBase>
            {this.props.t('member:memberTermsAccepted', {
              date: moment(general_terms_and_conditions_date_accepted).format(
                'L',
              ),
            })}
          </Typography>
          <Dialog
            open={this.props.showTermsAndConditions}
            onClose={() => this.props.setShowTermsAndConditions(false)}
          >
            <DialogContent>
              <TypographyMultiline>
                {general_terms_and_conditions_accepted}
              </TypographyMultiline>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.props.setShowTermsAndConditions(false)}
              >
                {this.props.t('member:search.cancel')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return null;
  };

  renderTermsOfUse = () => {
    const {
      general_terms_of_use_date_accepted,
      general_terms_of_use_accepted,
    } = this.props.member;

    if (general_terms_of_use_date_accepted && general_terms_of_use_accepted) {
      return (
        <div className={this.props.classes.termsAndConditions}>
          <Typography inline component="div" variant="caption" color="default">
            <ButtonBase onClick={() => this.props.setShowTermsOfUse(true)}>
              <Typography variant="caption" color="secondary">
                {this.props.t('member:termsOfUse')}
              </Typography>
            </ButtonBase>
            {this.props.t('member:memberTermsAccepted', {
              date: moment(general_terms_of_use_date_accepted).format('L'),
            })}
          </Typography>
          <Dialog
            open={this.props.showTermsOfUse}
            onClose={() => this.props.setShowTermsOfUse(false)}
          >
            <DialogContent>
              <TypographyMultiline>
                {general_terms_of_use_accepted}
              </TypographyMultiline>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.setShowTermsOfUse(false)}>
                {this.props.t('member:search.cancel')}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return null;
  };

  render() {
    const { member, classes } = this.props;
    // ugly FIXME: because loading should never be set to true
    // if member=={}
    if (member && member.consumer) {
      return (
        <div>
          <Paper>
            <div className={classes.infoContainer}>
              {this.renderAvatarAndName()}
              {this.renderMembershipAndBirthday()}
              {this.renderBarCode()}
              {this.renderAddress()}
              {this.renderNotificationSettings()}
              {this.renderTermsAndConditions()}
              {this.renderTermsOfUse()}
            </div>
          </Paper>
          <Dialog
            open={this.state.displayBarcodeDialog}
            onClose={() => this.setState({ displayBarcodeDialog: false })}
          >
            <BarCode value={this.props.member.barcode} background="#fafafa" />
          </Dialog>
        </div>
      );
    }
    return null;
  }
}

const styles = (theme: Theme) =>
  createStyles({
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    rowInfo: {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginRight: theme.spacing(1),
      },
    },
    listItemText: {
      marginLeft: theme.spacing(2),
    },
    infoContainer: {
      padding: theme.spacing(2),
    },
    consumerName: {
      marginLeft: theme.spacing(2),
      display: 'flew',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    accountBalance: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    regularize: {
      marginTop: theme.spacing(1),
    },
    visibilityIcon: {
      marginLeft: theme.spacing(1),
    },
    accountBalanceBloc: {
      backgroundColor: '#F8F8F8',
      padding: theme.spacing(2),
      border: '2px solid #E8E8E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: '100%',
    },
    emailMargin: {
      marginLeft: theme.spacing(9),
    },
    balance: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    termsAndConditions: {
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(2),
    },
    icons: {
      flexDirection: 'column',
      display: 'flex',
      alignItems: 'flex-end',
      [theme.breakpoints.down(SMALL_MOBILE_CRITICAL_SIZE)]: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    avatarContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      [theme.breakpoints.down(SMALL_MOBILE_CRITICAL_SIZE)]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  });

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['translation', 'member']),
  withState('showTermsAndConditions', 'setShowTermsAndConditions', false),
  withState('showTermsOfUse', 'setShowTermsOfUse', false),
)(MemberSummaryCard);
