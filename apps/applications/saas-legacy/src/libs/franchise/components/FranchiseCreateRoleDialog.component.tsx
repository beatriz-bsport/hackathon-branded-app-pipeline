import React from 'react';

import Stepper from '@material-ui/core/Stepper';
import {
  useTranslation,
  WithTranslation,
  withTranslation,
} from 'react-i18next';

import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import StoreMallDirectoryIcon from '@material-ui/icons/StoreMallDirectory';
import { StepIconProps } from '@material-ui/core/StepIcon';
import { compose } from 'recompose';
import clsx from 'clsx';
import { Divider } from '@material-ui/core';
import chroma from 'chroma-js';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
import CreateRoleMasterAccount from '#src/libs/franchise/components/FranchiseCreateRoleMasterAccount.component';
import {
  FranchiseRole,
  FranchiseRoleFranchiseeData,
  FranchiseRoleMasterAccountData,
} from '#src/libs/role/types';
import type { MaterialStyleType } from '#src/utils/types';
// @ts-expect-error
import asyncComponent from '#src/AsyncComponent';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (franchisorRole: FranchiseRole) => void;
  franchisorRole: FranchiseRole | null;
  displayNewWebshopForFranchisees: boolean;
};

type State = {
  currentStep: number;
  masterAccountData: FranchiseRoleMasterAccountData;
  franchiseeData: FranchiseRoleFranchiseeData;
};

type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

const ColorlibConnector = withStyles((theme: Theme) => ({
  line: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}))(StepConnector);

function ColorStepIcon(props: StepIconProps) {
  const classes = useColorStepIconStyles();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: (
      <BusinessCenterIcon
        className={clsx(classes.icon, {
          [classes.iconPrimary]: active || completed,
        })}
      />
    ),
    2: (
      <StoreMallDirectoryIcon
        className={clsx(classes.icon, {
          [classes.iconPrimary]: active || completed,
        })}
      />
    ),
  };

  return (
    <div
      className={clsx(classes.box, {
        [classes.boxPrimary]: active || completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

const useColorStepIconStyles = makeStyles((theme: Theme) => ({
  box: {
    backgroundColor: chroma('black').alpha(0.08).hex(),
    width: theme.spacing(5),
    height: theme.spacing(5),
    borderRadius: theme.spacing(1),
    maxWidth: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '1 0',
  },
  boxPrimary: {
    backgroundColor: chroma(theme.palette.primary.main).alpha(0.2).hex(),
  },
  icon: {
    fill: theme.palette.text.disabled,
  },
  iconPrimary: {
    fill: theme.palette.primary.main,
  },
}));

const StepperForm = ({ activeStep }: { activeStep: number }) => {
  const { t } = useTranslation('role');
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<ColorlibConnector />}
    >
      <Step key={STEP_MASTER_ACCOUNT}>
        <StepLabel StepIconComponent={ColorStepIcon}>
          {t(`forms.role.franchise.create.steps.masterAccount`)}
        </StepLabel>
      </Step>
      <Step key={STEP_FRANCHISEE}>
        <StepLabel StepIconComponent={ColorStepIcon}>
          {t(`forms.role.franchise.create.steps.franchisee`)}
        </StepLabel>
      </Step>
    </Stepper>
  );
};
const STEP_MASTER_ACCOUNT: number = 0;

const STEP_FRANCHISEE: number = 1;

const CreateRoleFranchisee = asyncComponent(
  () => import('#src/libs/role/components/CreateRoleDialog.component'),
);

const DEFAULT_MASTER_ACCOUNT_DATA: FranchiseRoleMasterAccountData = {
  name: '',
  description: '',
  editable: true,
  permissions: null,
};

const DEFAULT_FRANCHISEE_DATA: FranchiseRoleFranchiseeData = {
  name: '',
  description: '',
  editable: true,
  has_booking_override_control: false,
  permissions: null,
  object_level_permissions: null,
};

class FranchiseCreateRoleDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = this.getInitialState(props);
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.franchisorRole !== this.props.franchisorRole) {
      const state = this.getInitialState(this.props);
      this.setState({ ...state });
    }
  };

  getInitialState = (props: Props) => {
    const state: State = {
      masterAccountData: DEFAULT_MASTER_ACCOUNT_DATA,
      franchiseeData: DEFAULT_FRANCHISEE_DATA,
      currentStep: STEP_MASTER_ACCOUNT,
    };

    if (props.franchisorRole) {
      const { id, name, description, editable, permissions } =
        props.franchisorRole;
      const role = props.franchisorRole?.company_role;
      state.masterAccountData = {
        id,
        name,
        description,
        editable,
        permissions,
      };
      state.franchiseeData = {
        name: role?.name,
        description: role?.description,
        editable: role?.editable,
        permissions: role?.permissions,
        has_booking_override_control: role?.has_booking_override_control,
        object_level_permissions: role?.object_level_permissions,
      };
    }

    return state;
  };

  render() {
    return (
      <GenericResponsiveDrawer
        onClose={this.props.onClose}
        open={this.props.open}
        title={this.props.t('forms.role.franchise.create.title')}
      >
        <StepperForm activeStep={this.state.currentStep} />
        <Divider className={this.props.classes.divider} />
        {this.state.currentStep === STEP_MASTER_ACCOUNT && (
          <CreateRoleMasterAccount
            // @ts-expect-error
            open
            displayNewWebshopForFranchisees={
              this.props?.displayNewWebshopForFranchisees
            }
            onClose={this.props.onClose}
            onNext={(data) => {
              this.setState({
                currentStep: STEP_FRANCHISEE,
                masterAccountData: data,
              });
            }}
            role={this.state.masterAccountData}
          />
        )}
        {this.state.currentStep === STEP_FRANCHISEE && (
          <CreateRoleFranchisee
            isFranchisor
            open
            displayNewWebshop={this.props?.displayNewWebshopForFranchisees}
            onClose={this.props.onClose}
            onPrevious={(data: FranchiseRoleFranchiseeData) => {
              this.setState({
                currentStep: STEP_MASTER_ACCOUNT,
                franchiseeData: data,
              });
            }}
            onSubmit={(data: FranchiseRoleFranchiseeData) => {
              this.props.onSubmit({
                ...this.props.franchisorRole,
                ...this.state.masterAccountData,
                company_role: {
                  ...this.props.franchisorRole?.company_role,
                  ...data,
                  name: this.state.masterAccountData.name,
                  description: this.state.masterAccountData.description,
                  editable: true,
                  is_franchisor: true,
                },
              });
              this.setState({
                masterAccountData: DEFAULT_MASTER_ACCOUNT_DATA,
                franchiseeData: DEFAULT_FRANCHISEE_DATA,
                currentStep: STEP_MASTER_ACCOUNT,
              });
            }}
            role={this.state.franchiseeData}
          />
        )}
      </GenericResponsiveDrawer>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    divider: {
      marginLeft: theme.spacing(-4),
      marginRight: theme.spacing(-4),
    },
  });

export default compose<any, OwnProps>(
  withTranslation('role'),
  withStyles(styles),
)(FranchiseCreateRoleDialog);
