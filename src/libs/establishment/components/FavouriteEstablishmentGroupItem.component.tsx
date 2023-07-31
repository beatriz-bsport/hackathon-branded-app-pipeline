import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import FormLabel from '@material-ui/core/FormLabel';
import LocationCityIcon from '@material-ui/icons/LocationCity';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { EstablishmentGroup } from '../types';

type OwnProps = {
  establishmentGroupList: Array<EstablishmentGroup>;
};
type Props = OwnProps & WithTranslation;
export const FavouriteEstablishmentLocationItem = (props: Props) => {
  const { t, establishmentGroupList } = props;
  const classes = useStyles();
  return (
    <div>
      <FormLabel className={classes.label} component="legend">
        {t('favouriteLocation')}
      </FormLabel>
      {establishmentGroupList.map((establishmentGroup) => (
        <ListItem key={establishmentGroup?.id}>
          <LocationCityIcon />
          <ListItemText
            primary={establishmentGroup?.name}
            className={classes.listItemText}
          />
        </ListItem>
      ))}
    </div>
  );
};
const useStyles = makeStyles<Theme>((theme) => ({
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  label: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
  },
}));
export default compose<any, OwnProps>(withTranslation('establishment'))(
  FavouriteEstablishmentLocationItem,
);
