import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { LinearProgress } from '@material-ui/core';
import { MaterialStyleType } from '../../utils/types';
import { getMembership } from '../../libs/membership/selectors';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import ConsumerSubscription from '../consumer/ConsumerSubscription.page';
import { RootState } from '../../reducers';

type OwnProps = {
  companyId: number;
  companyName: string;
};
type OwnAndConnectedProps = OwnProps & ReturnType<typeof mapStateToProps>;

type Props = OwnAndConnectedProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class ConsumerSubscriptionPage extends React.PureComponent<Props> {
  render() {
    const { classes } = this.props;
    if (!this.props.membership) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.container}>
        <ConsumerSubscription
          membership={this.props.membership}
          hideButtonOnWidget
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    padding: theme.spacing(2),
  },
});
const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  auth: state.auth,
  membership: getMembership(state, ownProps.companyId),
});

export default compose(
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
  }),
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps),
)(ConsumerSubscriptionPage);
