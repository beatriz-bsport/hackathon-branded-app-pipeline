import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import SPORTS from '@bsport/common/lib/master-data/sports';
import Paper from '@material-ui/core/Paper';
import { WithTranslation, withTranslation } from 'react-i18next';
import Moment from 'moment-timezone';

import TypographyMultiline from '../../../components/TypographyMultiline.component';

import type { Establishment, Offer } from '../../../api/types';

import TimeTable from '../../../components/offer/TimeTable.component';
import Calendar from '../../../components/offer/Calendar.component';
import Map from '../../../components/map/Map.component';
import BookingCreationNotification from '../../booking/components/BookingCreationNotification.component';
import EasyAccessStack from '../../category/components/EasyAccessStack.component';
import EstablishmentSpotScheduling from './EstablishmentSpotScheduling.component';
import { DATE_FORMAT } from '../../../utils/datetime';
import { RoomBlueprint } from '../../spot-scheduling/types';
import { MaterialStyleType } from '../../../utils/types';
import { centerMarker } from '../../../components/map/utils';

const CENTER = [48.86, 2.33];
const DEFAULT_SPORT = 7;

type OwnProps = {
  timetableLoading: boolean;
  offers: Array<Offer>;
  fetchOffersByDay: (args: {
    year: number;
    month: number;
    day: number;
  }) => void;
  goToOffer: (offerId: number) => void;
  events: Array<Event>;
  establishment: Establishment;

  getEmails: () => void;
  emails: Array<any>;
  getEmailDetail: (id: number) => void;
  emailDetails: Array<any>;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  createNotification: (data: any) => void;
  updateNotification: (id: number, data: any) => void;
  deleteNotification: (notificationId: number) => void;
  notifications: { items: Array<any>; loading: boolean };
  onCreateRoomBlueprint: () => void;
  onEditRoomBlueprint: (r: RoomBlueprint) => void;
  onDeleteRoomBlueprint: (r: RoomBlueprint) => void;
  onPreviewRoomBlueprint: (r: RoomBlueprint) => void;
  roomBlueprints: RoomBlueprint[];
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  selectedDay: Object;
};

export class EstablishmentDetail extends Component<Props, State> {
  state = {
    selectedDay: {},
  };

  onDateClick = (establishmentId: number) => (date: string) => {
    const momentDay = Moment(date, DATE_FORMAT);
    const { selectedDay } = this.state;
    selectedDay[establishmentId] = momentDay.startOf('day');
    this.setState({ selectedDay });
    this.props.fetchOffersByDay(momentDay);
  };

  getCover = (establishment: Establishment) => {
    const { classes } = this.props;
    const { cover } = establishment;
    const sport = SPORTS.filter((s) => DEFAULT_SPORT === s.id)[0];

    if (!cover) {
      return (
        <Grid
          container
          alignItems="center"
          justify="center"
          className={classes.imgStyle}
        >
          <Grid item>
            <img src={sport.icon} alt="sport" />
          </Grid>
        </Grid>
      );
    }
    return (
      <img className={classes.imgStyle} src={cover} alt="establishment-cover" />
    );
  };

  goToOffer = (o: Offer) => this.props.goToOffer(o.id);

  renderCalendar = (establishment: Establishment) => {
    const { offers, timetableLoading, events } = this.props;
    const { selectedDay } = this.state;
    const events_ = {};
    for (const o of events || []) {
      const midnight = Moment(o.date_start).startOf('day');
      if (Object.hasOwnProperty.call(events_, midnight)) {
        events_[midnight].push(o);
      } else {
        events_[midnight] = [o];
      }
    }
    return (
      <div>
        <Calendar
          events={events_}
          forceMonthDisplay
          onDateClick={this.onDateClick(establishment.id)}
          date={(selectedDay[establishment.id] || Moment()).format(DATE_FORMAT)}
        />
        <TimeTable
          loading={timetableLoading}
          offers={offers}
          onOfferSelected={this.goToOffer}
        />
      </div>
    );
  };

  render() {
    const { classes, t, establishment } = this.props;
    const markers = [establishment];
    const center = markers && markers.length ? centerMarker(markers) : CENTER;
    return (
      <div>
        <Grid container direction="row">
          <Grid item xs={12} md={6} className={classes.imgBackground}>
            <Grid container direction="column">
              <Grid item xs={12} md={12}>
                {this.getCover(establishment)}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Map markers={markers} markerClicked={() => {}} center={center} />
          </Grid>

          <Grid container direction="row">
            <Grid item sm={12} md={6} className={classes.generalInfoBlock}>
              <Paper>
                <div className={classes.paperContent}>
                  <Typography variant="h4" gutterBottom>
                    {establishment.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {t('capacity.explain', {
                      count: establishment.capacity,
                      capacity: establishment.capacity,
                    })}
                  </Typography>
                  <EasyAccessStack
                    name={establishment.easy_access.name}
                    lines={establishment.easy_access.lines}
                    size="xs"
                    className={classes.easyAccess}
                  />
                  <Typography variant="caption">
                    {establishment.location.address}
                  </Typography>
                  <div className={classes.descriptionBlock}>
                    <Typography variant="h5" gutterBottom>
                      {t('description')}
                    </Typography>
                    <TypographyMultiline>
                      {establishment.specific_info}
                    </TypographyMultiline>
                  </div>
                </div>

                <EstablishmentSpotScheduling
                  roomBlueprints={this.props.roomBlueprints}
                  onClickCreate={this.props.onCreateRoomBlueprint}
                  onClickEdit={this.props.onEditRoomBlueprint}
                  onClickDelete={this.props.onDeleteRoomBlueprint}
                  onClickPreview={this.props.onPreviewRoomBlueprint}
                />
              </Paper>
              <BookingCreationNotification
                notifications={this.props.notifications}
                objectId={this.props.establishment.id}
                getEmails={this.props.getEmails}
                emails={this.props.emails}
                getEmailDetail={this.props.getEmailDetail}
                emailDetails={this.props.emailDetails}
                emailListLoading={this.props.emailListLoading}
                emailDetailLoading={this.props.emailDetailLoading}
                createNotification={this.props.createNotification}
                updateNotification={this.props.updateNotification}
                deleteNotification={this.props.deleteNotification}
                identifier="establishment"
              />
            </Grid>
            <Grid item sm={12} md={6} className={classes.calendarBlock}>
              <Paper>{this.renderCalendar(establishment)}</Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = (theme) => ({
  noMoreOffersMessage: {
    margin: theme.spacing(2),
  },
  imgBackground: {
    backgroundColor: '#f5f5f5',
  },
  imgStyle: {
    backgroundColor: 'rgba(50,50,50,.5)',
    minHeight: 200,
    maxHeight: 400,
    width: '100%',
    objectFit: 'cover',
    marginBottom: -6,
  },
  generalInfoBlock: {
    padding: theme.spacing(2),
    paddingLeft: 0,
  },
  calendarBlock: {
    padding: theme.spacing(2),
    paddingRight: 0,
    height: '100%',
  },
  descriptionBlock: {
    paddingTop: theme.spacing(2),
  },
  easyAccess: {
    marginBottom: theme.spacing(1),
  },
  paperContent: {
    padding: theme.spacing(2),
  },
});
export default withTranslation(['establishment'])(
  // @ts-ignore
  withStyles(styles)(EstablishmentDetail),
);
