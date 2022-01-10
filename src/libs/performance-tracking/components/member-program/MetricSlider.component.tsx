import { Add, Remove } from '@material-ui/icons';
import React from 'react';
import { IconButton } from '@material-ui/core';
import { PerformanceTrackingMetric } from '#libs/performance-tracking/types';
import './MetricSlider.css';

type Props = {
  value: number;
  onChange: (value: number) => void;
  metric: PerformanceTrackingMetric;
};

type State = {
  value: number;
  angle: number;

  doMove: boolean;
  checkedMove: boolean;
};

type MouseOrTouchEvent = React.MouseEvent & React.TouchEvent;

const RADIUS = 94;
export default class MetricSlider extends React.Component<Props, State> {
  box = null;

  constructor(props: Props) {
    super(props);
    this.box = React.createRef();
    this.state = {
      value: props.value,
      angle: Math.round(
        ((this.props.value - this.props.metric?.min_value) /
          (this.props.metric?.max_value - this.props.metric?.min_value)) *
          359,
      ),
      doMove: false,
      checkedMove: false,
    };
  }

  componentDidMount() {
    const box = this.box.current;
    // on press
    box.addEventListener('mousedown', this.onMoveStart);
    box.addEventListener('touchstart', this.onMoveStart);
    // on move
    box.addEventListener('mousemove', this.onMove);
    box.addEventListener('touchmove', this.onMove);
    // on unpress
    box.addEventListener('mouseup', this.stopMove);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps?.value !== this.props?.value ||
      prevProps?.metric?.id !== this.props?.metric?.id
    ) {
      this.setState({
        value: this.props.value,
        angle: Math.round(
          ((this.props.value - this.props.metric?.min_value) /
            (this.props.metric?.max_value - this.props.metric?.min_value)) *
            359,
        ),
      });
    }
  }

  componentWillUnmount() {
    const box = this.box.current;
    // on press
    box.removeEventListener('mousedown', this.onMoveStart);
    box.removeEventListener('touchstart', this.onMoveStart);
    // on move
    box.removeEventListener('mousemove', this.onMove);
    box.removeEventListener('touchmove', this.onMove);
    // on unpress

    box.removeEventListener('touchend', this.stopMove);
    box.removeEventListener('touchcancel', this.stopMove);
  }

  onMoveStart = (e: MouseOrTouchEvent) => {
    this.startMove();
    this.updateValue(this.eventRelativePos(e));
    document.addEventListener('mouseup', this.stopMove, { once: true });
  };

  onAddOrRemove = (i: number) => {
    this.setState(
      (prevState) => {
        let newValue = prevState.value + i;
        if (newValue < this.props.metric?.min_value) {
          newValue = this.props.metric?.max_value;
        }
        if (newValue > this.props.metric?.max_value) {
          newValue = this.props.metric?.min_value;
        }
        return {
          value: newValue,
          angle: Math.round(
            ((this.props.value - this.props.metric?.min_value) /
              (this.props.metric?.max_value - this.props.metric?.min_value)) *
              359,
          ),
        };
      },

      () => this.props.onChange(this.state.value),
    );
  };

  onMove = (e: MouseOrTouchEvent) => {
    this.updateValue(this.eventRelativePos(e));
  };

  startMove = () => {
    this.setState({
      doMove: true,
      checkedMove: false,
    });
  };

  stopMove = () => {
    this.setState(
      {
        doMove: false,
        checkedMove: false,
      },

      () => {
        if (this.state.value !== this.props.value) {
          this.props.onChange(this.state.value);
        }
      },
    );
  };

  updateValue = (pos: { x: number; y: number; event: MouseOrTouchEvent }) => {
    const { checkedMove, doMove, angle } = this.state;
    const rect = this.box.current.getBoundingClientRect();
    const hx = rect.width / 2;
    const hy = rect.height / 2;
    const xdiff = hx - pos.x;
    const ydiff = hy - pos.y;
    const radius = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    const newAngle =
      (Math.atan2(ydiff, xdiff) * (180 / Math.PI) + 360 + 90) % 360;
    // Check if we should cancel propagate event to allow touch scrolling
    if (!checkedMove) {
      this.setState({ checkedMove: true });
      // if touching middle
      if (radius / hx < 0.3) {
        this.stopMove();
        return;
      }
      // If not touching cursor side
      let adiff = (angle - newAngle) * (Math.PI / 180);
      adiff = Math.atan2(Math.sin(adiff), Math.cos(adiff));
      if (Math.abs(adiff) / (Math.PI / 180) > 50) {
        this.stopMove();
        return;
      }
    }
    if (doMove) {
      // We are dragging, disable scrolling events propagation
      if (pos.event) {
        pos.event.stopPropagation();
        pos.event.preventDefault();
      }

      this.setState({
        angle: newAngle,
        value: Math.round(
          this.props.metric?.min_value +
            (newAngle / 359) *
              (this.props.metric?.max_value - this.props.metric?.min_value),
        ),
      });
    }
  };

  eventRelativePos = (event: React.MouseEvent & React.TouchEvent) => {
    const rect = this.box.current.getBoundingClientRect();
    const op = event;
    const x = op.clientX || op.touches[0].clientX || 0;
    const y = op.clientY || op.touches[0].clientY || 0;

    return {
      x: x - rect.left,
      y: y - rect.top,
      event: op,
    };
  };

  svgGenerateArcPath = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const polarToCartesian = (angle: number) => {
      const angleInRadians = ((angle - 90) * Math.PI) / 180.0;
      return {
        x: x + radius * Math.cos(angleInRadians),
        y: y + radius * Math.sin(angleInRadians),
      };
    };
    const start = polarToCartesian(endAngle);
    const end = polarToCartesian(startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const res = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ];
    return {
      path: res.join(' '),
      array: res,
    };
  };

  render() {
    const { angle, value } = this.state;
    const { metric } = this.props;

    const pathD = this.svgGenerateArcPath(
      150,
      150,
      RADIUS,
      -180,
      angle - 180,
    ).path;
    const circleCoordinates = {
      x: this.svgGenerateArcPath(150, 150, RADIUS, -180, angle - 180).array[1],
      y: this.svgGenerateArcPath(150, 150, RADIUS, -180, angle - 180).array[2],
    };
    const MachineContainer = (machine_id: string) => {
      if (machine_id?.length > 6) {
        return (
          <div className="machineContainerSlide">
            <div className="machine">{metric?.machine_id}</div>
          </div>
        );
      }
      if (machine_id?.length > 0) {
        return (
          <div className="machineContainer">
            <div className="machine">{metric?.machine_id}</div>
          </div>
        );
      }
      return null;
    };
    return (
      <>
        <div className="mood-slider">
          <div className="mood-slider-box" ref={this.box} aria-hidden>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 300 300"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="50%"
                cy="50%"
                r={`${RADIUS}`}
                strokeWidth="1"
                stroke="rgba(0, 0, 0, 0.15)"
                fill="transparent"
              />
              <circle
                id="cursor"
                cx={circleCoordinates.x.toString()}
                cy={circleCoordinates.y.toString()}
                r="5"
                fill={metric.color}
                // onMouseOver={(evt) => evt.target.setAttribute('r', '10')}
                // onMouseOut={(evt) => evt.target.setAttribute('r', '5')}
                // To deepen if you want to put an hoover on the circle
              />

              <path
                d={pathD}
                fill="none"
                stroke={metric.color}
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
            <div className="circleCenter">
              <div className="value">{value}</div>
              <div className="placeholder">{metric?.name}</div>
            </div>
          </div>

          <IconButton className="minus" onClick={() => this.onAddOrRemove(-1)}>
            <Remove className="removeIcon" />
          </IconButton>
          <IconButton className="add" onClick={() => this.onAddOrRemove(1)}>
            <Add className="removeIcon" />
          </IconButton>
          {MachineContainer(this.props.metric?.machine_id)}
        </div>
      </>
    );
  }
}
