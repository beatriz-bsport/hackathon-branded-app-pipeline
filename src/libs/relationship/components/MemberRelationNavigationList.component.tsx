import React from 'react';
import { useTranslation } from 'react-i18next';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import MemberRelationNavigationListItem from './MemberRelationNavigationListItem.component';
import { Member } from '../../member/types';

type Props = {
  relations: Array<Member>;
  onClickRelation: (relationId: number) => void;
};

export const MemberRelationList: React.FC<Props> = ({
  relations,
  onClickRelation,
}) => {
  const { t } = useTranslation('relationship');

  const classes = useStyles();

  if (!relations.length) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Typography className={classes.title} variant="subtitle1">
        {t('connectedAs.title')}
      </Typography>
      <List disablePadding>
        {relations.map((r) => (
          <MemberRelationNavigationListItem
            key={r.id}
            member={r}
            onSelect={() => {
              onClickRelation(r.id);
            }}
          />
        ))}
      </List>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(3),
    fontWeight: 500,
  },
  container: {
    width: '100%',
  },
}));

export default MemberRelationList;
