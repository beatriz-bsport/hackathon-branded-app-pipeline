// @flow
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core';

const PageHeightCalculator = (props: { children: React.ReactChild }) => {
  const { children } = props;

  const page = useRef(null);
  const windowHeight = useRef(null);
  const [pageHeight, setPageHeight] = useState(0);

  // Using layout effet to ensure the DOM was rendered
  useLayoutEffect(() => {
    if (page?.current?.getBoundingClientRect()?.height && !pageHeight) {
      setPageHeight(page?.current?.getBoundingClientRect()?.height);
    }
  }, [page, pageHeight]);

  if (!windowHeight.current) {
    windowHeight.current = window.innerHeight;
  }

  const classes = useStyles();

  useEffect(() => {
    const resetHeight = () => {
      setPageHeight(pageHeight + window.innerHeight - windowHeight.current);
      windowHeight.current = window.innerHeight;
    };
    window.addEventListener('resize', resetHeight);
    return () => {
      window.removeEventListener('resize', resetHeight);
    };
  }, [pageHeight, setPageHeight]);

  // Checking isValidElement is the safe way and avoids a typescript
  // error too.
  if (!React.isValidElement(children)) {
    return null;
  }
  const childrenWithProps = React.cloneElement(children, { pageHeight });

  return (
    <div className={classes.page} ref={page}>
      {pageHeight > 0 && childrenWithProps}
    </div>
  );
};

const withPageHeightHOC = () => (WrappedComponent: React.ComponentType) =>
  class extends React.Component {
    render() {
      return (
        <PageHeightCalculator>
          <WrappedComponent {...this.props} />
        </PageHeightCalculator>
      );
    }
  };
const useStyles = makeStyles(() => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
  },
}));

export default withPageHeightHOC;
