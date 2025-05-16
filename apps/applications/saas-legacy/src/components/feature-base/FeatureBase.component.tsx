import React, { useEffect } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '#src/reducers';
import IconButton from '@material-ui/core/IconButton';
import { MessageHeartSquare } from '#src/components/untitledui';
import Tooltip from '#src/components/Tooltip.component';
import { useTranslation } from 'react-i18next';
type Props = ConnectedProps<typeof connector>;

const FeatureBaseComponent: React.FC<Props> = ({
  companyTheme,
  userAuthState,
}) => {
  const { t } = useTranslation('navigation');
  useEffect(() => {
    const win = window as any;

    if (userAuthState) {
      win.Featurebase(
        'identify',
        {
          // Each 'identify' call should include an "organization" property,
          // which is your Featurebase board's name before the ".featurebase.app".
          organization: 'bsport',
          email: userAuthState.username,
          name: userAuthState.name,
          profilePicture: companyTheme?.cover,
        },
        (err: any) => {
          // !err && setIsFeatureBaseAuthenticated(true);
          err && console.error(err);
        },
      );
      win.Featurebase('initialize_feedback_widget', {
        organization: 'bsport',
        theme: 'light',
        email: userAuthState.username,
      });
    }
  }, [companyTheme, userAuthState]);

  return (
    <Tooltip placement="bottom" title={t('featureBaseButton')}>
      <IconButton data-featurebase-feedback>
        <MessageHeartSquare stroke="currentColor" />
      </IconButton>
    </Tooltip>
  );
};
const connector = connect((state: RootState) => ({
  userAuthState: state.auth,
  companyTheme: state.theme.theme,
}));

export default connector(React.memo(FeatureBaseComponent));
