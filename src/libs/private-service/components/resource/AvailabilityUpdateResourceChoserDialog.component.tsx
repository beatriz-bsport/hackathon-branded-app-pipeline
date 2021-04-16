import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { ButtonBase, Checkbox, Theme, Typography } from '@material-ui/core';
import { MaterialStyleType } from '../../../../utils/types';
import { PrivateResource } from '../../types';

type OwnProps = {
  open: boolean;
  onClose: () => void;
  resourceAvailable: Array<{ data: PrivateResource[]; datatype: string }>;
  onSubmit: (resourceData: { [resourceDatatype: string]: number }[]) => void;
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
};

export class AvailabilityUpdatResourceChoserDialog extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    selected: {
      establishment: [],
      coach: [],
      private_service: [],
    },
  };

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
    Object.keys(this.state.selected).forEach((key: keyof State['selected']) => {
      const obj = this.state.selected[key];
      obj.forEach((resource: PrivateResource) => {
        selectedResource.push({
          [resource.datatype]: resource.resource_id,
        });
      });
    });

    this.props.onSubmit(selectedResource);
  };

  render() {
    const { t, classes } = this.props;

    const resourceByGroup = this.groupByResourceType(
      this.props.resourceAvailable,
    );

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
                  variant="subtitle2"
                  color="textSecondary"
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
                  </ButtonBase>
                ))}
              </>
            );
          })}
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
});

export default compose(
  withTranslation(['privateService']),
  // @ts-ignore
  withStyles(styles),
)(AvailabilityUpdatResourceChoserDialog);
