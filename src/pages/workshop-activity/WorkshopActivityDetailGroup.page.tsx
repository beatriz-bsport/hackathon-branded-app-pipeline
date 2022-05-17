import { compose } from 'recompose';
import { withWidth } from '@material-ui/core';
import { connect } from 'react-redux';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import { workshopActivityGroupConnector } from './WorkshopActivityGroup.page';
import WorkshopActivityGroup from './WorkshopActivityGroup.component';
import { getWorkshopDetailGroupFilter } from '#libs/user-preference/selectors';
import { setWorkshopDetailGroupFilter as setWorkshopDetailGroupFilterAction } from '#libs/user-preference/actions';
import { RootState } from '../../reducers';

export default compose(
  routerParamsToProps({
    selectedOfferId: 'selectedOfferId:number',
    id: 'metaActivityId',
  }),
  withWidth(),
  workshopActivityGroupConnector,
  connect(
    (state: RootState) => ({
      filter: getWorkshopDetailGroupFilter(state),
    }),
    {
      setWorkshopGroupFilter: setWorkshopDetailGroupFilterAction,
    },
  ),
)(WorkshopActivityGroup);
