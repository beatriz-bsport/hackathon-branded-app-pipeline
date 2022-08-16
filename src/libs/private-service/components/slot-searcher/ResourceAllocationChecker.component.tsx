import React from 'react';
import { compose } from 'recompose';
import { withTranslation, WithTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { AxiosResponse } from 'axios';

import Typography from '@material-ui/core/Typography';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import { WithStyles, createStyles, withStyles, Theme } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import { joinIntervalList } from '#libs/private-service/utils';

type OwnProps = {
  resourceId: number;
  resourceType: string;
  updatedTime: string;
  privateSlotId: number;
  privateSlotDuration: number;
  resourceAllocationChecker: (
    privateSlotId: number,
    resourceType: string,
    resourceId: number,
    updatedTime: string,
  ) => Promise<AxiosResponse<string[][]>>;
};

type State = {
  errorAllocation: boolean;
};

type Props = OwnProps & WithStyles<typeof styles> & WithTranslation;

export class ResourceAllocationChecker extends React.Component<Props, State> {
  state: State = {
    errorAllocation: false,
  };

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.resourceId !== this.props.resourceId ||
      prevProps.updatedTime !== this.props.updatedTime ||
      prevProps.privateSlotDuration !== this.props.privateSlotDuration
    ) {
      if (!this.props.resourceId || !this.props.updatedTime) {
        this.setState({ errorAllocation: false });
      } else {
        this.checkResourceAllocation();
      }
    }
  }

  checkResourceAllocation = async () => {
    if (!this.props.resourceAllocationChecker) return;
    try {
      const response = await this.props.resourceAllocationChecker(
        this.props.privateSlotId,
        this.props.resourceType,
        this.props.resourceId,
        this.props.updatedTime,
      );
      const allIntervals = joinIntervalList(response.data);
      this.setState({
        errorAllocation: !allIntervals.some(
          (interval: string[]) =>
            moment(this.props.updatedTime).isSameOrAfter(interval[0]) &&
            moment(this.props.updatedTime)
              .add(this.props.privateSlotDuration, 'minutes')
              .isSameOrBefore(interval[1]),
        ),
      });
    } catch (error) {
      this.setState({ errorAllocation: true });
    }
  };

  render() {
    const { classes, t } = this.props;

    if (!this.state.errorAllocation) {
      return null;
    }

    return (
      <div className={classes.container}>
        <InfoOutlineIcon
          className={classes.iconInfo}
          fontSize="small"
          color="error"
        />
        <div className={classes.textContainer}>
          <Typography variant="caption">
            {t(`resource.allocationWarning.${this.props.resourceType}`)}
          </Typography>
        </div>
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(1.5),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      padding: theme.spacing(1.5),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      border: '1px solid',
      borderColor: theme.palette.grey[300],
      borderRadius: theme.spacing(1),
      backgroundColor: red[50],
    },
    iconInfo: { marginRight: theme.spacing(1.5) },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
  });

export default compose(
  withStyles(styles),
  withTranslation('privateService'),
)(ResourceAllocationChecker);
