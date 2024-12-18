import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';

type Props = { loading?: boolean; className: any };

const DividerLoader = (props: Props) => {
  if (props.loading) return <LinearProgress />;
  return <Divider className={props.className} />;
};

export default DividerLoader;
