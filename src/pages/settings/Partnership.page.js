// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { connect } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import flatten from 'lodash/flatten';

import themeSelector from '../../libs/theme/selectors';
import { getPartnershipByIdentifier } from '../../libs/partnership/selectors';
import {
  fetchPartnershipList,
  requestPartnership as requestPartnershipAction,
  updatePartnership,
} from '../../libs/partnership/actions';
import { getAllPageEstablishments } from '../../libs/establishment/selectors';
import { fetchEstablishments } from '../../libs/establishment/actions';
import PartnershipConfigurationForm from '../../libs/partnership/components/PartnershipConfigurationForm.component';
import withTitle from '../../hocs/with-title.hoc';

type Props = {
  t: TFunction,
  classes: Object,
  classpass: ?Partnership,

  requestClasspassPartnership: () => void,
  fetchPartnershipList: () => void,
  updatePartnership: (id: number, data: any) => void,

  fetchEstablishments: () => void,
  establishmentList: Array<Establishment>,
  company: number,

  hasRequested: boolean,
  setHasRequested: (boolean) => void,

  isSubmitting: boolean,
  loading: boolean,
};

export class Partnership extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPartnershipList();
    this.props.fetchEstablishments();
  }

  updatePartnership = (data: any) => {
    this.props.updatePartnership(this.props.classpass.id, data);
  };

  render() {
    const { classpass, company, establishmentList } = this.props;
    let establishmentIdList = [];
    if (establishmentList && establishmentList.length) {
      if (classpass && classpass.associated_establishment_ids.length) {
        establishmentIdList = classpass.associated_establishment_ids;
      } else {
        establishmentIdList = flatten(
          establishmentList.map((e) => e.associatedestablishment_set),
        );
      }
    }
    return (
      <div className={this.props.classes.container}>
        {this.props.hasRequested ? (
          <Dialog open>
            <DialogContent>
              {this.props.t('requestDialog.explain')}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.props.setHasRequested(false)}>
                {this.props.t('requestDialog.close')}
              </Button>
            </DialogActions>
          </Dialog>
        ) : null}
        <Typography
          className={this.props.classes.paper}
          variant="h5"
          component="h3"
        >
          ClassPass
        </Typography>
        {this.props.isSubmitting ? <LinearProgress /> : null}
        <Paper className={this.props.classes.paper}>
          {this.props.loading || this.props.establishmentList.length === 0 ? (
            <CircularProgress />
          ) : (
            <div className={this.props.classes.column}>
              <Typography variant="body">
                {this.props.t('parameters.companyId', { company })}
              </Typography>
              <Typography variant="body">
                {this.props.t('parameters.establishmentId', {
                  establishmentIdList: establishmentIdList.join(', '),
                })}
              </Typography>
              {this.props.classpass ? (
                <PartnershipConfigurationForm
                  establishmentList={this.props.establishmentList}
                  initial={this.props.classpass}
                  onSubmit={this.updatePartnership}
                  iSubmitting={this.props.isSubmitting}
                />
              ) : (
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={this.props.classes.requestButton}
                    onClick={this.props.requestClasspassPartnership}
                  >
                    {this.props.t('actions.requestPartnership')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  requestButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default compose(
  withTranslation(['partnership']),
  withTitle(({ t }) => t('pageTitle')),
  withStyles(styles),
  withState('hasRequested', 'setHasRequested', false),
  connect(
    (state) => ({
      classpass: getPartnershipByIdentifier(state, 'classpass'),
      company: themeSelector.getTheme(state).company,
      establishmentList: getAllPageEstablishments(state),
      isSubmitting: state.partnership.createOrUpdate.loading,
      loading: state.partnership.loading,
    }),
    {
      fetchPartnershipList,
      fetchEstablishments,
      updatePartnership,
      requestPartnership: requestPartnershipAction,
    },
  ),
  withHandlers({
    requestClasspassPartnership: ({
      requestPartnership,
      setHasRequested,
    }) => () => {
      requestPartnership('classpass', {
        onSuccess: () => setHasRequested(true),
      });
    },
  }),
)(Partnership);
