import React, { useEffect, useState } from 'react';

import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import {
  CircularProgress,
  createStyles,
  Paper,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import chroma from 'chroma-js';

import {
  fetchFranchise as fetchFranchiseAction,
  updateFranchiseTheme as updateFranchiseThemeAction,
} from '../../libs/franchise/actions';
import { getFranchiseId, getFranchisor } from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';
import FranchiseThemeForm from '../../libs/franchise/components/FranchiseThemeForm.components';
import { emailRegexp } from '../../components/input/EmailInput.component';

type OwnProps = {};

type Props = OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles>;

const FranchiseTheme = (props: Props) => {
  const {
    franchiseId,
    franchisor,
    classes,
    fetchFranchise,
    updateFranchiseTheme,
  } = props;

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  const [cover, setCover] = useState<string | File>(franchisor.cover);
  const [primaryColor, setPrimaryColor] = useState(
    RGBtoHex(franchisor.primaryRGB),
  );
  const [secondaryColor, setSecondaryColor] = useState(
    RGBtoHex(franchisor.secondaryRGB),
  );
  const [marketingEmail, setMarketingEmail] = useState(
    franchisor?.marketing_email ?? '',
  );

  if (!franchiseId) return <CircularProgress />;

  const checkSubmitDisabled = () => {
    return (
      (cover === franchisor.cover &&
        primaryColor === RGBtoHex(franchisor.primaryRGB) &&
        secondaryColor === RGBtoHex(franchisor.secondaryRGB) &&
        marketingEmail === franchisor.marketing_email) ||
      (marketingEmail !== '' && !emailRegexp.test(marketingEmail))
    );
  };

  const handleChange = (
    key: 'primaryColor' | 'secondaryColor' | 'marketingEmail',
  ) => (value: string) => {
    switch (key) {
      case 'primaryColor':
        setPrimaryColor(value);
        break;
      case 'secondaryColor':
        setSecondaryColor(value);
        break;
      case 'marketingEmail':
        setMarketingEmail(value);
        break;
      default:
        break;
    }
  };

  const handleCoverChange = (value: File) => {
    setCover(value);
  };

  const submit = () => {
    const data = new FormData();
    data.append('primary_color', primaryColor);
    data.append('secondary_color', secondaryColor);
    data.append('marketing_email', marketingEmail?.toLowerCase());

    if (cover && typeof cover !== 'string') {
      data.append('cover', cover);
    }

    updateFranchiseTheme(franchiseId, data);
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paperContainer}>
        <FranchiseThemeForm
          id={franchiseId}
          cover={cover}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          marketingEmail={marketingEmail}
          submitIsDisabled={checkSubmitDisabled()}
          handleCoverChange={handleCoverChange}
          handleChange={handleChange}
          onSubmit={submit}
        />
      </Paper>
    </div>
  );
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      padding: theme.spacing(2),
    },
    paperContainer: {
      padding: theme.spacing(2),
    },
  });

const RGBtoHex = (rgb: [number, number, number]) =>
  chroma(rgb[0], rgb[1], rgb[2]).hex();

const connector = connect(
  (state: RootState) => ({
    franchiseId: getFranchiseId(state),
    franchisor: getFranchisor(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    updateFranchiseTheme: updateFranchiseThemeAction,
  },
);

export default compose<any, OwnProps>(
  withStyles(styles),
  connector,
)(FranchiseTheme);
