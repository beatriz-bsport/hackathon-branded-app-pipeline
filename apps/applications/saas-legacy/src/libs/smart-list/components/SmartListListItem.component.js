import React, { useCallback } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
import { useTranslation, withTranslation, TFunction } from 'react-i18next';
import FileCopyIcon from '@material-ui/icons/FileCopy';

import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Tooltip } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

import ListItemResponsiveAction from '../../../components/button/ListItemResponsiveAction.component';

type Props = {
  smartlist: SmartList,
  onClick: (any) => void,
  onClickEdit: (id: number) => void,
  onClickDelete: (id: number) => void,
  selected: boolean,
  onClickDuplicate: (id: number) => void,
};

const emptyMethodToRenderIconButtonComponent = () => {};

const DisabledDeleteButton = withTranslation(['smartList'])(
  ({ t }: { t: TFunction }) => (
    <Tooltip title={t('modal.delete.linkedToAFranchiseCommunication')}>
      <span>
        <IconButton disabled>
          <DeleteIcon />
        </IconButton>
      </span>
    </Tooltip>
  ),
);

export const SmartListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['smartList']);
  const { onClickEdit, onClickDuplicate, onClickDelete, smartlist } = props;

  const handleOnClickEdit = useCallback(() => {
    onClickEdit(smartlist.id);
  }, [smartlist, onClickEdit]);

  const handleOnClickDuplicate = useCallback(() => {
    onClickDuplicate(smartlist.id);
  }, [smartlist, onClickDuplicate]);

  return (
    <ListItem
      button
      divider
      className={classes.listitem}
      onClick={() => props.onClick(props.smartlist.id)}
      selected={props.selected}
      style={{ display: 'flex', flexWrap: 'nowrap' }}
    >
      <ListItemText
        primary={
          <span>
            <Typography inline component="span">
              {props.smartlist.name}
            </Typography>
          </span>
        }
      />
      <ListItemResponsiveAction
        actions={[
          props.onClickEdit && {
            icon: ArrowForwardIcon,
            label: t('edit'),
            color: 'primary',
            onClick: handleOnClickEdit,
          },
          props.onClickDuplicate && {
            icon: FileCopyIcon,
            label: t('duplicate'),
            color: 'primary',
            onClick: handleOnClickDuplicate,
          },
          smartlist.has_active_communication_group_configs
            ? {
                iconButtonComponent: DisabledDeleteButton,
                onClick: emptyMethodToRenderIconButtonComponent(),
              }
            : props.onClickDelete && {
                icon: DeleteIcon,
                onClick: () => onClickDelete(smartlist),
                color: 'secondary',
              },
        ]}
      />
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[2],
    fontSize: 11,
  },
  listitem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  actions: { display: 'flex' },
}));

export default React.memo(SmartListItem);
