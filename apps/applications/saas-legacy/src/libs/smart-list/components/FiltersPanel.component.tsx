import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { withTranslation, WithTranslation } from 'react-i18next';
import memoize from 'memoize-one';
import { compose } from 'recompose';

import type { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import FilterListIcon from '@material-ui/icons/FilterList';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import SmartphoneIcon from '@material-ui/icons/Smartphone';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EmailIcon from '@material-ui/icons/Email';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  GENDER_FILTER_IDENTIFIER,
  TAG_FILTER_IDENTIFIER,
  USER_HAS_PASSWORD_FILTER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  BOOKINGS_NUMBER_FILTER_IDENTIFIER,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKINGS_FILTER_IDENTIFIER,
  FILTER_BOOKING_LAST,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  PRIVATE_PASS_FILTER_IDENTIFIER,
  WAIVER_FILTER_IDENTIFIER,
  PAYMENT_METHOD_FILTER_IDENTIFIER,
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  AGE_FILTER_IDENTIFIER,
  CUSTOM_FORMS_FILTER_IDENTIFIER,
  USER_MARKETING_NOTIFICATIONS_FILTER,
  NOTES_FILTER_IDENTIFIER,
  RELATIONS_FILTER_IDENTIFIER,
  USER_HAS_PHONE_FILTER_IDENTIFIER,
  TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
  FIRST_PURCHASE_FILTER_IDENTIFIER,
  REFERRER_FILTER_IDENTIFIER,
  REFERRED_MEMBERS_FILTER_IDENTIFIER,
} from '@bsport/common/lib/master-data/smart-list.js';

import { createUrl } from '#src/utils/createUrlHandlers';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#src/components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#src/components/analytics/segment';
import { UPSELL_IDENTIFIER_CUSTOM_APP } from '#src/libs/platform-billing/upsell-identifiers';
import CommunicationScheduledItem from '#src/libs/smart-list/components/communication_scheduled/CommunicationScheduledItem.component';
import CustomMobilePopupDialogDialog from '#src/libs/settings/components/CustomMobilePopupDialog.dialog';
// @ts-expect-error
import FilterCard from '#src/libs/smart-list/components/FilterListItem.component';
import GenericMuiDialog from '#src/components/genericDialog/GenericMuiDIalog';
import MemberBaseFilter from '#src/libs/smart-list/components/filters/MemberBaseFilter.component';
import ObjectLevelPermissionProviderComponent from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import SmartListPopupSendingDrawerComponent from '#src/libs/communication-v2/components/SmartListPopupSendingDrawer.component';
import SwitchHorizontalIcon from '#src/components/icons/SwitchHorizontalIcon.component';

import type { Cadence } from '#src/libs/sequential_marketing/types';
import type { CustomForm } from '#src/libs/custom-form/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { FetchRecipientsParams, Member } from '#src/libs/member/types';
import type { Level } from '#src/libs/level/types';
import type { PaymentPack } from '#src/libs/payment-packs/types';
import type {
  PrivatePass,
  PrivateService,
} from '#src/libs/private-service/types';
import type { SmartList } from '#src/libs/smart-list/types';
import type { UpsellSumup } from '#src/libs/company/types';
import type {
  CommunicationScheduled,
  SmartListPopupSending,
} from '#src/libs/communication-v2/types';
import type { OptionCallback } from '../../../state/types';

const { trackFormAdd, trackFormSubmitIntent, trackFormSuccess } =
  rudderStackFormTrackingFunctionsRegistry(
    SegmentAnalyticsFormObjectIdentifier.SmartlistFilter,
  );
const MEMBER_INFO = 1;
const PAYMENT_PACK = 2;
const BOOKING = 3;
const BUY = 4;

const filtersList = {
  [MEMBER_INFO]: [
    CREDIT_ACCOUNT_FILTER_IDENTIFIER,
    MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
    GENDER_FILTER_IDENTIFIER,
    TAG_FILTER_IDENTIFIER,
    USER_HAS_PASSWORD_FILTER,
    WAIVER_FILTER_IDENTIFIER,
    AGE_FILTER_IDENTIFIER,
    CUSTOM_FORMS_FILTER_IDENTIFIER,
    USER_MARKETING_NOTIFICATIONS_FILTER,
    NOTES_FILTER_IDENTIFIER,
    RELATIONS_FILTER_IDENTIFIER,
    USER_HAS_PHONE_FILTER_IDENTIFIER,
    TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
    REFERRER_FILTER_IDENTIFIER,
    REFERRED_MEMBERS_FILTER_IDENTIFIER,
  ],
  [BOOKING]: [
    BOOKINGS_NUMBER_FILTER_IDENTIFIER,
    BOOKINGS_FILTER_IDENTIFIER,
    FILTER_BOOKING_LAST,
    PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  ],
  [PAYMENT_PACK]: [
    PAYMENT_PACK_FILTER_IDENTIFIER,
    PRIVATE_PASS_FILTER_IDENTIFIER,
    ACTIVE_PASSES_FILTER_IDENTIFIER,
  ],
  [BUY]: [
    EXPENSES_COMPLETE_FILTER_IDENTIFIER,
    BASKET_ABANDONMENT_FILTER_IDENTIFIER,
    PAYMENT_METHOD_FILTER_IDENTIFIER,
    FIRST_PURCHASE_FILTER_IDENTIFIER,
  ],
};

const filtersCategory = [MEMBER_INFO, PAYMENT_PACK, BOOKING, BUY];

type Props = {
  cadences: Cadence[];
  classes: any;
  coaches: any[];
  communicationScheduledList: CommunicationScheduled[];
  communicationScheduledLoading: boolean;
  communicationScheduledTotal: number;
  csvExportDate: string;
  csvExportLink: string;
  customForms: CustomForm[];
  customLevels: Level[];
  establishments: Establishment[];
  featureList: UpsellSumup[];
  fetchBulkItems: any;
  fetchItems: any;
  filters: any[];
  loading: boolean;
  memberList?: Member[];
  memberLoading: boolean;
  meta_activities: any[];
  payment_packs: PaymentPack[];
  private_passes: PrivatePass[];
  private_services: PrivateService[];
  smartList: any;
  smartListId: number;
  smartListPopupList: SmartListPopupSending[];
  smartListPopupLoading: boolean;
  tags: any[];
  cancelCommunicationScheduled: (
    communicationScheduled: CommunicationScheduled,
  ) => void;
  createFilter: (
    filter_identifier: number,
    filterData: any,
    options?: OptionCallback,
  ) => void;
  deleteFilter: (
    filterNameId: number,
    filterId: number,
    smartListId: number,
    options: OptionCallback & { callback: (id: number) => void },
  ) => void;
  editCommunicationScheduled: (
    communicationScheduled: CommunicationScheduled,
  ) => void;
  exportMemberTable: () => void;
  exportMemberTableBackground: () => void;
  fetchCommunicationsPaginatedMembers: (params: FetchRecipientsParams) => void;
  onRequestEmail: () => void;
  sendSmartListPopup: (param: {
    id: string;
    values: FormData;
    options?: OptionCallback;
  }) => void;
  deleteSmartListPopup: (
    customAppPopupLinkId: number,
    options?: OptionCallback,
  ) => void;
  smartListUpdate: (id: number, smartlist: SmartList) => void;
  updateFilter: (
    filterNameId: number,
    filterId: number,
    data: any,
    options?: OptionCallback,
  ) => void;
  viewAllCommunicationScheduled: () => void;
} & WithTranslation;

type State = {
  anchorEl: HTMLElement;
  displayAddFilter: boolean;
  displayCategoryFilters: any;
  displayFilters: boolean;
  displayNextScheduledMessage: boolean;
  isSmartListExporting: boolean;
  new_filter: any;
  openCadenceListDialog: boolean;
  openCustomMobilePopupDialog: boolean;
  openSmartListPopupHistoryDialog: boolean;
};
export class FiltersPanel extends Component<Props, State> {
  state: State = {
    anchorEl: null,
    displayAddFilter: false,
    displayCategoryFilters: null,
    displayFilters: true,
    displayNextScheduledMessage: true,
    isSmartListExporting: false,
    new_filter: null,
    openCadenceListDialog: false,
    openCustomMobilePopupDialog: false,
    openSmartListPopupHistoryDialog: false,
  };

  handleFilterChange = (filter: any) => {
    this.setState({
      new_filter: {
        filter_identifier: filter,
      },
    });
    this.setState((previousState) => ({
      displayAddFilter: !previousState.displayAddFilter,
    }));
  };

  cancelFilter = () => {
    this.setState({ new_filter: null });
  };

  createFilter = (filterNameId: number, data: any) => {
    trackFormAdd();

    this.setState({ new_filter: null, displayFilters: true });
    this.props.createFilter(filterNameId, data, {
      onSuccess: () => {
        trackFormSuccess();
      },
    });
  };

  updateFilter = (filterNameId: number, filterId: number, data: any) => {
    trackFormSubmitIntent(filterId);

    this.props.updateFilter(filterNameId, filterId, data, {
      onSuccess: () => {
        trackFormSuccess(filterId);
      },
    });
  };

  exportSmartList = async () => {
    this.setState({ isSmartListExporting: true });
    const response = await this.props.exportMemberTable();
    // @ts-expect-error
    const blob = new Blob([response.data], { type: 'xlsx' });
    const url = createUrl(blob);
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = url;
    link.download = `${
      this.props.smartList.name
    }_${DateTime.now().toISODate()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.setState({ isSmartListExporting: false });
  };

  exportSmartlistBackground = this.props.exportMemberTableBackground;

  openCustomMobilePopupDialog = () =>
    this.setState({ openCustomMobilePopupDialog: true });

  closeCustomMobilePopupDialog = () =>
    this.setState({ openCustomMobilePopupDialog: false });

  openSmartListPopupHistoryDialog = () =>
    this.setState({ openSmartListPopupHistoryDialog: true });

  closeSmartListPopupHistoryDialog = () =>
    this.setState({ openSmartListPopupHistoryDialog: false });

  onSmartListPopupSend = (param: {
    id: string;
    values: FormData;
    options?: OptionCallback;
  }) => {
    this.closeCustomMobilePopupDialog();
    this.props.sendSmartListPopup(param);
  };

  onSmartListPopupDelete = (
    customAppPopupLinkId: number,
    options?: OptionCallback,
  ) => {
    this.props.deleteSmartListPopup(customAppPopupLinkId, options);
  };

  openCadencesDialog = () => {
    this.setState({ openCadenceListDialog: true });
  };

  closeCadencesDialog = () => {
    this.setState({ openCadenceListDialog: false });
  };

  changeDisplayFilters = () =>
    this.setState((previousState) => ({
      displayFilters: !previousState.displayFilters,
    }));

  changeDisplayNextScheduledMessage = () =>
    this.setState((previousState) => ({
      displayNextScheduledMessage: !previousState.displayNextScheduledMessage,
    }));

  openCsvExportLink = () => window.open(this.props.csvExportLink);

  addFilterOnClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const anchorEl = event.currentTarget;

    trackFormAdd();
    this.setState((previousState) => ({
      anchorEl,
      displayAddFilter: !previousState.displayAddFilter,
    }));
  };

  handleCancelCommunicationScheduled =
    (communication: CommunicationScheduled) => () =>
      this.props.cancelCommunicationScheduled(communication);

  handleEditCommunicationScheduled =
    (communication: CommunicationScheduled) => () =>
      this.props.editCommunicationScheduled(communication);

  render() {
    const { classes, t, filters } = this.props;

    const hasCustomAppUpsell = memoize((featureList: Array<UpsellSumup>) =>
      featureList
        .map((feature) => feature.upsell_identifier)
        .includes(UPSELL_IDENTIFIER_CUSTOM_APP),
    );

    const sanitizedCSVExportDate = this.props.csvExportDate
      ? DateTime.fromSeconds(parseInt(this.props.csvExportDate))
      : DateTime.now();

    return (
      <div>
        <div className={classes.buttonsRow}>
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="member.allowed_actions.communication"
          >
            <div className={classes.sendCommunicationButtons}>
              <Button
                className={classes.sendEmailButton}
                color="secondary"
                onClick={this.props.onRequestEmail}
                variant="contained"
              >
                <SendIcon className={this.props.classes.leftIcon} />
                {t('mail.sendMail')}
              </Button>
              {this.props.smartList?.has_active_communication_group_configs && (
                <Chip
                  icon={<EmailIcon />}
                  label={t('usedInFranchiseCommmunication')}
                />
              )}
              {hasCustomAppUpsell(this.props.featureList) && (
                <div className={classes.smartListPopupButtonContainer}>
                  <Button
                    className={classes.smartListPopupButton}
                    color="secondary"
                    onClick={this.openCustomMobilePopupDialog}
                    variant="outlined"
                  >
                    <SmartphoneIcon className={this.props.classes.leftIcon} />
                    {t('popup.sendPopup')}
                  </Button>
                  <IconButton
                    className={classes.smartListPopupListButton}
                    color="primary"
                    onClick={this.openSmartListPopupHistoryDialog}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </div>
              )}
            </div>
          </ObjectLevelPermissionWrapper>
          <CustomMobilePopupDialogDialog
            initial={null}
            onClose={this.closeCustomMobilePopupDialog}
            onSubmit={this.onSmartListPopupSend}
            open={this.state.openCustomMobilePopupDialog}
          />
          <SmartListPopupSendingDrawerComponent
            fetchMembers={this.props.fetchCommunicationsPaginatedMembers}
            loading={this.props.smartListPopupLoading}
            memberLoading={this.props.memberLoading}
            membersToDisplay={this.props.memberList}
            onClose={this.closeSmartListPopupHistoryDialog}
            onSmartListPopupDelete={this.props.deleteSmartListPopup}
            open={this.state.openSmartListPopupHistoryDialog}
            smartListId={this.props.smartListId}
            smartListPopupList={this.props.smartListPopupList}
          />
          <div className={classes.exportButtonsContainer}>
            <div>
              <Button
                className={classes.actionButton}
                color="secondary"
                disabled={this.state.isSmartListExporting}
                onClick={this.exportSmartlistBackground}
                variant="outlined"
              >
                {t('generateExport')}
              </Button>
              <ObjectLevelPermissionProviderComponent requiredPermission="export.allowed_actions.smartlist">
                {(hasPermission: boolean) =>
                  hasPermission && (
                    <Button
                      className={classes.actionButton}
                      color="secondary"
                      disabled={!this.props.csvExportLink}
                      onClick={this.openCsvExportLink}
                      variant="contained"
                    >
                      {this.state.isSmartListExporting ? (
                        <CircularProgress
                          className={this.props.classes.leftIcon}
                          color="secondary"
                          size={25}
                        />
                      ) : (
                        <CloudDownloadIcon
                          className={this.props.classes.leftIcon}
                        />
                      )}
                      {t('exportList')}
                    </Button>
                  )
                }
              </ObjectLevelPermissionProviderComponent>
            </div>
            <Typography>
              {this.props.csvExportLink
                ? t('lastGenerated', {
                    date: sanitizedCSVExportDate.toFormat('D'),
                    time: sanitizedCSVExportDate.toFormat('t'),
                  })
                : t('generateHelperText')}
            </Typography>
          </div>

          <Menu
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            className={classes.filtersMenu}
            getContentAnchorEl={null}
            onClose={() =>
              this.setState((previousState) => ({
                displayAddFilter: !previousState.displayAddFilter,
              }))
            }
            open={this.state.displayAddFilter}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            {filtersCategory.map((key: number) => (
              <div key={key}>
                <ListItem
                  key={key}
                  button
                  className={this.props.classes.menu}
                  onClick={() => {
                    if (this.state.displayCategoryFilters === key) {
                      this.setState({
                        displayCategoryFilters: null,
                      });
                    } else {
                      this.setState({
                        displayCategoryFilters: key,
                      });
                    }
                  }}
                >
                  <ListItemText
                    primary={`${t(`filterCategory.${key}`)} (${
                      // @ts-expect-error
                      filtersList[key].length
                    })`}
                  />
                  {this.state.displayCategoryFilters === key ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItem>
                <Collapse
                  key={`${key}-collapse`}
                  unmountOnExit
                  in={this.state.displayCategoryFilters === key}
                  timeout="auto"
                >
                  <List
                    disablePadding
                    className={this.props.classes.nestedList}
                  >
                    {
                      // @ts-expect-error
                      filtersList[key].map((filter: any) => (
                        <ListItem
                          key={filter}
                          button
                          className={this.props.classes.menu}
                          onClick={() => this.handleFilterChange(filter)}
                        >
                          <ListItemText
                            primary={t(`filters.${filter}.name`)}
                            secondary={t(`filters.${filter}.explanation`, {
                              currencyDisplay: getCurrencyDisplay(),
                            })}
                          />
                        </ListItem>
                      ))
                    }
                  </List>
                </Collapse>
              </div>
            ))}
          </Menu>
        </div>

        {this.props.cadences && this.props.cadences.length > 0 && (
          <div className={this.props.classes.cadenceChipContainer}>
            <ButtonBase
              className={classes.cadenceChip}
              color="secondary"
              disabled={this.props.cadences.length === 1}
              onClick={this.openCadencesDialog}
            >
              <SwitchHorizontalIcon className={this.props.classes.leftIcon} />
              {this.props.cadences.length > 1
                ? t('audience.content_plural', {
                    count: this.props.cadences.length,
                  })
                : t('audience.content', {
                    workflow_name: this.props.cadences[0]?.name ?? '',
                  })}
            </ButtonBase>
          </div>
        )}

        <ButtonBase
          className={this.props.classes.header}
          onClick={this.changeDisplayNextScheduledMessage}
        >
          <div className={this.props.classes.sectionTitle}>
            <Typography
              color={
                this.state.displayNextScheduledMessage
                  ? 'initial'
                  : 'textSecondary'
              }
              variant="h6"
            >
              {t('communication.scheduled.nextScheduledMessage')}
            </Typography>
            {this.props.communicationScheduledLoading && (
              <CircularProgress size="1.5rem" />
            )}
          </div>
          {this.state.displayNextScheduledMessage ? (
            <ExpandLessIcon />
          ) : (
            <ExpandMoreIcon />
          )}
        </ButtonBase>
        <Divider className={this.props.classes.divider} />
        <Collapse
          className={this.props.classes.scheduledCollapseSection}
          in={this.state.displayNextScheduledMessage}
        >
          {!this.props.communicationScheduledLoading &&
            (this.props.communicationScheduledList &&
            this.props.communicationScheduledList?.length > 0 ? (
              <>
                <CommunicationScheduledItem
                  communicationScheduled={
                    this.props.communicationScheduledList[0]
                  }
                  deleteCommunication={this.handleCancelCommunicationScheduled(
                    this.props.communicationScheduledList[0],
                  )}
                  editCommunication={this.handleEditCommunicationScheduled(
                    this.props.communicationScheduledList[0],
                  )}
                />
                <div
                  className={this.props.classes.scheduledCommunicationBottom}
                >
                  <Button
                    color="primary"
                    onClick={this.props.viewAllCommunicationScheduled}
                    variant="outlined"
                  >
                    {t('communication.scheduled.viewAll')}
                    <ArrowRightIcon className={this.props.classes.iconButton} />
                  </Button>
                  <Typography color="textSecondary" variant="body2">
                    {this.props.t('communication.scheduled.total', {
                      count: this.props.communicationScheduledTotal,
                    })}
                  </Typography>
                </div>
              </>
            ) : (
              <div className={this.props.classes.row}>
                <InfoOutlinedIcon className={this.props.classes.leftIcon} />
                <Typography
                  className={this.props.classes.isEmptyText}
                  color="textSecondary"
                >
                  {this.props.t('communication.scheduled.isEmpty')}
                </Typography>
              </div>
            ))}
        </Collapse>

        <ButtonBase
          className={this.props.classes.header}
          onClick={this.changeDisplayFilters}
        >
          {this.props.loading ? (
            <div className={this.props.classes.sectionTitle}>
              <Typography
                color={this.state.displayFilters ? 'initial' : 'textSecondary'}
                variant="h6"
              >
                {`${t('filters.active_filters')}`}
              </Typography>
              <CircularProgress size="1.5rem" />
            </div>
          ) : (
            <Typography
              color={this.state.displayFilters ? 'initial' : 'textSecondary'}
              variant="h6"
            >
              {`${t('filters.active_filters')} (${filters.length})`}
            </Typography>
          )}
          {this.state.displayFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ButtonBase>
        <Divider className={this.props.classes.divider} />
        <Collapse in={this.state.displayFilters}>
          <Button
            className={classes.actionButton}
            color="primary"
            disabled={this.state.new_filter}
            onClick={this.addFilterOnClick}
            variant="contained"
          >
            <FilterListIcon className={this.props.classes.leftIcon} />
            {t('filters.add_filter')}
          </Button>
          <Paper>
            <MemberBaseFilter
              smartlist={this.props.smartList}
              smartListUpdate={this.props.smartListUpdate}
            />
            <List
              disablePadding
              className={classes.filterPanel}
              component="nav"
            >
              {filters.map((filter) => (
                <FilterCard
                  key={`${filter.id}-${filter.filter_identifier}`}
                  coaches={this.props.coaches}
                  customForms={this.props.customForms}
                  customLevels={this.props.customLevels}
                  establishments={this.props.establishments}
                  fetchBulkItems={this.props.fetchBulkItems}
                  fetchItems={this.props.fetchItems}
                  filter={filter}
                  meta_activities={this.props.meta_activities}
                  onClickDelete={this.props.deleteFilter}
                  onClickEdit={this.updateFilter}
                  payment_packs={this.props.payment_packs}
                  private_passes={this.props.private_passes}
                  private_services={this.props.private_services}
                  tags={this.props.tags}
                />
              ))}
              {this.state.new_filter ? (
                <FilterCard
                  isNew
                  coaches={this.props.coaches}
                  customForms={this.props.customForms}
                  customLevels={this.props.customLevels}
                  establishments={this.props.establishments}
                  fetchBulkItems={this.props.fetchBulkItems}
                  fetchItems={this.props.fetchItems}
                  filter={this.state.new_filter}
                  meta_activities={this.props.meta_activities}
                  onClickCreate={this.createFilter}
                  onClickDelete={this.cancelFilter}
                  payment_packs={this.props.payment_packs}
                  private_passes={this.props.private_passes}
                  private_services={this.props.private_services}
                  tags={this.props.tags}
                />
              ) : null}
            </List>
          </Paper>
          {!filters.length && !this.props.loading && (
            <div className={this.props.classes.row}>
              <InfoOutlinedIcon className={this.props.classes.leftIcon} />
              <Typography
                className={this.props.classes.isEmptyText}
                color="textSecondary"
              >
                {this.props.t('filters.isEmpty')}
              </Typography>
            </div>
          )}
        </Collapse>
        {this.state.openCadenceListDialog && (
          <GenericMuiDialog
            cancelText={t('cadenceListDialog.close')}
            content={this.props.cadences?.map((cadence) => cadence?.name)}
            onCancel={this.closeCadencesDialog}
            open={this.state.openCadenceListDialog}
            title={t('audienceListDialog.title')}
          />
        )}
      </div>
    );
  }
}

const styles = createStyles((theme: Theme) => ({
  menu: {
    width: '300px',
  },
  cadenceChipContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: theme.spacing(4),
  },
  cadenceChip: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.grey[300],
    borderRadius: '4px',
    padding: '2px',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  header: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: theme.spacing(4),
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  divider: {
    marginTop: theme.spacing(1),
  },
  textField: {
    marginTop: theme.spacing(2),
  },
  filterPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterSelect: {
    marginLeft: theme.spacing(1),
  },
  actionButton: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  sendEmailButton: {
    marginTop: theme.spacing(1),
  },
  buttonsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  nestedList: {
    backgroundColor: '#F8F8F8',
    borderLeft: `4px solid ${theme.palette.primary.main}`,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: theme.spacing(2),
  },
  smartListPopupButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
  smartListPopupButton: {
    height: 'fit-content',
  },
  smartListPopupListButton: {
    padding: 0,
  },
  sendCommunicationButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  exportButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  filtersMenu: {
    maxHeight: `calc(100% - 392px)`,
  },
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  scheduledCommunicationBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduledCollapseSection: {
    paddingTop: theme.spacing(2),
  },
}));

export default compose(
  withStyles(styles),
  withTranslation(['smartList']),
)(FiltersPanel);
