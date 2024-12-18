import React from 'react';

import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '#src/reducers';

import FeatureBaseBoardComponent from '#src/components/feature-base/FeatureBaseBoard.component';

type Props = ConnectedProps<typeof connector>;

const FeatureBaseBoard: React.FC<Props> = ({ companyTheme, userAuthState }) => {
  return (
    <FeatureBaseBoardComponent
      companyTheme={companyTheme}
      userAuthState={userAuthState}
    />
  );
};
const connector = connect((state: RootState) => ({
  userAuthState: state.auth,
  companyTheme: state.theme.theme,
}));

export default connector(FeatureBaseBoard);
