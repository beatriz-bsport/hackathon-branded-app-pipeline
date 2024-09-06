import React, { useEffect } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '#src/reducers';
// @ts-expect-error
import i18n from '#src/i18n/index';
import { getCurrentLanguageIsoCode } from '#src/utils/language';
type Props = ConnectedProps<typeof connector>;

const FeatureBaseComponent: React.FC<Props> = ({
  companyTheme,
  userAuthState,
}) => {
  useEffect(() => {
    const win = window as any;
    const { language } = i18n;
    const isoLanguage = getCurrentLanguageIsoCode(language);
    if (userAuthState) {
      win.Featurebase(
        'initialize_survey_widget',
        {
          organization: 'bsport',
          theme: 'light',
          email: userAuthState.username,
          locale: isoLanguage,
          placement: 'bottom-right',
        },
        (err: any) => {
          // !err && setIsFeatureBaseAuthenticated(true);
          err && console.error(err);
        },
      );
    }
  }, [companyTheme, userAuthState]);

  return null;
};
const connector = connect((state: RootState) => ({
  userAuthState: state.auth,
  companyTheme: state.theme.theme,
}));

export default connector(React.memo(FeatureBaseComponent));
