import React from 'react';
import { compose } from 'recompose';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import EstablishmentListItem from './EstablishmentListItem.component';
import { MaterialStyleType } from '../../../utils/types';
import type { EstablishmentGroup, AssociatedEstablishment } from '../types';

type OwnProps = {
  establishmentGroup: EstablishmentGroup;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  onClick?: (id: number) => void;
};
type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;
export const EstablishmentGroupByAddressItem = (props: Props) => {
  const { classes, establishmentGroup } = props;
  const [openCollapse, setOpenCollapse] = React.useState(true);
  return (
    <div className={classes.container}>
      <ButtonBase
        onClick={() => setOpenCollapse(!openCollapse)}
        className={classes.flexHeader}
      >
        <Typography variant="h5">{establishmentGroup.address}</Typography>
        {openCollapse ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ButtonBase>
      <Divider className={classes.divider} />
      <Collapse in={openCollapse}>
        <Paper>
          {establishmentGroup.establishmentList.map(
            (establishment: AssociatedEstablishment) => (
              <EstablishmentListItem
                key={establishment.id}
                divider
                establishment={establishment}
                onClick={() => props.onClick(establishment.id)}
                onClickDelete={() => props.onClickDelete(establishment.id)}
                onClickEdit={() => {
                  props.onClickEdit(establishment.id);
                }}
              />
            ),
          )}
        </Paper>
      </Collapse>
    </div>
  );
};
const styles = (theme: Theme) => ({
  container: {
    margintop: theme.spacing(4),
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  flexHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing(4),
  },
});
export default compose<any, OwnProps>(withStyles(styles))(
  EstablishmentGroupByAddressItem,
);
