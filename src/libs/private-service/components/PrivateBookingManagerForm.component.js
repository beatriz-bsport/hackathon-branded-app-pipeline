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
import DialogTitle from '@material-ui/core/DialogTitle';
import InlineDateTimePicker from 'material-ui-pickers/DateTimePicker/DateTimePickerInline';
import RefreshIcon from '@material-ui/icons/Refresh';
import { compose } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import moment from 'moment';
import MemberSearchModal from '../../member/components/MemberSearchModal.component';
import MemberMinimalListItem from '../../member/components/MemberMinimalListItem.component';
import CoachInput from '../../../components/input/CoachInput.component';

import PrivateSlotSelectorSimple from './PrivateSlotSelectorSimple.component';
import PrivateServiceSelector from './PrivateServiceSelector.component';
import PrivateConsumerPassBookerListItem from './booking-module/PrivateConsumerPassBookerListItem.component';
import PrivatePassBookerListItem from './booking-module/PrivatePassBookerListItem.component';
import type {
  PrivatePass,
  PrivateService,
  PrivateConsumerPass,
} from '../types';

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
};

type State = {
  member: ?Member,
  coach: ?number,
  privateServiceId: ?number,
  privateSlotId: ?number,
  date: Object,
  privateConsumerPassNeedRefresh: boolean,
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
      date: moment(props.date),
      privateServiceId: null,
      privateSlotId: null,
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
          <Typography variant="h6" className={this.props.classes.sectionTitle}>
            {this.props.t(
              'privateBooking.managerAdd.compatiblePrivateConsumerPass',
            )}
          </Typography>
          {this.state.privateConsumerPassNeedRefresh ? (
            <div className={this.props.classes.refreshButtonContainer}>
              <Button
                variant="outlined"
                onClick={() => {
                  this.props.fetchPass(
                    this.state.privateSlotId,
                    this.state.member.id,
                  );
                  this.setState({ privateConsumerPassNeedRefresh: false });
                }}
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
                  private_consumer_pass={pcp}
                  onClick={() => {
                    this.props.registerPrivateBooking({
                      private_consumer_pass: pcp.id,
                      private_slot: this.state.privateSlotId,
                      coach: this.state.coachId,
                      date_start: this.state.date.format('YYYY/MM/DD HH:mm'),
                    });
                  }}
                  key={pcp.id}
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
          <Typography variant="h6" className={this.props.classes.sectionTitle}>
            {this.props.t('privateBooking.managerAdd.compatiblePrivatePass')}
          </Typography>
          <List disablePadding>
            {this.props.compatiblePrivatePass.map((pp) => (
              <PrivatePassBookerListItem
                private_pass={pp}
                onClick={() => {
                  this.props.billMemberPrivatePass(this.state.member.id, pp.id);
                  this.setState({ privateConsumerPassNeedRefresh: true });
                }}
                key={pp.id}
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

  handleDateChange = (date) => this.setState({ date });

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

  render() {
    if (!this.state.member) {
      return (
        <MemberSearchModal
          open
          loading={this.props.searchLoading}
          searchMembers={this.props.searchMembers}
          searchedMembers={this.props.searchedMembers}
          onClose={this.props.onClose}
          handlMemberSelected={(id, member) => this.setState({ member })}
        />
      );
    }

    const [
      selectableService,
      selectableSlots,
    ] = this.getSelectableServiceAndSlotForCoach(this.state.coachId);

    const { t } = this.props;
    return (
      <div>
        <DialogTitle>{t('privateBooking.managerAdd.title')}</DialogTitle>
        <DialogContent>
          <InlineDateTimePicker
            keyboard
            ampm={false}
            value={this.state.date}
            onChange={this.handleDateChange}
            onError={console.error}
            format="YYYY/MM/DD HH:mm"
          />
          <MemberMinimalListItem member={this.state.member} />
          <CoachInput
            required
            value={this.state.coachId}
            onChange={this.handleCoachChange}
            label={this.props.t(
              'privateBooking.managerAdd.coachSelector.label',
            )}
            choices={this.props.associatedCoachList}
            onDelete={() => this.handleCoachChange(null)}
          />
          <PrivateServiceSelector
            privateServices={selectableService}
            privateServiceId={this.state.privateServiceId}
            onChange={this.handleServiceChange}
            isDisabled={!this.state.coachId}
          />
          <PrivateSlotSelectorSimple
            privateSlots={selectableSlots}
            privateSlotId={this.state.privateSlotId}
            onChange={this.handleSlotChange}
            isDisabled={!this.state.privateServiceId}
          />
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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit,
  },
  loadingContainer: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit,
  },
  pleaseSelectStuff: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: theme.spacing.unit * 3,
  },
  infoIcon: {
    height: 40,
    width: 40,
    marginBottom: theme.spacing.unit * 2,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  refreshButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default compose(
  withNamespaces(['privateService']),
  withStyles(styles),
)(PrivateBookingManagerForm);
