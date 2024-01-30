import React, { useEffect, useRef, useState } from 'react';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';
import classNames from 'classnames';
import Hidden from '@material-ui/core/Hidden';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';

import { ONLY_BALANCE, ONLY_UNPAID_AMOUNT } from '#libs/member/constants';
import BalanceChip from '#libs/member/components/BalanceChip.component';
import TagChip from '#libs/tag/components/TagChip.component';
import TagCircle from './TagCircle.component';

import type { Member } from '#libs/member/types';
import type { Tag, TagGroup } from '#libs/tag/types';

import './TagBadge.css';

const NUMBER_OF_TAGS_DISPLAYED = 4;

type Props = {
  member: Member<Tag<TagGroup>>;
  children: React.ReactNode;
  topLeftIcons?: boolean;
};

const TagBadge = (props: Props) => {
  const { member, topLeftIcons } = props;
  const tags = member?.tags;
  const name = member?.name;
  const { t } = useTranslation('member');
  const classes = useStyles();
  const iconRef = useRef<HTMLDivElement>(null);

  const [openBalancePopup, setOpenBalancePopup] = useState(false);
  const [animation, setAnimation] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    iconRef?.current?.addEventListener('mouseenter', () => {
      setOpenBalancePopup(true);
      setAnimation(true);
      setReverse(false);
    });
    iconRef?.current?.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpenPopup(true);
      setOpenBalancePopup(false);
    });
    iconRef?.current?.addEventListener('mouseleave', () => {
      setOpenBalancePopup(false);
      setAnimation(false);
      setReverse(true);
    });
  }, [iconRef, tags]);

  const filteredTags =
    tags && tags.length !== 0
      ? [...tags].filter((tag) => tag?.icon && tag?.icon?.length !== 0)
      : null;

  return (
    <>
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyPress={(e) => e.stopPropagation}
        role="button"
        tabIndex={0}
      >
        <Popover
          anchorEl={iconRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          classes={{ paper: 'MuiPopover-paper' }}
          onClose={() => setOpenPopup(false)}
          open={openPopup}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <div className={classes.popover}>
            <Typography className={classes.tag}>{name}</Typography>
            {!!tags &&
              tags
                .filter((tag) => tag.icon && tag.color)
                .map((tag) => (
                  <div className={classes.tag}>
                    <TagChip size="small" tag={tag} />
                  </div>
                ))}
          </div>
        </Popover>
        <Hidden smUp>
          <Popover
            anchorEl={iconRef.current}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            onClose={() => setOpenPopup(false)}
            open={openPopup}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div className={classes.popoverBalance}>
              <div className={classes.parameterRow}>
                <Typography>{t('accountBalance')}</Typography>
                <Typography className={classes.badgeContainer}>
                  <BalanceChip
                    chipChoice={ONLY_BALANCE}
                    credit={member?.credit_account_balance}
                    unpaidAmount={member?.total_unpaid_amount}
                  />
                </Typography>
              </div>
              {parseFloat(member?.total_unpaid_amount) > 0 && (
                <div className={classes.parameterRow}>
                  <Typography>{t('unpaidInvoiceTitle_plural')}</Typography>
                  <Typography className={classes.badgeContainer}>
                    <BalanceChip
                      chipChoice={ONLY_UNPAID_AMOUNT}
                      credit={member?.credit_account_balance}
                      unpaidAmount={member?.total_unpaid_amount}
                    />
                  </Typography>
                </div>
              )}
            </div>
          </Popover>
        </Hidden>
      </div>

      <Hidden xsDown>
        <Popover
          anchorEl={iconRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          classes={{ paper: classes.paper }}
          className={classes.nonFocusablePopover}
          onClose={() => setOpenBalancePopup(false)}
          open={openBalancePopup}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <div className={classes.popoverBalance}>
            <div className={classes.parameterRow}>
              <Typography>{t('accountBalance')}</Typography>
              <Typography className={classes.badgeContainer}>
                <BalanceChip
                  chipChoice={ONLY_BALANCE}
                  credit={member?.credit_account_balance}
                  unpaidAmount={member?.total_unpaid_amount}
                />
              </Typography>
            </div>
            {parseFloat(member?.total_unpaid_amount) > 0 && (
              <div className={classes.parameterRow}>
                <Typography>{t('unpaidInvoiceTitle_plural')}</Typography>
                <Typography className={classes.badgeContainer}>
                  <BalanceChip
                    chipChoice={ONLY_UNPAID_AMOUNT}
                    credit={member?.credit_account_balance}
                    unpaidAmount={member?.total_unpaid_amount}
                  />
                </Typography>
              </div>
            )}
          </div>
        </Popover>
      </Hidden>

      <div className={classes.container}>
        <div ref={iconRef} className="hoverCircle" />
        {props.children}
        <div
          className={classNames('tagBadgeContainer', {
            tagBadgeContainerAnimated: animation,
            tagBadgeContainerReverse: reverse,
          })}
        >
          {filteredTags?.map((tag: Tag<TagGroup>, index: number) => {
            if (index < NUMBER_OF_TAGS_DISPLAYED) {
              return (
                <div
                  className={classNames('badge', {
                    topLeftCorner: topLeftIcons,
                  })}
                  style={{
                    backgroundColor: tag?.color,
                  }}
                >
                  <TagCircle color={tag.color} icon={tag.icon} />
                </div>
              );
            }

            return (
              <div
                className={classNames('remainingBadge', 'badge', {
                  topLeftCorner: topLeftIcons,
                })}
                style={{
                  backgroundColor: tag?.color,
                }}
              >
                <TagCircle color={tag.color} icon={tag.icon} />
              </div>
            );
          })}
          {(filteredTags?.length || 0) > NUMBER_OF_TAGS_DISPLAYED ? (
            <div
              className={classNames(
                'countRemainingBadge',
                'badge',
                classes.counterBadge,
                { topLeftCorner: topLeftIcons },
              )}
            >
              {`+${(filteredTags?.length || 0) - NUMBER_OF_TAGS_DISPLAYED + 1}`}
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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
  popoverBalance: {
    display: 'flex',
    flexDirection: 'column',
    margin: theme.spacing(0.7),
  },
  tag: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  semiRotation: {
    transform: 'rotateZ(180deg)',
  },
  nonFocusablePopover: {
    pointerEvents: 'none',
    position: 'relative',
    bottom: theme.spacing(2),
  },
  parameterRow: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    flexDirection: 'row',
    margin: theme.spacing(0.3),
  },

  badgeContainer: {
    marginLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
  },
}));

export default React.memo(TagBadge);
