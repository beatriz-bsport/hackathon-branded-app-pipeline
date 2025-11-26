import React from 'react';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { WithTranslation, withTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import Grid from '@material-ui/core/Grid';
import type { CustomForm } from '#src/libs/custom-form/types';

import {
  getCustomFormStatistics,
  getCustomForm,
} from '#src/libs/custom-form/selectors';
import {
  fetchCustomForm,
  fetchCustomFormStatistics,
} from '#src/libs/custom-form/actions';
import { fetchMemberList as fetchMemberListAPI } from '#src/libs/member/api';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import CustomFormDetailByMemberPanel from '#src/libs/custom-form/components/statistics/CustomFormDetailByMemberPanel.component';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import type { RootState } from '../../reducers/index';
import type { WithHandlerType } from '../../utils/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withTitle from '../../hocs/with-title.hoc';

type StateHandlerInit = {};
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type OwnProps = {
  // eslint-disable-next-line react/no-unused-prop-types
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
      return <BackofficeLinearProgress additionalMargin={1} />;
    }
    return (
      <Grid container direction="row" spacing={4}>
        <Grid item xs={12}>
          <ObjectLevelPermissionProvider requiredPermission="member.allowed_actions.accessProfile">
            {(hasMemberProfileAccessPermission: boolean) => (
              <CustomFormDetailByMemberPanel
                customFormStatistic={this.props.customFormStatistic}
                // @ts-expect-error
                fetchMemberList={this.fetchMemberList}
                goToMember={
                  hasMemberProfileAccessPermission
                    ? this.props.goToMemberPage
                    : null
                }
              />
            )}
          </ObjectLevelPermissionProvider>
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  customFormStatistic: getCustomFormStatistics(state, id),
  // eslint-disable-next-line react/no-unused-prop-types
  customForm: getCustomForm(state, id),
});
const mapDispatchToProps = {
  goToMemberPage: (id: number) => push(`/member/${id}/`),
  fetchCustomFormAction: fetchCustomForm,
  fetchCustomFormStatistics,
};

const mapWithHandlers = {
  fetchCustomForm: (props: OwnAndConnectedProps) => () => {
    props.fetchCustomFormAction({
      customFormId: props.id,
      options: {
        onSuccess: () => props.fetchCustomFormStatistics(props.id),
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
  withTitle(({ customForm, t }: { customForm: CustomForm; t: TFunction }) => {
    if (customForm?.is_signup) {
      return t('marketing:customForm.signupFormTitle');
    }
    if (customForm?.is_member_form) {
      return t('marketing:customForm.memberFormTitle');
    }
    return customForm ? `${customForm.name}` : '';
  }),
  React.memo,
)(CustomFormStatistics);
