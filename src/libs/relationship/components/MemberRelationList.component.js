// @flow

import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import MemberRelationListItem from './MemberRelationListItem.component';

type Props = {
  relations: Array<MemberRelation>,
  loading: boolean,
  memberId: number,
  onAdd: () => void,
  onEdit: (relation: MemberRelation) => void,
  onClickRelation: (relationId: number) => void,
  goToMember: ?(id: number) => void,
  selectedId?: ?number,
  t: TFunction,
  classes: Object,
};

export const MemberRelationList = (props: Props) => {
  if (props.loading) {
    return <CircularProgress />;
  }

  const addButton = (
    <Button
      className={props.classes.addButton}
      variant="outlined"
      color="primary"
      onClick={props.onAdd}
    >
      <AddIcon className={props.classes.leftIcon} />
      {props.t('member.list.actions.create')}
    </Button>
  );

  if (!props.relations.length) {
    return (
      <div>
        <Typography className={props.classes.title} variant="h5" component="h3">
          {props.t('member.list.title')}
        </Typography>
        <div>
          <Typography color="textSecondary">
            {props.t('member.list.isEmpty')}
          </Typography>
          {addButton}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Typography className={props.classes.title} variant="h5" component="h3">
        {props.t('member.list.title')}
      </Typography>
      <Paper>
        <List disablePadding>
          {props.relations.map((r) => (
            <MemberRelationListItem
              key={r.id}
              relation={r}
              memberId={props.memberId}
              selected={props.selectedId === r.id}
              goToMember={props.goToMember}
              onEdit={props.onEdit}
              onClick={() => {
                props.onClickRelation(r.id);
              }}
            />
          ))}
        </List>
      </Paper>
      {addButton}
    </div>
  );
};

const styles = (theme) => ({
  title: {
    marginBottom: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
});

export default withNamespaces(['relationship'])(
  withStyles(styles)(MemberRelationList),
);
