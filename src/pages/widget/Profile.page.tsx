import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { MaterialStyleType, WithHandlerType } from '../../utils/types';
import { getMembership } from '../../libs/membership/selectors';
import { fetchMembershipListAsConsumer } from '../../libs/membership/actions';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ConsumerProfile from '../consumer/ConsumerProfile.page';
import { RootState } from '../../reducers';

type OwnProps = {
  companyId: number;
  companyName: string;
};
type OwnAndConnectedProps = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

type Props = OwnAndConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation &
  WithHandlerType<typeof mapWithHandlers>;

class ProfileWidgetPage extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.fetchMembershipListAsConsumer({
      company: this.props.companyId,
      page_size: 2,
    });
  }

  render() {
    return <ConsumerProfile membership={this.props.membership} />;
  }
}

const styles = (theme: Theme) => ({
  flexGrid: {
    flexGrow: 1,
    spacing: theme.spacing(2),
  },
  paymentContainer: {
    padding: theme.spacing(2),
  },
});
const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  auth: state.auth,
  membership: getMembership(state, ownProps.companyId),
});

const mapDispatchToProps = {
  fetchMembershipListAsConsumer,
};

const mapWithHandlers = {};

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  withStyles(styles),
  withState('editMember', 'setEditMember', false),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
)(ProfileWidgetPage);
