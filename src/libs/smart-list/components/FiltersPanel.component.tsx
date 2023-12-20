// @ts-nocheck
import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import memoize from 'memoize-one';
import { compose } from 'recompose';

import type { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';
import moment from 'moment-timezone';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Divider from '@material-ui/core/Divider';
import ButtonBase from '@material-ui/core/ButtonBase';
import FilterListIcon from '@material-ui/icons/FilterList';
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
  FIRST_BOOKING_FILTER_IDENTIFIER,
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
} from '@bsport/common/lib/master-data/smart-list';

import { createUrl } from '../../../utils/createUrlHandlers';
import { getCurrencyDisplay } from '#libs/theme/selectors';
import { rudderStackFormTrackingFunctionsRegistry } from '#components/analytics/rudderstack/utils';
import { SegmentAnalyticsFormObjectIdentifier } from '#components/analytics/segment';
import { UPSELL_IDENTIFIER_CUSTOM_APP } from '#libs/platform-billing/upsell-identifiers';
import CustomMobilePopupDialogDialog from '#libs/settings/components/CustomMobilePopupDialog.dialog';
import FilterCard from './FilterListItem.component';
import GenericMuiDialog from '#components/genericDialog/GenericMuiDIalog';
import MemberBaseFilter from './filters/MemberBaseFilter.component';
import ObjectLevelPermissionProviderComponent from '#libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import SmartListPopupSendingDrawerComponent from '#libs/communication-v2/components/SmartListPopupSendingDrawer.component';
import SwitchHorizontalIcon from '#components/icons/SwitchHorizontalIcon.component';

import type { Cadence } from '#libs/sequential_marketing/types';
import type { CustomForm } from '#libs/custom-form/types';
import type { Establishment } from '#libs/establishment/types';
import type { FetchRecipientsParams, Member } from '#libs/member/types';
import type { Level } from '#libs/level/types';
import type { OptionCallback } from '../../../state/types';
import type { PaymentPack } from '#libs/payment-packs/types';
import type { PrivatePass, PrivateService } from '#libs/private-service/types';
import type { SmartList } from '#libs/smart-list/types';
import type { SmartListPopupSending } from '#libs/communication-v2/types';
import type { UpsellSumup } from '#libs/company/types';

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
  ],
  [BOOKING]: [
    FIRST_BOOKING_FILTER_IDENTIFIER,
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
  ],
};

const filtersCategory = [MEMBER_INFO, PAYMENT_PACK, BOOKING, BUY];

type Props = {
  smartListId: number;
  classes: any;
  loading: boolean;
  smartList: any;
  filters: Array<any>;
  payment_packs: Array<PaymentPack>;
  establishments: Array<Establishment>;
  meta_activities: Array<any>;
  private_passes: Array<PrivatePass>;
  private_services: Array<PrivateService>;
  tags: Array<any>;
  updateFilter: (
    filterNameId: number,
    filterId: number,
    data: any,
    options?: OptionCallback,
  ) => void;
  deleteFilter: (
    filterNameId: number,
    filterId: number,
    smartListId: number,
    options: OptionCallback & { callback: (id: number) => void },
  ) => void;
  createFilter: (
    filter_identifier: number,
    filterData: any,
    options?: OptionCallback,
  ) => void;
  onRequestEmail: () => void;
  exportMemberTable: () => void;
  exportMemberTableBackground: () => void;
  csvExportLink: string;
  csvExportDate: string;
  fetchItems: any;
  fetchBulkItems: any;
  coaches: Array<any>;
  smartListUpdate: (id: number, smartlist: SmartList) => void;
  customLevels: Level[];
  customForms: CustomForm[];
  sendSmartListPopup: (param: {
    id: string;
    values: FormData;
    options?: OptionCallback;
  }) => void;
  smartListPopupList: Array<SmartListPopupSending>;
  smartListPopupLoading: boolean;
  fetchCommunicationsPaginatedMembers: (params: FetchRecipientsParams) => void;
  memberLoading: boolean;
  memberList?: Array<Member>;
  featureList: Array<UpsellSumup>;
  cadences: Cadence[];
} & WithTranslation;

type State = {
  new_filter: any;
  displayFilters: boolean;
  displayAddFilter: boolean;
  displayCategoryFilters: any;
  isSmartListExporting: boolean;
  anchorEl: HTMLElement;
  openCustomMobilePopupDialog: boolean;
  openSmartListPopupHistoryDialog: boolean;
  openCadenceListDialog: boolean;
};
export class FiltersPanel extends Component<Props, State> {
  state: State = {
    new_filter: null,
    displayFilters: true,
    displayAddFilter: false,
    displayCategoryFilters: null,
    isSmartListExporting: false,
    anchorEl: null,
    openCustomMobilePopupDialog: false,
    openSmartListPopupHistoryDialog: false,
    openCadenceListDialog: false,
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
    const blob = new Blob([response.data], { type: 'xlsx' });
    const url = createUrl(blob);
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    link.href = url;
    link.download = `${this.props.smartList.name}_${moment().format(
      'YYYY-MM-DD',
    )}.csv`;
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

  openCadencesDialog = () => {
    this.setState({ openCadenceListDialog: true });
  };

  closeCadencesDialog = () => {
    this.setState({ openCadenceListDialog: false });
  };

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

  render() {
    const { classes, t, filters } = this.props;

    const hasCustomAppUpsell = memoize((featureList: Array<UpsellSumup>) =>
      featureList
        .map((feature) => feature.upsell_identifier)
        .includes(UPSELL_IDENTIFIER_CUSTOM_APP),
    );

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
                {(hasPermission) =>
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
                    date: moment.unix(this.props.csvExportDate).format('L'),
                    time: moment.unix(this.props.csvExportDate).format('LT'),
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
                    {filtersList[key].map((filter: any) => (
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
                    ))}
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
          onClick={() =>
            this.setState((previousState) => ({
              displayFilters: !previousState.displayFilters,
            }))
          }
        >
          {this.props.loading ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                color={this.state.displayFilters ? 'initial' : 'textSecondary'}
                style={{ marginRight: '10px' }}
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
                  new
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
}));

export default compose(
  withStyles(styles),
  withTranslation(['smartList']),
)(FiltersPanel);
