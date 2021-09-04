import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation, TFunction } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';

import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { MaterialStyleType } from '../../../utils/types';
import withConfirm from '../../../hocs/with-confirm.hoc';
import type { EstablishmentGroup } from '../types';

type OwnProps = {
  establishmentGroupList: Array<EstablishmentGroup>;
  onEditEstablishmentGroup: (group: EstablishmentGroup) => void;
  onDeleteEstablishmentGroup: (group: EstablishmentGroup) => void;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
const ButtonWithConfirm = withConfirm(Button, 'onClick', {
  title: 'establishment:group.modal.delete.title',
  cancel: 'establishment:group.modal.delete.cancel',
  confirm: 'establishment:group.modal.delete.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('establishment:group.modal.delete.content')}</p>
  ),
});
export const EstablishmentGroupTable = (props: Props) => {
  const { t, classes } = props;
  const {
    establishmentGroupList,
    onEditEstablishmentGroup,
    onDeleteEstablishmentGroup,
  } = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{t('group.table.name')}</TableCell>
          <TableCell>{t('group.table.establishment')}</TableCell>
          <TableCell align="center">{t('group.table.actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {establishmentGroupList &&
          establishmentGroupList.map((group: EstablishmentGroup) => (
            <TableRow key={group.id}>
              <TableCell> {group.name}</TableCell>
              <TableCell>
                {group.establishment &&
                  group.establishment.map((est) => (
                    <Chip
                      avatar={<Avatar alt="cover" src={`${est.cover}`} />}
                      label={`${est.title}`}
                      variant="outlined"
                      color="primary"
                      className={classes.chip}
                    />
                  ))}
              </TableCell>
              <TableCell align="center">
                <Button onClick={() => onEditEstablishmentGroup(group)}>
                  <EditIcon color="primary" />
                </Button>
                <ButtonWithConfirm
                  onClick={() => onDeleteEstablishmentGroup(group)}
                >
                  <DeleteIcon className={classes.greyIcon} />
                </ButtonWithConfirm>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
const styles = (theme: Theme) => ({
  chip: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
  greyIcon: {
    color: theme.palette.grey[700],
  },
});
export default compose<any, OwnProps>(
  withTranslation('establishment'),
  withStyles(styles),
)(EstablishmentGroupTable);
