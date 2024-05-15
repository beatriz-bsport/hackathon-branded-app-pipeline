import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { WithTranslation, withTranslation } from 'react-i18next';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment-timezone';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Zoom from '@material-ui/core/Zoom';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { compose } from 'recompose';
import TagRuleSelector from './TagRuleSelector.component';
import { Tag } from '../../tag/types';
import TagSelector from '../../tag/components/TagSelector.selector';
import { AutoTagRule } from '../types';

type OwnProps = {
  tagRule: AutoTagRule;
  createAutoTag: (data: object) => void;
  deleteAutoTag: (id: number) => void;
  updateAutoTag: (id: number, data: object) => void;
  tags: Array<Tag>;
  creationCard: boolean;
};

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'row',
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  formFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagSelect: {
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
  tagDisabled: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
}));

type Props = OwnProps & WithTranslation;

export const TagRuleListItem = (props: Props) => {
  const { t } = props;
  const classes = useStyles();
  const [editRule, setEditRule] = useState(false);
  const [tagRuleState, setTagRuleState] = useState(props.tagRule);
  const handleUpdateTagRule = () => {
    setEditRule(false);
    props.updateAutoTag(props.tagRule.id, tagRuleState);
  };
  const handleCreateTagRule = () => {
    setEditRule(false);
    if (props.creationCard) {
      setTagRuleState(props.tagRule);
    }
    props.createAutoTag(tagRuleState);
  };

  if (props.createAutoTag && !editRule) {
    return (
      <div>
        <Button
          color="primary"
          onClick={() => setEditRule(!editRule)}
          startIcon={editRule ? <CloseIcon /> : <AddIcon />}
          variant="contained"
        >
          {`${editRule ? t('tag_rules.cancel') : t('tag_rules.create')}`}
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className={classes.form}>
        <div className={classes.header}>
          <AccessTimeIcon />
          <Typography>
            {t('tag_rules.activeSince', {
              since: `${moment(props.tagRule.date_created).format('L')}`,
              interpolation: { escapeValue: false },
            })}
          </Typography>
        </div>
        <TagRuleSelector
          disabled={!editRule}
          onChange={(autotagRule) => setTagRuleState(autotagRule)}
          selected={tagRuleState}
        />

        <Typography className={editRule ? null : classes.tagDisabled}>
          {t('tag_rules.tag')}
        </Typography>
        <div className={classes.tagSelect}>
          {/* @ts-expect-error */}
          <TagSelector
            noMulti
            allTagsWithTagGroup={props.tags}
            isDisabled={!editRule}
            onChange={(option) =>
              // @ts-expect-error
              setTagRuleState({ ...tagRuleState, tag: option.tag.id })
            }
            onDeleteTag={() => setTagRuleState({ ...tagRuleState, tag: null })}
            selectedTags={[tagRuleState.tag]}
          />
        </div>
      </CardContent>
      <CardActions className={classes.formFooter}>
        {props.updateAutoTag && (
          <IconButton
            aria-label="modify rule"
            color="secondary"
            component="span"
            onClick={() => setEditRule(!editRule)}
          >
            {editRule ? <CloseIcon /> : <EditIcon />}
          </IconButton>
        )}

        {editRule && !props.creationCard && (
          <IconButton
            aria-label="save rule modification"
            color="primary"
            component="span"
            onClick={() => {
              props.deleteAutoTag(props.tagRule.id);
              setEditRule(!editRule);
            }}
          >
            <Zoom in={editRule}>
              <DeleteIcon />
            </Zoom>
          </IconButton>
        )}

        {props.updateAutoTag && editRule && (
          <IconButton
            aria-label="save rule modification"
            color="secondary"
            component="span"
            disabled={!editRule}
            onClick={() => handleUpdateTagRule()}
          >
            <Zoom in={editRule}>
              <SaveIcon />
            </Zoom>
          </IconButton>
        )}
        {props.createAutoTag && (
          <Button
            color="primary"
            onClick={() => setEditRule(!editRule)}
            startIcon={editRule ? <CloseIcon /> : <AddIcon />}
            variant="contained"
          >
            {`${editRule ? t('tag_rules.cancel') : t('tag_rules.create')}`}
          </Button>
        )}
        {props.createAutoTag && editRule && (
          <IconButton
            aria-label="create rule"
            color="primary"
            component="span"
            disabled={!editRule || !tagRuleState.tag}
            onClick={() => handleCreateTagRule()}
          >
            <Zoom in={editRule}>
              <SaveIcon />
            </Zoom>
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default compose<any, OwnProps>(withTranslation(['smartList']))(
  TagRuleListItem,
);
