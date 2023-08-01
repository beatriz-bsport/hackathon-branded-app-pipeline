import React, { Component } from 'react';
import compose from 'recompose/compose';
import { WithTranslation, withTranslation } from 'react-i18next';

import { Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';

import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Collapse from '@material-ui/core/Collapse';

import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';

import { MaterialStyleType } from '../../utils/types';
import TagSelector from '#libs/tag/components/TagSelector.selector';
import { Tag, TagGroup } from '#libs/tag/types';

type OwnProps = {
  disableTag: boolean;
  whitelist_tags: number[];
  blacklist_tags: number[];
  tagList: Array<Tag<TagGroup>>;
  onWhiteListChange: (value: number[]) => void;
  onBlackListChange: (value: number[]) => void;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  openAdvancedOptions: boolean;
};

export class BlackWhiteListing extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      openAdvancedOptions: false,
    };
  }

  render() {
    const {
      tagList,
      disableTag,
      whitelist_tags,
      blacklist_tags,
      onWhiteListChange,
      onBlackListChange,
      t,
      classes,
    } = this.props;
    const { openAdvancedOptions } = this.state;

    return (
      <>
        {!disableTag && (
          <div className={classes.fieldGroup}>
            <div className={classes.advancedOptionsSection}>
              <ButtonBase
                className={classes.advancedOptionsHeader}
                onClick={() =>
                  this.setState((prevState: State) => ({
                    openAdvancedOptions: !prevState.openAdvancedOptions,
                  }))
                }
              >
                <SettingsIcon className={classes.settings} />
                <Typography variant="h6">
                  {t('form.offer.advancedOptions.header')}
                </Typography>
                {openAdvancedOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ButtonBase>
              <Collapse in={openAdvancedOptions}>
                <div className={classes.tagSection}>
                  <Typography className={classes.title}>
                    {`${t('form.offer.advancedOptions.tag.header')}\u00A0`}
                  </Typography>
                  <Typography variant="caption">
                    {t('form.offer.advancedOptions.tag.helperText')}
                  </Typography>
                  <div className={classes.tagSelector}>
                    <div className={classes.tagSelectorLabel}>
                      <CheckIcon className={classes.tagSelectorLabelIcon} />
                      <Typography variant="subtitle1">
                        {t('form.offer.advancedOptions.tag.allowed')}
                      </Typography>
                    </div>
                    <TagSelector
                      closeMenuOnSelect
                      inScrollBar
                      isClearable
                      allTagsWithTagGroup={
                        [
                          ...tagList?.filter(
                            (tag) => !blacklist_tags?.includes(tag.id),
                          ),
                        ] || []
                      }
                      onChange={(items) =>
                        onWhiteListChange(items.map((item) => item.value))
                      }
                      onDeleteTag={(itemId: number) =>
                        onWhiteListChange(
                          whitelist_tags.filter((tg) => tg !== itemId),
                        )
                      }
                      placeholder={t(
                        'form.offer.advancedOptions.tag.doNotSelectToAllowAllMembers',
                      )}
                      selectedTags={whitelist_tags}
                    />
                  </div>
                  <div className={classes.tagSelector}>
                    <div className={classes.tagSelectorLabel}>
                      <BlockIcon className={classes.tagSelectorLabelIcon} />
                      <Typography variant="subtitle1">
                        {t('form.offer.advancedOptions.tag.notAllowed')}
                      </Typography>
                    </div>
                    <TagSelector
                      closeMenuOnSelect
                      inScrollBar
                      isClearable
                      allTagsWithTagGroup={
                        [
                          ...tagList?.filter(
                            (tag) => !whitelist_tags?.includes(tag.id),
                          ),
                        ] || []
                      }
                      onChange={(items) =>
                        onBlackListChange(items.map((item) => item.value))
                      }
                      onDeleteTag={(itemId: number) =>
                        onBlackListChange(
                          blacklist_tags.filter((tg) => tg !== itemId),
                        )
                      }
                      placeholder={t(
                        'form.offer.advancedOptions.tag.doNotSelectToAllowAllMembers',
                      )}
                      selectedTags={blacklist_tags}
                    />
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        )}
      </>
    );
  }
}

const styles = (theme: Theme) => ({
  fieldGroup: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 500,
    color: '#000',
  },
  settings: {
    color: '#868686',
  },
  tagSelectorLabel: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
  },
  tagSelectorLabelIcon: {
    marginRight: theme.spacing(1),
  },
  tagSelector: {
    paddingBottom: theme.spacing(2),
  },
  tagSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  advancedOptionsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: theme.spacing(2),
  },
  advancedOptionsSection: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
)(BlackWhiteListing);
