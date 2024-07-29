import React from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from '@material-ui/core/styles/makeStyles';

type Props = {
  addMember?: () => void;
};

const MemberActions: React.FC<Props> = ({ addMember }) => {
  const { t } = useTranslation('member');

  const classes = useStyles();

  return (
    <div>
      <Button color="primary" onClick={addMember} variant="contained">
        <AddIcon className={classes.leftIcon} />
        {t('addMember')}
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  leftIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default React.memo(MemberActions);
