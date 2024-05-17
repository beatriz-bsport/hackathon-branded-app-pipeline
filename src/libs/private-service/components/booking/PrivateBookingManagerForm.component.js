// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Immutable from 'seamless-immutable';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import { InlineDateTimePicker } from 'material-ui-pickers';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import { withTranslation, TFunction } from 'react-i18next';

import { DateTime } from 'luxon';
import MemberSearchModal from '../../../member/components/MemberSearchModal.component';
import MemberMinimalListItem from '../../../member/components/MemberMinimalListItem.component';
import CoachInput from '../../../../components/input/CoachInput.component';

import PrivateSlotSelectorSimple from '../slot/PrivateSlotSelectorSimple.component';
import PrivateServiceSelector from '../service/PrivateServiceSelector.component';
import PrivateConsumerPassBookerListItem from '../booking-module/PrivateConsumerPassBookerListItem.component';
import PrivatePassBookerListItem from '../booking-module/PrivatePassBookerListItem.component';
import type {
  PrivatePass,
  PrivateService,
  PrivateConsumerPass,
} from '../../types';

type Props = {
  t: TFunction,
  classes: Object,

  fetchPass: (privateSlotId: number, memberId: number) => void,
  date: string,
  compatiblePrivateConsumerPass: Array<PrivateConsumerPass>,
  compatiblePrivatePass: Array<PrivatePass>,
  privateServiceList: Array<PrivateService>,
  searchLoading: boolean,
  searchMembers: (string) => void,
  searchedMembers: Array<Member>,

  registerPrivateBooking: ({
    private_consumer_pass: number,
    private_slot: number,
    coach: number,
    date_Start: string,
  }) => void,

  associatedCoachList: Array<Coach>,
  compatiblePassLoading: boolean,
  initial?: { member: ?Member, coachId: ?number },
  onClose: () => void,
  processing: boolean,
  billMemberPrivatePass: (memberId: number, privatePassId: number) => void,

  showVaccinationStatus: boolean,
};

type State = {
  member: ?Member,
  coach: ?number,
  privateServiceId: ?number,
  privateSlotId: ?number,
  date: DateTime,
  privateConsumerPassNeedRefresh: boolean,
  address: string,
};

export class PrivateBookingManagerForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let member = null;
    let coachId = null;
    if (props.initial && props.initial.member) {
      // eslint-disable-next-line
      member = props.initial.member;
    }
    if (props.initial && props.initial.coachId) {
      // eslint-disable-next-line
      coachId = props.initial.coachId;
    }
    this.state = {
      member,
      coachId,
      date: DateTime.fromISO(props.date),
      privateServiceId: null,
      privateSlotId: null,
      address: '',
      privateConsumerPassNeedRefresh: false,
    };
  }

  handleCoachChange = (ev: SyntheticEvent<HTMLElement>) => {
    if (ev) {
      this.setState({
        coachId: ev.target.value,
        privateSlotId: null,
        privateServiceId: null,
      });
    } else {
      this.setState({
        coachId: null,
        privateSlotId: null,
        privateServiceId: null,
      });
    }
  };

  handleSlotChange = (privateSlotId: number) => {
    if (privateSlotId) {
      this.props.fetchPass(privateSlotId, this.state.member.id);
      this.setState({ privateSlotId });
    }
  };

  renderPassList = () => {
    if (this.state.coachId && this.state.privateSlotId) {
      return (
        <React.Fragment>
          <Typography className={this.props.classes.sectionTitle} variant="h6">
            {this.props.t(
              'privateBooking.managerAdd.compatiblePrivateConsumerPass',
            )}
          </Typography>
          {this.state.privateConsumerPassNeedRefresh ? (
            <div className={this.props.classes.refreshButtonContainer}>
              <Button
                onClick={() => {
                  this.props.fetchPass(
                    this.state.privateSlotId,
                    this.state.member.id,
                  );
                  this.setState({ privateConsumerPassNeedRefresh: false });
                }}
                variant="outlined"
              >
                <RefreshIcon className={this.props.classes.leftIcon} />
                {this.props.t(
                  'privateBooking.managerAdd.privateConsumerPassNeedRefresh',
                )}
              </Button>
            </div>
          ) : (
            <List disablePadding>
              {this.props.compatiblePrivateConsumerPass.map((pcp) => (
                <PrivateConsumerPassBookerListItem
                  key={pcp.id}
                  onBook={() => {
                    this.props.registerPrivateBooking({
                      private_consumer_pass: pcp.id,
                      private_slot: this.state.privateSlotId,
                      coach: this.state.coachId,
                      date_start: this.state.date.toFormat('yyyy/MM/dd HH:mm'),
                      address: this.state.address,
                    });
                  }}
                  private_consumer_pass={pcp}
                />
              ))}
            </List>
          )}
          {this.props.compatiblePrivateConsumerPass.length === 0 &&
          !this.state.privateConsumerPassNeedRefresh ? (
            <Typography color="textSecondary">
              {this.props.t(
                'privateBooking.managerAdd.emptyPrivateConsumerPass',
              )}
            </Typography>
          ) : null}
          <Typography className={this.props.classes.sectionTitle} variant="h6">
            {this.props.t('privateBooking.managerAdd.compatiblePrivatePass')}
          </Typography>
          <List disablePadding>
            {this.props.compatiblePrivatePass.map((pp) => (
              <PrivatePassBookerListItem
                key={pp.id}
                onClick={() => {
                  this.props.billMemberPrivatePass(this.state.member.id, pp.id);
                  this.setState({ privateConsumerPassNeedRefresh: true });
                }}
                private_pass={pp}
              />
            ))}
          </List>
          {this.props.compatiblePrivatePass.length === 0 ? (
            <Typography color="textSecondary">
              {this.props.t('privateBooking.managerAdd.emptyPrivatePass')}
            </Typography>
          ) : null}
        </React.Fragment>
      );
    }
    return (
      <div className={this.props.classes.pleaseSelectStuff}>
        <InfoOutlinedIcon className={this.props.classes.infoIcon} />
        <Typography color="textSecondary">
          {this.props.t('privateBooking.managerAdd.pleaseSelectCoachAndSlot')}
        </Typography>
      </div>
    );
  };

  handleServiceChange = (privateServiceId: number) => {
    this.setState({ privateServiceId });
  };

  handleDateChange = (date: DateTime) => this.setState({ date });

  getSelectableServiceAndSlotForCoach = (coachId: number) => {
    const coachPrivateServices = this.props.privateServiceList.filter(
      (ps) => !coachId || ps.coaches.find((c) => c.id === coachId),
    );

    const selectedService = coachPrivateServices.find(
      (ps) => ps.id === this.state.privateServiceId,
    );
    const selectableSlots = selectedService
      ? selectedService.slots
      : Immutable([]);

    return [coachPrivateServices, selectableSlots];
  };

  renderAddressForm = (selectableService: Array<PrivateService>) => {
    if (this.state.privateServiceId) {
      const privateService = selectableService.find(
        (ps) => ps.id === this.state.privateServiceId,
      );
      if (
        privateService &&
        privateService.establishments &&
        !privateService.establishments.length
      ) {
        return (
          <TextField
            fullWidth
            multiline
            className={this.props.classes.addressField}
            label={this.props.t('privateBooking.managerAdd.address')}
            onChange={(ev) => this.setState({ address: ev.target.value })}
            rows={5}
            value={this.state.address}
            variant="outlined"
          />
        );
      }
    }
    return null;
  };

  render() {
    if (!this.state.member) {
      return (
        <MemberSearchModal
          asManager
          open
          handlMemberSelected={(id, member) => this.setState({ member })}
          loading={this.props.searchLoading}
          onClose={this.props.onClose}
          searchedMembers={this.props.searchedMembers}
          searchMembers={this.props.searchMembers}
        />
      );
    }

    const [selectableService, selectableSlots] =
      this.getSelectableServiceAndSlotForCoach(this.state.coachId);

    const { t } = this.props;
    return (
      <div>
        <DialogTitle>{t('privateBooking.managerAdd.title')}</DialogTitle>
        <DialogContent>
          <InlineDateTimePicker
            keyboard
            ampm={false}
            format="yyyy/MM/dd HH:mm"
            onChange={this.handleDateChange}
            onError={console.error}
            value={this.state.date}
          />
          <MemberMinimalListItem
            member={this.state.member}
            showVaccinationStatus={this.props.showVaccinationStatus}
          />
          <CoachInput
            required
            choices={this.props.associatedCoachList}
            label={this.props.t(
              'privateBooking.managerAdd.coachSelector.label',
            )}
            onChange={this.handleCoachChange}
            onDelete={() => this.handleCoachChange(null)}
            value={this.state.coachId}
          />
          <PrivateServiceSelector
            isDisabled={!this.state.coachId}
            onChange={this.handleServiceChange}
            privateServiceId={this.state.privateServiceId}
            privateServices={selectableService}
          />
          <PrivateSlotSelectorSimple
            isDisabled={!this.state.privateServiceId}
            onChange={this.handleSlotChange}
            privateSlotId={this.state.privateSlotId}
            privateSlots={selectableSlots}
          />
          {this.renderAddressForm(selectableService)}
          {this.props.compatiblePassLoading || this.props.processing ? (
            <LinearProgress className={this.props.classes.loadingContainer} />
          ) : (
            this.renderPassList()
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {t('privateBooking.managerAdd.cancel')}
          </Button>
        </DialogActions>
      </div>
    );
  }
}

const styles = (theme) => ({
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  loadingContainer: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  pleaseSelectStuff: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing(3),
  },
  infoIcon: {
    height: 40,
    width: 40,
    marginBottom: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  refreshButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addressField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['privateService']),
  withStyles(styles),
)(PrivateBookingManagerForm);
