import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import type { CustomFormFilledAPI } from '../types';
import CustomFormCompletedListItem from './CustomFormCompletedListItem.component';
import { MaterialStyleType } from '../../../utils/types';

type OwnProps = {
  customFormFilledList: Array<CustomFormFilledAPI>;
  onClickItem: (id: number) => void;
};
type Props = OwnProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
export const CustomFormFilledList = (props: Props) => {
  const { t, classes } = props;
  return (
    <List disablePadding component="nav">
      <ListItem divider>
        <div className={classes.fullwidth}>
          <Typography variant="subtitle2">{t('customForm.name')}</Typography>
        </div>

        <div className={classes.flexFullWidth}>
          <Typography align="left" variant="subtitle2">
            {t('customForm.submit.date_submitted')}
          </Typography>
        </div>
      </ListItem>
      {props.customFormFilledList.map((formfilled) => (
        <CustomFormCompletedListItem
          key={formfilled.id}
          // @ts-expect-error
          customFormFilled={formfilled}
          onClick={props.onClickItem}
        />
      ))}
    </List>
  );
};

const styles = () => ({
  flexFullWidth: {
    width: '100%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  fullwidth: {
    width: '100%',
  },
});

export default compose<any, OwnProps>(
  withTranslation('marketing'),
  withStyles(styles),
)(CustomFormFilledList);
