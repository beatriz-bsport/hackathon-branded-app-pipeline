// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import type { ReactRef } from 'react-grid-layout';

type WPDefaultProps = {
  measureBeforeMount: boolean;
};
type WPProps = {
  className?: string;
  style?: Object;
} & WPDefaultProps;

type WPState = {
  width: number;
};

type ComposedProps<Config> = {
  measureBeforeMount?: boolean;
  className?: string;
  style?: Object;
  width?: number;
  // The props below should only be used with care.
  // It has to be used if we want the provider to listen to a specific
  // width instaed of the window width
  customProviderWidth: number;
} & Config &
  WPProps;

const LAYOUT_CLASS_NAME = 'react-grid-layout';

export default function WidthProvideRGL<Config>(
  ComposedComponent: React.AbstractComponent<Config>,
): React.AbstractComponent<ComposedProps<Config>> {
  return class WidthProvider extends React.Component<
    ComposedProps<Config>,
    WPState
  > {
    static defaultProps: WPDefaultProps = {
      measureBeforeMount: false,
    };

    static propTypes = {
      // If true, will not render children until mounted. Useful for getting the exact width before
      // rendering, to prevent any unsightly resizing.
      measureBeforeMount: PropTypes.bool,
    };

    state: WPState = {
      width: 1280,
    };

    elementRef: ReactRef<HTMLDivElement> = React.createRef();

    mounted: boolean = false;

    componentDidMount() {
      this.mounted = true;
      window.addEventListener('resize', this.onWindowResize);
      // Call to properly set the breakpoint and resize the elements.
      // Note that if you're doing a full-width element, this can get a little wonky if a scrollbar
      // appears because of the grid. In that case, fire your own resize event, or set `overflow: scroll` on your body.
      this.onWindowResize();
    }

    componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
      if (!this.mounted) return;
      const node = this.elementRef.current; // Flow casts this to Text | Element
      // fix: grid position error when node or parentNode display is none by window resize
      // #924 #1084
      if (node instanceof HTMLElement && node.offsetWidth) {
        this.setState({
          width: this.props.customProviderWidth
            ? this.props.customProviderWidth
            : node.offsetWidth,
        });
      }
    };

    render() {
      const { measureBeforeMount, ...rest } = this.props;
      if (measureBeforeMount && !this.mounted) {
        return (
          <div
            className={clsx(this.props.className, LAYOUT_CLASS_NAME)}
            style={this.props.style}
            ref={this.elementRef}
          />
        );
      }

      return (
        <ComposedComponent
          innerRef={this.elementRef}
          {...rest}
          {...this.state}
        />
      );
    }
  };
}
