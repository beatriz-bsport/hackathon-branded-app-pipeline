import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { WithHandlerType } from '../../utils/types';
import { RootState } from '../../reducers/index';
import CustomFormDetailByMemberPanel from '../../libs/custom-form/components/statistics/CustomFormDetailByMemberPanel.component';
import { CustomForm } from '../../libs/custom-form/types';
import { fetchMemberList as fetchMemberListAPI } from '../../libs/member/api';
import {
  getCustomFormStatistics,
  getCustomForm,
} from '../../libs/custom-form/selectors';
import {
  fetchCustomForm,
  fetchAllCustomFormStatistics,
} from '../../libs/custom-form/actions';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

type StateHandlerInit = {};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  id: number;
};
type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type OwnAndConnectedProps = OwnProps & ConnectedProps & StateHandlerType;
type Props = OwnAndConnectedProps &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation;
type State = {};
export class CustomFormStatistics extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchCustomForm();
  }

  fetchMemberList = (params: { id__in: Array<number>; page_size: number }) => {
    return fetchMemberListAPI({
      ...params,
      company: 0,
    });
  };

  render() {
    if (!this.props.customFormStatistic) {
      return <BackofficeLinearProgress />;
    }
    return (
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12}>
          <CustomFormDetailByMemberPanel
            fetchMemberList={this.fetchMemberList}
            goToMember={this.props.goToMemberPage}
            customFormStatistic={this.props.customFormStatistic}
          />
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  customFormStatistic: getCustomFormStatistics(state, id),
  customForm: getCustomForm(state, id),
});
const mapDispatchToProps = {
  goToMemberPage: (id: number) => push(`/member/${id}/`),
  fetchCustomFormAction: fetchCustomForm,
  fetchAllCustomFormStatistics,
};

const mapWithHandlers = {
  fetchCustomForm: (props: OwnAndConnectedProps) => () => {
    props.fetchCustomFormAction({
      customFormId: props.id,
      options: {
        onSuccess: () => props.fetchAllCustomFormStatistics(),
      },
    });
  },
};
const withStateHandlersInit: StateHandlerInit = {};
const withStateHandlersSetter = {};
export default compose<any, OwnProps>(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation('marketing'),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withTitle(({ customForm }: { customForm: CustomForm }) => {
    return customForm ? `${customForm.name}` : '';
  }),
)(CustomFormStatistics);
