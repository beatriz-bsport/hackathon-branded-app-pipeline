// @ts-nocheck
import React, { PureComponent } from 'react';
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
import ContactsIcon from '@material-ui/icons/Contacts';
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
import MemberSummaryInfoItem from '#libs/member/components/MemberSummaryInfoItem.component';
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
import ObjectLevelPermissionProvider from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

import { MemberSummaryCardReferralSection } from './MemberSummaryCardReferralSection.component';

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
  resolvedGenericTags?: ResolvedGenericTags;
  handleOpenResetPasswordDialog?: () => void;
  referringMemberName?: string;
  referringMemberId?: number;
  handleRedirectToReferringMember?: () => void;
};

type Props = OwnProps & WithTranslation & WithStyles<typeof styles>;

export class MemberSummaryCard extends PureComponent<Props> {
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

    const memberBirthdayValue = `${
      member.consumer.birthday
        ? t('member:birth.bornIn', {
            context: member.consumer.gender,
            date: moment(member.consumer.birthday).format('L'),
            age,
          })
        : t('member:birth.unknown', {
            context: member.consumer.gender,
          })
    }`;

    return (
      <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
        {(hasMemberProfileAccess: boolean) => (
          <div className={this.props.classes.horizontalPadding2}>
            {hasMemberProfileAccess && (
              <MemberSummaryInfoItem
                icon={<TodayIcon />}
                value={memberBirthdayValue}
              />
            )}

            <MemberSummaryInfoItem
              icon={<ContactsIcon />}
              label={t('member:officialIdNumber.label')}
              value={t('member:officialIdNumber.value', {
                id: member.official_document_id,
              })}
              valueExtra={
                hasMemberProfileAccess &&
                isBirthday && <Cake color="secondary" fontSize="small" />
              }
            />
            <MemberSummaryInfoItem
              icon={<PersonOutlineIcon />}
              label={t('member:membershipNumber.label')}
              value={t('member:membershipNumber.value', {
                id: member.membership_ID,
              })}
            />
          </div>
        )}
      </ObjectLevelPermissionProvider>
    );
  };

  renderBarCode = () => {
    const barcode =
      this.props.member.barcode || this.props.t('member:barcode.none');

    return (
      <div className={this.props.classes.horizontalPadding2}>
        <MemberSummaryInfoItem
          icon={<ViewWeekIcon />}
          label={this.props.t('member:barcode.label')}
          value={barcode}
          valueExtra={
            <IconButton
              onClick={() => this.setState({ displayBarcodeDialog: true })}
              size="small"
            >
              <VisibilityIcon color="primary" />
            </IconButton>
          }
        />
      </div>
    );
  };

  renderNotificationSettings = () => {
    const { member } = this.props;
    return (
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'member.allowed_actions.communication',
          'member.allowed_actions.accessProfile',
        ]}
      >
        {([
          hasMemberCommunicationPermission,
          hasMemberProfileAccess,
        ]: boolean[]) => {
          const hideContactButton =
            this.props.hideContactButton || !hasMemberCommunicationPermission;

          return (
            <List dense>
              <FeatureListProvider>
                {(featureList: FeatureList) => (
                  <PhoneItem
                    notificationIcon
                    accept_contact={member.accept_sms}
                    hideContactButton={hideContactButton}
                    openSmsDialog={() => {
                      if (!hasUpsell(featureList, UPSELL_IDENTIFIER_SMS)) {
                        window.location = `sms:${member.consumer.phonenumber.phone_number}`;
                      } else {
                        this.setState({
                          displayMailDialog: true,
                          sendSms: true,
                        });
                      }
                    }}
                    phoneNumber={
                      (hasMemberProfileAccess &&
                        member.consumer.phonenumber?.phone_number) ||
                      ''
                    }
                  />
                )}
              </FeatureListProvider>
              <EmailItem
                notificationIcon
                accept_email={member.accept_email}
                email={(hasMemberProfileAccess && member.consumer.email) || ''}
                hideContactButton={hideContactButton}
                openMailDialog={
                  // eslint-disable-next-line
                  () => this.setState({ displayMailDialog: true })
                }
                pending_email={member.pending_email}
              />
              {hasMemberProfileAccess && member.emergency_contact && (
                <EmergencyContactItemComponent
                  emergency_contact={member.emergency_contact}
                />
              )}
              {this.props.favoriteEstablishmentGroupList &&
                this.props.favoriteEstablishmentGroupList?.length !== 0 && (
                  <FavouriteEstablishmentGroupItemComponent
                    establishmentGroupList={
                      this.props.favoriteEstablishmentGroupList
                    }
                  />
                )}
              {this.props.showVaccinationStatus && (
                <VaccinationStatus
                  vaccinationStatus={member.vaccination_status}
                />
              )}
              {this.state.displayMailDialog && (
                <DEPRECATEDCommunicationDrawer
                  fullscreen
                  receiversNotEditable
                  actionType={this.state.sendSms ? SEND_SMS : SELECT_EMAIL}
                  allIds={[member.id]}
                  allIdsWithEmail={member.email ? [member.id] : []}
                  allIdsWithPhone={member.phone_number ? [member.id] : []}
                  emailDetailLoading={this.props.emailDetailLoading}
                  emailDetails={this.props.emailDetails}
                  emailListLoading={this.props.emailListLoading}
                  emails={this.props.emails}
                  getEmailDetail={this.props.getEmailDetail}
                  getEmails={this.props.getEmails}
                  membersToDisplay={[{ ...member, phone: member.phone_number }]}
                  onCancel={() =>
                    this.setState({ displayMailDialog: false, sendSms: false })
                  }
                  open={this.state.displayMailDialog}
                  resolvedGenericTags={this.props.resolvedGenericTags}
                  send={this.props.sendCommunication}
                  showEmailConsentWarning={!member.accept_email}
                  showSmsConsentWarning={!member.accept_sms}
                />
              )}
            </List>
          );
        }}
      </ObjectLevelPermissionProvider>
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
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="member.allowed_actions.accessProfile"
      >
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
      </ObjectLevelPermissionWrapper>
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
            <Avatar noname user={member.consumer} variant="mediumNoname" />
          </CreditMemberBadge>
          <div className={this.props.classes.consumerName}>
            <Typography className={this.props.classes.firstAndLastName}>
              {member.consumer.first_name} {member.consumer.last_name}
            </Typography>
            <Typography noWrap>
              {t('member:memberSince') + formatAsDate(member.date_joined)}
            </Typography>
          </div>
        </div>
        {member && !member.is_pos && (
          <div className={classes.icons}>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.editInfo"
            >
              <>
                {mergeMember && (
                  <Button
                    color="secondary"
                    disabled={member?.archived}
                    onClick={mergeMember}
                  >
                    <Hidden xsDown>{t('common.merge')}</Hidden>
                    <MergeTypeIcon className={classes.rightIcon} />
                  </Button>
                )}
                {editMember && (
                  <Button color="primary" onClick={editMember}>
                    <Hidden xsDown>{t('common.edit')}</Hidden>
                    <EditIcon className={classes.rightIcon} />
                  </Button>
                )}
              </>
            </ObjectLevelPermissionWrapper>
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="member.allowed_actions.accessProfile"
            >
              <>
                {!!goToMember && (
                  <Button color="primary" onClick={goToMember}>
                    <Hidden xsDown>{t('common.show')}</Hidden>
                    <ArrowForwardIcon className={classes.rightIcon} />
                  </Button>
                )}
              </>
            </ObjectLevelPermissionWrapper>
            {handleOpenResetPasswordDialog && this.props.member?.email && (
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="member.allowed_actions.editInfo"
              >
                <Button color="primary" onClick={handleOpenResetPasswordDialog}>
                  <Hidden xsDown>{t('member:resetPassword.button')}</Hidden>
                  <LockIcon className={classes.rightIcon} />
                </Button>
              </ObjectLevelPermissionWrapper>
            )}
          </div>
        )}
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
          <Typography inline color="default" component="div" variant="caption">
            <ButtonBase
              onClick={() => this.props.setShowTermsAndConditions(true)}
            >
              <Typography inline color="secondary" variant="caption">
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
            onClose={() => this.props.setShowTermsAndConditions(false)}
            open={this.props.showTermsAndConditions}
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
          <Typography inline color="default" component="div" variant="caption">
            <ButtonBase onClick={() => this.props.setShowTermsOfUse(true)}>
              <Typography color="secondary" variant="caption">
                {this.props.t('member:termsOfUse')}
              </Typography>
            </ButtonBase>
            {this.props.t('member:memberTermsAccepted', {
              date: moment(general_terms_of_use_date_accepted).format('L'),
            })}
          </Typography>
          <Dialog
            onClose={() => this.props.setShowTermsOfUse(false)}
            open={this.props.showTermsOfUse}
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
              {this.props.referringMemberId &&
                this.props.referringMemberName && (
                  <MemberSummaryCardReferralSection
                    handleRedirectToReferringMember={
                      this.props.handleRedirectToReferringMember
                    }
                    referringMemberName={this.props.referringMemberName}
                  />
                )}
              {this.renderTermsAndConditions()}
              {this.renderTermsOfUse()}
            </div>
          </Paper>
          <Dialog
            onClose={() => this.setState({ displayBarcodeDialog: false })}
            open={this.state.displayBarcodeDialog}
          >
            <BarCode background="#fafafa" value={this.props.member.barcode} />
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
    horizontalPadding2: {
      paddingLeft: theme.spacing(2),
      paddingright: theme.spacing(2),
    },
    consumerName: {
      marginLeft: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    firstAndLastName: {
      wordBreak: 'break-all',
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
