import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withStateHandlers } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getCustomFormWithEnableField } from '../../libs/custom-form/selectors';
import { RootState } from '../../reducers/index';
import {
  fetchCustomForm,
  updateCutsomFormLayout,
} from '../../libs/custom-form/actions';
import CustomFormLayout from '../../libs/custom-form/components/consumer-form-layout/CustomFormLayout.form';
import { WithHandlerType } from '../../utils/types';
import themeSelectors from '../../libs/theme/selectors';
import { CustomForm, ResponsiveLayouts } from '../../libs/custom-form/types';
import withTitle from '../../hocs/with-title.hoc';

type OwnProps = {
  id: number;
};

type ConnectedProps = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;

type OwnAndConnectedProps = OwnProps & ConnectedProps;

type Props = OwnAndConnectedProps &
  StateHandlerType &
  WithHandlerType<typeof mapWithHandlers> &
  WithTranslation;

export class CustomFormLayoutPage extends Component<Props> {
  componentDidMount() {
    this.props.fetchCustomForm();
  }

  render() {
    if (this.props.loading || !this.props.customForm?.custom_form_field) {
      // @ts-expect-error
      return <BackofficeLinearProgress additionalMargin={1} color="primary" />;
    }

    return (
      <>
        {/* @ts-expect-error */}
        <CustomFormLayout
          asManager
          editable
          general_terms_and_conditions={
            this.props.theme?.general_terms_and_conditions
          }
          initial={this.props.customForm}
          isCssVariantActivated={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
          layouts={this.props.customForm?.layout}
          maxHeight="75%"
          onLayoutChange={(allLayouts: ResponsiveLayouts) =>
            this.props.setCurrentResponsiveLayouts(allLayouts)
          }
          saveLayouts={() =>
            this.props.updateCutsomFormLayout({
              formId: this.props.id,
              layout: this.props.responsiveLayouts,
            })
          }
          shouldWrapLayerInCssHoc={CUSTOM_FORM_CSS_VARIANT_ACTIVATED}
          waiver={this.props.theme?.waiver}
        />
      </>
    );
  }
}

const mapStateToProps = (state: RootState, { id }: { id: number }) => ({
  customForm: getCustomFormWithEnableField(state, id),
  loading: state.customForm.loading,
  theme: themeSelectors.getTheme(state),
});
const mapDispatchToProps = {
  fetchCustomFormAction: fetchCustomForm,
  updateCutsomFormLayout,
};

const mapWithHandlers = {
  fetchCustomForm: (props: OwnAndConnectedProps) => () => {
    props.fetchCustomFormAction({
      customFormId: props.id,
    });
  },
};

const withStateHandlersInit = {
  // @ts-expect-error
  responsiveLayouts: null,
};
const withStateHandlersSetter = {
  setCurrentResponsiveLayouts:
    () => (responsiveLayouts: ResponsiveLayouts | null) => {
      return { responsiveLayouts };
    },
};
export default compose<any, Props>(
  routerParamsToProps({ id: 'id:number' }),
  withTranslation('marketing'),
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers(mapWithHandlers),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
  withTitle(({ customForm, t }: { customForm: CustomForm; t: TFunction }) => {
    if (customForm?.is_signup) {
      return t('marketing:customForm.signupFormTitle');
    }
    if (customForm?.is_member_form) {
      return t('marketing:customForm.memberFormTitle');
    }
    return customForm ? `${customForm.name}` : '';
  }),
)(CustomFormLayoutPage);
