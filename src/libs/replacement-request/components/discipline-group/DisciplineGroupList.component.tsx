import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';

import { useTranslation } from 'react-i18next';
import DisciplineGroupListItem from './DisciplineGroupListItem.component';

import { DisciplineGroup } from '#libs/replacement-request/types';
import { Coach } from '#libs/associated-coach/types';

type Props = {
  disciplineGroups: DisciplineGroup<number, number, number, Coach>[];
  loading: boolean;
  handleDelete: (disciplineGroup: DisciplineGroup) => void;
  handleEdit: (disciplineGroup: DisciplineGroup) => void;
  handleOpenCreate: () => void;
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export const DisciplineGroupList: React.FC<Props> = ({
  disciplineGroups,
  loading,
  handleDelete,
  handleEdit,
  handleOpenCreate,
}) => {
  const classes = useStyles();
  const { t } = useTranslation('replacement');
  return (
    <>
      <List>
        {disciplineGroups.map((disciplineGroup) => (
          <DisciplineGroupListItem
            key={disciplineGroup?.id}
            disciplineGroup={disciplineGroup}
            loading={loading}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </List>
      <Button color="primary" variant="outlined" onClick={handleOpenCreate}>
        <AddIcon className={classes.leftIcon} />
        <Typography>{t('disciplineGroup.add')}</Typography>
      </Button>
    </>
  );
};

export default DisciplineGroupList;
