import { compose } from 'recompose';
import { withWidth } from '@material-ui/core';
import { connect } from 'react-redux';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { getWorkshopDetailGroupFilter } from '#src/libs/user-preference/selectors';
import { setWorkshopDetailGroupFilter as setWorkshopDetailGroupFilterAction } from '#src/libs/user-preference/actions';
import { workshopActivityGroupConnector } from './WorkshopActivityGroup.page';
import WorkshopActivityGroup from './WorkshopActivityGroup.component';
import { RootState } from '../../reducers';

export default compose(
  routerParamsToProps({
    selectedOfferId: 'selectedOfferId:number',
    // @ts-expect-error
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
