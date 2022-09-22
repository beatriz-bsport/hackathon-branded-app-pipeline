import React from 'react';
import { Theme, withStyles } from '@material-ui/core/styles';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { WithTranslation, withTranslation } from 'react-i18next';
import merge from 'lodash/merge';
import { v4 as uuidv4 } from 'uuid';

import { withTheme } from '@material-ui/styles';
import { Paper } from '@material-ui/core';

import { MaterialStyleType } from '../../utils/types';
import { MarketplaceComponentConfig } from '../../libs/marketplace/types';
import { RootState } from '../../reducers';
import { fetchAssociatedCoachesList } from '../../libs/associated-coach/actions';
import {
  fetchEstablishments,
  fetchAllEstablishmentGroup,
} from '../../libs/establishment/actions';
import { fetchActivitiesCompany } from '../../libs/meta-activity/actions';
import { getActiveCoaches } from '../../libs/associated-coach/selectors';
import {
  getAvailableEstablishmentList,
  getAssociatedEstablishmentGroup,
  withEstablishment as groupWithEstablishment,
} from '../../libs/establishment/selectors';
import {
  getEnabledWorkshops,
  getPageEnabledPureMetaActivities,
} from '../../libs/meta-activity/selectors';
import { snackbarInfo } from '../../libs/snackbar/actions';

import WidgetCssThemeOverride from '../../libs/widget/components/WidgetCssThemeOverride.form';
import { EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2 } from '../../libs/exportable-components/constants';

import { fetchLevelList as fetchLevelListAction } from '#libs/level/actions';
import { getActiveCustomLevels } from '#libs/level/selectors';
import WidgetCustomizationPreview from '#libs/widget/components/WidgetCustomizationPreview.component';
import {
  updateCompanyTheme as updateCompanyThemeAction,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '#libs/theme/actions';
import { WidgetCustomCSS } from '#libs/theme/types';

type OwnProps = {
  defaultValue?: {
    componentType: string;
    config: MarketplaceComponentConfig;
  };
  hidePreview?: boolean;
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

interface State {
  componentType: string;
  config: MarketplaceComponentConfig;

  uuid: string;
  styles: WidgetCustomCSS;
}

class WidgetGeneratorPage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const state: State = {
      uuid: `-${uuidv4()}`,
      componentType: EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,

      config: {
        calendar: {},
        workshop: {},
        paymentPackTemplate: { paymentPackTemplateList: [] },
      },
      styles: this.props.theme?.widget_theme ?? {},
    };

    if (props.defaultValue) {
      state.componentType = props.defaultValue.componentType;
      merge(state.config, props.defaultValue.config);
    }

    this.state = state;
  }

  componentDidMount() {
    this.props.fetchAssociatedCoachesList();
    this.props.fetchActivitiesCompany(this.props.theme.company);
    this.props.fetchEstablishments();
    this.props.fetchAllEstablishmentGroup();
    this.props.fetchLevelList({
      is_active: true,
      company: this.props.theme.company,
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.componentType !== this.state.componentType) {
      this.setState({
        uuid: `-${uuidv4()}`,
      });
    }
    if (prevState.config !== this.state.config) {
      this.setState({
        uuid: `-${uuidv4()}`,
      });
    }
  }

  onComponentTypeChange = ({
    componentType,
    config,
  }: {
    componentType: string;
    config: any;
  }) => {
    this.setState({
      componentType,
      config,
    });
  };

  onConfigChange = ({
    config,
  }: {
    config: MarketplaceComponentConfig;
    error: any;
  }) => {
    this.setState({
      config,
    });
  };

  handlePreview = (values: WidgetCustomCSS) => {
    this.setState({
      styles: values,
    });
  };

  handleSubmit = (values: WidgetCustomCSS) => {
    this.props.updateCompanyTheme(
      this.props.theme.company,
      {
        widget_theme: values,
      },
      {
        onSuccess: () => {
          this.props.fetchCompanyTheme(this.props.theme.company);
        },
      },
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <div className={classes.configuration}>
          <Paper className={classes.paper}>
            {this.props.theme && (
              <WidgetCssThemeOverride
                theme={this.props.theme}
                initial={this.props.theme.widget_theme}
                onPreview={this.handlePreview}
                onSubmit={this.handleSubmit}
              />
            )}
          </Paper>
        </div>

        <WidgetCustomizationPreview
          onComponentTypeChange={this.onComponentTypeChange}
          componentType={this.state.componentType}
          coaches={this.props.coaches}
          establishments={this.props.establishments}
          metaActivities={this.props.metaActivities}
          metaActivitiesWorkshop={this.props.metaActivitiesWorkshop}
          config={this.state.config}
          onConfigChange={this.onConfigChange}
          establishmentGroupList={this.props.establishmentGroupList}
          customLevels={this.props.customLevels}
          company={this.props.theme.company}
          uuid={this.state.uuid}
          styles={this.state.styles}
          key={this.state.uuid}
          cssOnly
        />
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  configuration: {
    flex: '1 1 100%',
    display: 'flex',
    flexDirection: 'column',
  },
  paper: {
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  coaches: getActiveCoaches(state),
  establishments: getAvailableEstablishmentList(state),
  metaActivities: getPageEnabledPureMetaActivities(state),
  metaActivitiesWorkshop: getEnabledWorkshops(state),
  theme: state.theme.theme,
  themeLoading: state.theme.loading,
  establishmentGroupList: groupWithEstablishment(
    getAssociatedEstablishmentGroup,
  )(state),
  customLevels: getActiveCustomLevels(state),
});

const mapDispatchToProps = {
  fetchAssociatedCoachesList,
  fetchEstablishments,
  fetchActivitiesCompany,
  fetchAllEstablishmentGroup,
  snackbarInfo,
  fetchLevelList: fetchLevelListAction,
  updateCompanyTheme: updateCompanyThemeAction,
  fetchCompanyTheme: fetchCompanyThemeAction,
};

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTheme,
  withTranslation(['widget']),
  connect(mapStateToProps, mapDispatchToProps),
)(WidgetGeneratorPage);
