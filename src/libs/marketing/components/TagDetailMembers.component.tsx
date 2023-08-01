// @ts-nocheck
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';

import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
// @ts-ignore

import PaginatedListBase from '../../../components/PaginatedListBase.component';
import { MaterialStyleType } from '../../../utils/types';
import { Member } from '../../member/types';

type OwnProps = {
  membersWithTagList: Member[];
  membersWithTagListLoading: boolean;
  membersWithTagListCount: number;
  membersWithTagListPage: number | null;

  membersWithoutTagList: Member[];
  membersWithoutTagListLoading: boolean;
  membersWithoutTagListCount: number;
  membersWithoutTagListPage: number | null;

  onPageRequestWithTag: (page: number, pageSize: number) => void;
  onPageRequestWithoutTag: (page: number, pageSize: number) => void;

  onClickTagMember: (member: Member) => void;
  onClickUntagMember: (member: Member) => void;

  onClickMember: (id: number) => void;

  untagAll: () => void;
  tagAll: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

const TagDetailMembers = (props: Props) => {
  const { classes, t } = props;
  const [processing, setProcessing] = React.useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithTag')}
        </Typography>

        <Button
          color="primary"
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            props.untagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
          variant="outlined"
        >
          <LabelOffIcon className={classes.leftIcon} />
          {t('management.memberDetail.removeTagFromAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          itemPerPage={props.itemPerPage}
          items={props.membersWithTagList}
          listProps={{ dense: true }}
          loading={props.membersWithTagListLoading || processing}
          nbItems={props.membersWithTagListCount}
          onPageRequested={props.onPageRequestWithTag}
          page={props.membersWithTagListPage}
          renderItem={(item: Member) => {
            return (
              <ListItem
                key={item.id}
                dense
                divider
                button={!!props.onClickMember}
                disabled={props.membersWithTagListLoading || processing}
                onClick={
                  props.onClickMember
                    ? () => props.onClickMember(item.id)
                    : null
                }
              >
                <div className={classes.listItemInfo}>
                  <Avatar alt={item.name} src={item.photo} />
                  <Typography className={classes.name}>{item.name}</Typography>
                </div>
                <ListItemSecondaryAction>
                  <Button
                    color="primary"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.onClickUntagMember(item);
                    }}
                  >
                    <LabelOffIcon className={classes.leftIcon} />
                    {t('management.memberDetail.removeTag')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }}
        />
      </Paper>
      <div className={classes.divider} />

      <div className={classes.row}>
        <Typography variant="h5">
          {t('management.memberDetail.memberWithoutTag')}
        </Typography>
        <Button
          color="primary"
          disabled={processing}
          onClick={() => {
            setProcessing(true);
            props.tagAll({
              onSuccess: () => setProcessing(false),
              onError: () => setProcessing(false),
            });
          }}
          variant="outlined"
        >
          <LabelIcon className={classes.leftIcon} />
          {t('management.memberDetail.addTagToAll')}
        </Button>
      </div>

      <Paper className={classes.listContainer}>
        <PaginatedListBase
          itemPerPage={props.itemPerPage}
          items={props.membersWithoutTagList}
          listProps={{ dense: true }}
          loading={props.membersWithoutTagListLoading || processing}
          nbItems={props.membersWithoutTagListCount}
          onPageRequested={props.onPageRequestWithoutTag}
          page={props.membersWithoutTagListPage}
          renderItem={(item: Member) => {
            return (
              <ListItem
                key={item.id}
                dense
                divider
                button={!!props.onClickMember}
                disabled={props.membersWithoutTagListLoading || processing}
                onClick={
                  props.onClickMember
                    ? () => props.onClickMember(item.id)
                    : null
                }
              >
                <div className={classes.listItemInfo}>
                  <Avatar alt={item.name} src={item.photo} />
                  <Typography className={classes.name}>{item.name}</Typography>
                </div>
                <ListItemSecondaryAction>
                  <Button
                    color="primary"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      props.onClickTagMember(item);
                    }}
                  >
                    <LabelIcon className={classes.leftIcon} />
                    {t('management.memberDetail.addTag')}
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            );
          }}
        />
      </Paper>
    </div>
  );
};

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  divider: {
    height: 64,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginTop: theme.spacing(2),
  },
  listItemInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    marginLeft: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagDetailMembers);
