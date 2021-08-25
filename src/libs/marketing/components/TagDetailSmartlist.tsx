import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Theme, withStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import { compose } from 'recompose';

import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { MaterialStyleType } from '../../../utils/types';
import { Tag } from '../../tag/types';
import { AutoTagRule, SmartList } from '../../smart-list/types';
import TagRuleSelector from '../../smart-list/components/TagRuleSelector.component';

type OwnProps = {
  smartlistList: SmartList[];
  autotagRuleBySmartlist: { [key: string]: AutoTagRule[] };
  loading: boolean;
  onClickRemoveTag: (smartlist: SmartList) => void;
  tag: Tag;
  onChangeTagRule: (autotagRule: AutoTagRule) => void;
  goToSmartlist: () => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class TagDetailSmartlist extends React.PureComponent<Props> {
  render() {
    const { classes, t } = this.props;

    if (this.props.loading) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.container}>
        {!this.props.loading && !this.props.smartlistList.length && (
          <div>
            <Typography color="textSecondary">
              {t('management.smartlistDetail.empty')}
            </Typography>
            <Button
              onClick={this.props.goToSmartlist}
              color="primary"
              variant="outlined"
              className={classes.marginTop}
            >
              <ArrowForwardIcon className={classes.leftIcon} />
              {t('management.smartlistDetail.createViaSmartlist')}
            </Button>
          </div>
        )}

        {!this.props.loading && !!this.props.smartlistList.length && (
          <>
            <Typography variant="h5">
              {t('management.smartlistDetail.title')}
            </Typography>

            <Paper className={classes.paper}>
              {this.props.smartlistList.map((smartlist) => {
                if (!this.props.autotagRuleBySmartlist[smartlist.id]) {
                  return null;
                }

                return (
                  <ListItem divider key={smartlist.id}>
                    <div className={classes.container}>
                      <div className={classes.listItemInfo}>
                        <div className={classes.row}>
                          <Typography variant="h6">{smartlist.name}</Typography>
                          <Button
                            color="primary"
                            onClick={() =>
                              this.props.onClickRemoveTag(smartlist)
                            }
                          >
                            <DeleteIcon className={classes.leftIcon} />
                            {t('management.smartlistDetail.removeTag')}
                          </Button>
                        </div>

                        {this.props.autotagRuleBySmartlist[smartlist.id].map(
                          (autotagRule) => (
                            <TagRuleSelector
                              key={autotagRule.id}
                              selected={autotagRule}
                              onChange={this.props.onChangeTagRule}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </ListItem>
                );
              })}
            </Paper>
          </>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paper: {
    marginTop: theme.spacing(2),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  listItemInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  withStyles(styles),
  withTranslation(['tag']),
)(TagDetailSmartlist);
