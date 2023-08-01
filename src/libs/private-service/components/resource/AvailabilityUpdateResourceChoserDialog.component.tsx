// @ts-nocheck
import React from 'react';
import isEqual from 'lodash/isEqual';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import classNames from 'classnames';
import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import SettingsIcon from '@material-ui/icons/Settings';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import WarningIcon from '@material-ui/icons/Warning';
import { ButtonBase, Checkbox, Theme, Typography } from '@material-ui/core';
import SlotSpecificEstablishmentPicker from '#libs/private-service/components/availability/SlotSpecificEstablishmentPicker.component';
import { MaterialStyleType } from '../../../../utils/types';
import { PrivateResource } from '../../types';
import { EstablishmentWithAssociatedId } from '#libs/establishment/types';
import { conditionToHideSpecificTeacherAvailabilities } from '#libs/private-service/utils';
import ToolTip from '#components/Tooltip.component';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  resourceAvailable: Array<{ data: PrivateResource[]; datatype: string }>;
  onSubmit: (
    resourceData: { [resourceDatatype: string]: number }[],
    restriction_on_associated_establishments: Array<number>,
  ) => void;
  establishments: Array<EstablishmentWithAssociatedId>;
  kind?: string;
  coachesRelatedToPrivateServices?: number[];
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  selected: {
    establishment: PrivateResource[];
    coach: PrivateResource[];
    private_service: PrivateResource[];
  };
  advancedSectionOpen: boolean;
  selectedEstablishments: Array<number>;
  activeEstablishments: Array<EstablishmentWithAssociatedId>;
};

export class AvailabilityUpdateResourceChoserDialog extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selected: {
        establishment: [],
        coach: [],
        private_service: [],
      },
      advancedSectionOpen: false,
      selectedEstablishments: [],
      activeEstablishments: (props.establishments || []).filter(
        (e) => !e.disabled,
      ),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.establishments, this.props.establishments)) {
      this.setState({
        activeEstablishments: (this.props.establishments || []).filter(
          (e) => !e.disabled,
        ),
      });
    }
  }

  /**
   * This function return an object with only 3 keys: establishment, coach and private_service.
   * But they are 2 more identifier: associated_establishment and associated_coach
   * We group it in 3 keys only for the render, but we keep the original identifier when sending the payload
   */
  groupByResourceType = (
    resources: Array<{
      data: PrivateResource[];
      datatype: string;
    }>,
  ): {
    [resourceType: string]: {
      data: PrivateResource[];
      datatype: string;
    };
  } => {
    return resources.reduce((acc, v) => {
      let key = v.datatype;
      if (key === 'associated_establishment') {
        key = 'establishment';
      }
      if (key === 'associated_coach') {
        key = 'coach';
      }

      // @ts-ignore
      acc[key] = v;
      return acc;
    }, {});
  };

  onChange = (resourceType: string, resource: PrivateResource) => {
    this.setState((prevState) => {
      // @ts-ignore
      const arr = [...prevState.selected[resourceType]];
      const i = arr.findIndex((r) => r.resource_id === resource.resource_id);
      i === -1 ? arr.push(resource) : arr.splice(i, 1);

      if (resourceType === 'coach' && !arr.length) {
        this.setState({
          selectedEstablishments: [],
          advancedSectionOpen: false,
        });
      }

      this.setState({
        selected: {
          ...prevState.selected,
          [resourceType]: arr,
        },
      });
    });
  };

  onSubmit = () => {
    const selectedResource: { [resourceDataType: string]: number }[] = [];
    const restriction_on_associated_establishments =
      this.state.selectedEstablishments.map(
        (establishmentId) =>
          this.state.activeEstablishments.find(
            (establishment) => establishment.id === establishmentId,
          ).associated_establishment_id,
      );

    Object.keys(this.state.selected).forEach((key: keyof State['selected']) => {
      const obj = this.state.selected[key];
      obj.forEach((resource: PrivateResource) => {
        selectedResource.push({
          [resource.datatype]: resource.resource_id,
        });
      });
    });

    this.props.onSubmit(
      selectedResource,
      restriction_on_associated_establishments,
    );
  };

  toggleCollapse = () => {
    this.setState((prevState) => {
      if (prevState.advancedSectionOpen) {
        return { advancedSectionOpen: false, selectedEstablishments: [] };
      }
      return { advancedSectionOpen: true };
    });
  };

  onSpecificEstablishmentChange = (
    newValues: Array<{ label: string; value: string | number }>,
  ) => {
    this.setState({ selectedEstablishments: newValues.map((e) => e.value) });
  };

  isWarning = (resourceByType: PrivateResource) => {
    if (!this.props.coachesRelatedToPrivateServices) {
      return false;
    }
    return (
      resourceByType.datatype === 'associated_coach' &&
      !this.props.coachesRelatedToPrivateServices.includes(
        resourceByType.resource_id,
      )
    );
  };

  render() {
    const { t, classes } = this.props;

    const resourceByGroup = this.groupByResourceType(
      this.props.resourceAvailable,
    );

    const atLeastOneCoachSelected = this.state.selected.coach.length > 0;

    return (
      <Dialog open={this.props.open}>
        <DialogTitle>
          {t('availabilitySlot.form.resourceSelector.title')}
        </DialogTitle>
        <DialogContent className={classes.content}>
          {Object.keys(resourceByGroup).map((key: keyof State['selected']) => {
            return (
              <>
                <Typography
                  className={classes.resourceTypeTitle}
                  color="textSecondary"
                  variant="subtitle2"
                >
                  {t(`availabilitySlot.${key}`)}
                </Typography>

                {resourceByGroup[key].data.map((resourceByType) => (
                  <ButtonBase
                    className={classes.item}
                    onClick={() => this.onChange(key, resourceByType)}
                  >
                    <Checkbox
                      checked={
                        !!this.state.selected[key].find(
                          (r: PrivateResource) =>
                            r.resource_id === resourceByType.resource_id,
                        )
                      }
                      color="primary"
                      onChange={() => null}
                    />

                    <Typography className={classes.marginLeft}>
                      {resourceByType.name}
                    </Typography>

                    <div
                      className={classes.marginLeft}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: resourceByType.color || 'DCF3D8',
                      }}
                    />
                    {this.isWarning(resourceByType) && (
                      <div className={classes.warningIcon}>
                        <ToolTip
                          title={t(
                            'availabilitySlot.form.resourceSelector.warning',
                          )}
                        >
                          <WarningIcon />
                        </ToolTip>
                      </div>
                    )}
                  </ButtonBase>
                ))}
              </>
            );
          })}
          {!conditionToHideSpecificTeacherAvailabilities() &&
            this.props.kind === 'enable' && (
              <>
                <Divider />
                <ButtonBase
                  className={classes.collapseSectionButton}
                  disabled={!atLeastOneCoachSelected}
                  onClick={this.toggleCollapse}
                >
                  <div
                    className={classNames(classes.collapseSection, {
                      [classes.opacity]: !atLeastOneCoachSelected,
                    })}
                  >
                    <div className={classes.collapseSectionLeft}>
                      <SettingsIcon
                        className={classNames(classes.iconLeft, classes.icon)}
                      />
                      <Typography variant="subtitle2">
                        {t(
                          'availabilitySlot.specificAvailabilityForm.advanced',
                        )}
                      </Typography>
                    </div>
                    <div>
                      {this.state.advancedSectionOpen ? (
                        <ExpandLessIcon className={classes.icon} />
                      ) : (
                        <ExpandMoreIcon className={classes.icon} />
                      )}
                    </div>
                  </div>
                </ButtonBase>
                <Collapse in={this.state.advancedSectionOpen}>
                  <div className={classes.fatMargin}>
                    <SlotSpecificEstablishmentPicker
                      establishments={this.state.activeEstablishments}
                      onSelectedEstablishmentsChange={
                        this.onSpecificEstablishmentChange
                      }
                      selectedEstablishments={this.state.selectedEstablishments}
                    />
                  </div>
                </Collapse>
              </>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose}>
            {t('availabilitySlot.form.resourceSelector.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={
              this.state.selected.coach.length +
                this.state.selected.establishment.length +
                this.state.selected.private_service.length ===
              0
            }
            onClick={this.onSubmit}
          >
            {t('availabilitySlot.form.resourceSelector.submit')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme: Theme) => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 400,
  },
  resourceTypeTitle: {
    marginTop: theme.spacing(1),
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  collapseSectionButton: {
    display: 'unset',
  },
  collapseSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  collapseSectionLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  opacity: {
    opacity: 0.5,
  },
  fatMargin: {
    marginBottom: theme.spacing(20),
  },
  icon: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  warningIcon: {
    marginLeft: 'auto',
    color: theme.palette.warning.main,
  },
});

export default compose(
  withTranslation(['privateService']),
  // @ts-ignore
  withStyles(styles),
)(AvailabilityUpdateResourceChoserDialog);
