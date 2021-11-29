// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import { TFunction } from 'react-i18next';
import moment from 'moment-timezone';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';

type PropsAllocationCheck = {
  resourceId: number,
  resourceType: string,
  dateStart: string,
  privateSlotId: number,
  resourceAllocationChecker: (
    privateSlotId: number,
    resourceType: string,
    resourceId: number,
    dateStart: string,
  ) => void,
  t: TFunction,
};

type StateAllocationCheck = {
  error: boolean,
};

class ResourceAllocationChecker extends React.Component<
  PropsAllocationCheck,
  StateAllocationCheck,
> {
  state = {
    error: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.resourceId !== this.props.resourceId) {
      if (!this.props.resourceId) {
        this.setState({ error: false });
      } else {
        this.checkResourceAllocation();
      }
    }
  }

  checkResourceAllocation = () => {
    if (!this.props.resourceAllocationChecker) return;
    this.props
      .resourceAllocationChecker(
        this.props.privateSlotId,
        this.props.resourceType,
        this.props.resourceId,
        this.props.dateStart,
      )
      .then((r) =>
        this.setState({
          error: !r.data.find(
            (interval) =>
              moment(this.props.dateStart).isSameOrAfter(interval[0]) &&
              moment(this.props.dateStart).isSameOrBefore(interval[1]),
          ),
        }),
      );
  };

  render() {
    const { resourceId, resourceType } = this.props;
    if (!this.state.error) {
      return null;
    }
    return (
      <div
        style={{
          marginTop: 12,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          padding: 12,
          paddingTop: 6,
          paddingBottom: 6,
          border: '1px solid #E2E2E2',
          borderRadius: 6,
          backgroundColor: 'rgb(255, 0, 0, 0.1)',
        }}
      >
        <InfoOutlineIcon
          style={{ marginRight: 12 }}
          fontSize="small"
          color="error"
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="caption">
            {this.props.t(
              `resource.allocationWarning.${this.props.resourceType}`,
            )}
          </Typography>
          <Link
            to={
              resourceType === 'coach'
                ? `/coach/${resourceId}/private-calendar`
                : `/establishment/details/${resourceId}/calendar`
            }
          >
            <Typography variant="caption">
              {this.props.t('resource.allocationWarning.showCalendar')}
            </Typography>
          </Link>
        </div>
      </div>
    );
  }
}

export default ResourceAllocationChecker;
