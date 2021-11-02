import React, { useEffect, useRef, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import chroma from 'chroma-js';
import TagCircle from './TagCircle.component';
import { Tag, TagGroup } from '../../../tag/types';
import './TagBadge.css';
import TagChip from '../../../tag/components/TagChip.component';

const NUMBER_OF_TAGS_DISPLAYED = 4;

type Props = {
  tags: Array<Tag<TagGroup>>;
  children: React.ReactNode;
  name: string;
};

export const TagBadge = (props: Props) => {
  const { tags, name } = props;
  const styleProps = {
    color: 'blue',
  };
  const classes = useStyles(styleProps);
  const iconRef = useRef<HTMLDivElement>(null);

  const [animation, setAnimation] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    iconRef?.current?.addEventListener('mouseenter', () => {
      setAnimation(true);
      setReverse(false);
    });
    iconRef?.current?.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpenPopup(true);
    });
    iconRef?.current?.addEventListener('mouseleave', () => {
      setAnimation(false);
      setReverse(true);
    });
  }, [iconRef, tags]);

  const filteredTags =
    tags && tags.length !== 0
      ? [...tags].filter((tag) => tag?.icon && tag?.icon?.length !== 0)
      : null;

  if (!filteredTags) {
    return <> {props.children} </>;
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation}
      >
        <Popover
          classes={{ paper: 'MuiPopover-paper' }}
          onClose={() => setOpenPopup(false)}
          anchorEl={iconRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openPopup}
        >
          <div className={classes.popover}>
            <Typography className={classes.tag}>{name}</Typography>
            {tags
              .filter((tag) => tag.icon && tag.color)
              .map((tag) => (
                <div className={classes.tag}>
                  <TagChip tag={tag} size="small" />
                </div>
              ))}
          </div>
        </Popover>
      </div>

      <div className={classes.container}>
        <div className="hoverCircle" ref={iconRef} />
        {props.children}
        <div
          className={classNames('tagBadgeContainer', {
            tagBadgeContainerAnimated: animation,
            tagBadgeContainerReverse: reverse,
          })}
        >
          {filteredTags?.map((tag: Tag<TagGroup>, index: number) => {
            if (index < 4) {
              return (
                <div
                  className="badge"
                  style={{
                    backgroundColor: tag?.color,
                  }}
                >
                  <TagCircle icon={tag.icon} color={tag.color} />
                </div>
              );
            }

            return (
              <div
                className={classNames('remainingBadge', 'badge')}
                style={{
                  backgroundColor: tag?.color,
                }}
              >
                <TagCircle icon={tag.icon} color={tag.color} />
              </div>
            );
          })}
          {filteredTags?.length > NUMBER_OF_TAGS_DISPLAYED ? (
            <div
              className={classNames(
                'countRemainingBadge',
                'badge',
                classes.counterBadge,
              )}
            >
              {`+${filteredTags.length - NUMBER_OF_TAGS_DISPLAYED}`}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  counterBadge: {
    backgroundColor: theme.palette.primary.main,
    color:
      chroma(theme.palette.primary.main).luminance() > 0.5
        ? '#000000'
        : '#ffffff',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    position: 'relative',
  },
  popover: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(2),
    maxHeight: theme.spacing(30),
  },
  tag: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

export default TagBadge;
