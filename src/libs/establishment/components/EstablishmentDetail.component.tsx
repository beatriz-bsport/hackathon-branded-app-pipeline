import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import SPORTS from '@bsport/common/lib/master-data/sports';
import Paper from '@material-ui/core/Paper';
import { WithTranslation, withTranslation } from 'react-i18next';

import { DateTime } from 'luxon';
import TypographyMultiline from '../../../components/typo/TypographyMultiline.component';

import type { Establishment, Offer } from '../../../api/types';

// @ts-expect-error
import TimeTable from '../../../components/offer/TimeTable.component';
import Calendar from '../../../components/offer/Calendar.component';
// @ts-expect-error
import Map from '../../../components/map/Map.component';
import BookingCreationNotification from '../../booking/components/BookingCreationNotification.component';
// @ts-expect-error
import EasyAccessStack from '../../category/components/EasyAccessStack.component';
import EstablishmentSpotScheduling from './EstablishmentSpotScheduling.component';
import { RoomBlueprint } from '../../spot-scheduling/types';
import { MaterialStyleType } from '../../../utils/types';
import { centerMarker } from '../../../components/map/utils';
import { SmartList } from '#libs/smart-list/types';
import { getMergeTags } from '#libs/marketing/utils';
import { ResolvedGenericTags } from '#libs/email-editor/types';

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
  events: Array<Offer>;
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
  goToSmartlist: () => void;
  getSmartLists: () => void;
  smartLists: SmartList[];
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  selectedDay: { [establishmentId: number]: DateTime };
};

export class EstablishmentDetail extends Component<Props, State> {
  state: State = {
    selectedDay: {},
  };

  onDateClick = (establishmentId: number) => (date: string) => {
    const dateTime = DateTime.fromISO(date);
    const { selectedDay } = this.state;
    selectedDay[establishmentId] = dateTime.startOf('day');
    this.setState({ selectedDay });
    this.props.fetchOffersByDay(dateTime);
  };

  goToOffer = (o: Offer) => this.props.goToOffer(o.id);

  renderCalendar = (establishment: Establishment) => {
    const { offers, timetableLoading, events } = this.props;
    const { selectedDay } = this.state;
    return (
      <div>
        <Calendar
          forceMonthDisplay
          date={(selectedDay[establishment.id] || DateTime.now()).toISODate()}
          events={events.reduce((acc, offer) => {
            const midnight = DateTime.fromISO(offer.date_start).startOf('day');
            if (Object.hasOwnProperty.call(events, midnight)) {
              // @ts-expect-error
              acc[midnight].push(offer);
              return acc;
            }
            // @ts-expect-error
            acc[midnight] = [offer];
            return acc;
          }, {})}
          onDateChange={this.onDateClick(establishment.id)}
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
    const sport = SPORTS.find((s) => s.id === DEFAULT_SPORT);
    return (
      <div>
        <Grid container direction="row">
          <Grid item md={6} xs={12}>
            <div className={classes.imgBackground}>
              {!establishment?.cover ? (
                <img alt="sport" src={sport?.icon} />
              ) : (
                <img
                  alt="establishment-cover"
                  className={classes.imgStyle}
                  src={establishment.cover}
                />
              )}
            </div>
          </Grid>

          <Grid item md={6} xs={12}>
            <Map center={center} markerClicked={() => {}} markers={markers} />
          </Grid>

          <Grid container direction="row">
            <Grid item className={classes.generalInfoBlock} md={6} sm={12}>
              <Paper>
                <div className={classes.paperContent}>
                  <Typography gutterBottom variant="h4">
                    {establishment.title}
                  </Typography>
                  <Typography
                    gutterBottom
                    color="textSecondary"
                    variant="subtitle2"
                  >
                    {t('capacity.explain', {
                      // @ts-expect-error
                      count: establishment.capacity,
                      // @ts-expect-error
                      capacity: establishment.capacity,
                    })}
                  </Typography>
                  <EasyAccessStack
                    className={classes.easyAccess}
                    // @ts-expect-error
                    lines={establishment.easy_access.lines}
                    // @ts-expect-error
                    name={establishment.easy_access.name}
                    size="xs"
                  />
                  <Typography variant="caption">
                    {establishment.location.address}
                  </Typography>
                  <div className={classes.descriptionBlock}>
                    <Typography gutterBottom variant="h5">
                      {t('description')}
                    </Typography>
                    <TypographyMultiline>
                      {establishment.specific_info}
                    </TypographyMultiline>
                  </div>
                </div>

                <EstablishmentSpotScheduling
                  onClickCreate={this.props.onCreateRoomBlueprint}
                  onClickDelete={this.props.onDeleteRoomBlueprint}
                  onClickEdit={this.props.onEditRoomBlueprint}
                  onClickPreview={this.props.onPreviewRoomBlueprint}
                  roomBlueprints={this.props.roomBlueprints}
                />
              </Paper>
              <BookingCreationNotification
                // @ts-expect-error
                createNotification={this.props.createNotification}
                deleteNotification={this.props.deleteNotification}
                emailDetailLoading={this.props.emailDetailLoading}
                emailDetails={this.props.emailDetails}
                emailListLoading={this.props.emailListLoading}
                emails={this.props.emails}
                getEmailDetail={this.props.getEmailDetail}
                getEmails={this.props.getEmails}
                getSmartLists={this.props.getSmartLists}
                goToSmartlist={this.props.goToSmartlist}
                identifier="establishment"
                notifications={this.props.notifications}
                objectId={this.props.establishment.id}
                resolvedGenericTags={this.props.resolvedGenericTags}
                smartLists={this.props.smartLists}
                tags={getMergeTags(this.props.tags, t)}
                updateNotification={this.props.updateNotification}
              />
            </Grid>
            <Grid item className={classes.calendarBlock} md={6} sm={12}>
              <Paper>{this.renderCalendar(establishment)}</Paper>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

// @ts-expect-error
const styles = (theme) => ({
  noMoreOffersMessage: {
    margin: theme.spacing(2),
  },
  imgBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    height: '100%',
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
  // @ts-expect-error
  withStyles(styles)(EstablishmentDetail),
);
