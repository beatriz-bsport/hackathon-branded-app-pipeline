import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { MaterialStyleType } from '../../../utils/types';
import CustomFormListItem from './CustomFormListItem.component';
import { CustomForm } from '../types';

type OwnProps = {
  customFormList: Array<CustomForm>;
  onClick?: (item: any) => void;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  customFormSelected?: number;
  onClickDuplicate?: (id: number) => void;
  onRestore?: (id: number) => void;
  withDisplayRule?: boolean;
};
type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;
export const CustomFormList = (props: Props) => {
  const { t, classes, customFormList, withDisplayRule } = props;
  return (
    <List component="nav" disablePadding className={classes.list}>
      <ListItem divider className={classes.listitem}>
        <Grid container>
          <Grid item xs={3} className={classes.nameItem}>
            <Typography variant="subtitle2" component="span">
              {t('customForm.name')}
            </Typography>
          </Grid>
          <Grid
            item
            xs={withDisplayRule ? 3 : 6}
            className={classes.questionItem}
          >
            <Typography variant="subtitle2" component="span" align="left">
              {t('customForm.numberQuestions')}
            </Typography>
          </Grid>
          {withDisplayRule && (
            <Grid item xs={3} className={classes.displayRuleItem}>
              <Typography variant="subtitle2" component="span">
                {t('customForm.displayRule.header')}
              </Typography>
            </Grid>
          )}
          <Grid item xs={3} className={classes.actionItem}>
            <Typography variant="subtitle2" component="span">
              {t('customForm.listActions')}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>

      {customFormList &&
        customFormList.map((customform: CustomForm) => (
          <CustomFormListItem
            key={customform.id}
            onClick={props.onClick}
            onClickEdit={props.onClickEdit}
            onClickDelete={props.onClickDelete}
            selected={
              props.customFormSelected &&
              customform.id === props.customFormSelected
            }
            customform={customform}
            onClickDuplicate={props.onClickDuplicate}
            onRestore={props.onRestore}
            withDisplayRule={withDisplayRule}
          />
        ))}
    </List>
  );
};

const styles = (theme: Theme) => ({
  listitem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameItem: {
    display: 'flex',
    alignItems: 'center',
  },
  questionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayRuleItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  actionItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(4),
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormList);
