import React, { useEffect, useRef, useState } from 'react';
import Popover from '@material-ui/core/Popover';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import chroma from 'chroma-js';
import { useTranslation } from 'react-i18next';
import Hidden from '@material-ui/core/Hidden';
import TagCircle from './TagCircle.component';
import { Tag, TagGroup } from '../../../tag/types';
import './TagBadge.css';
import TagChip from '../../../tag/components/TagChip.component';
import BalanceChip from '#libs/member/components/BalanceChip.component';
import { Member } from '#libs/member/types';
import { ONLY_BALANCE, ONLY_UNPAID_AMOUNT } from '#libs/member/constants';

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
            {!!tags &&
              tags
                .filter((tag) => tag.icon && tag.color)
                .map((tag) => (
                  <div className={classes.tag}>
                    <TagChip tag={tag} size="small" />
                  </div>
                ))}
          </div>
        </Popover>
        <Hidden smUp>
          <Popover
            onClose={() => setOpenPopup(false)}
            anchorEl={iconRef.current}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={openPopup}
          >
            <div className={classes.popoverBalance}>
              <div className={classes.parameterRow}>
                <Typography>{t('accountBalance')}</Typography>
                <Typography className={classes.badgeContainer}>
                  <BalanceChip
                    credit={member?.credit_account_balance}
                    unpaidAmount={member?.total_unpaid_amount}
                    chipChoice={ONLY_BALANCE}
                  />
                </Typography>
              </div>
              {parseFloat(member?.total_unpaid_amount) > 0 && (
                <div className={classes.parameterRow}>
                  <Typography>{t('unpaidInvoiceTitle_plural')}</Typography>
                  <Typography className={classes.badgeContainer}>
                    <BalanceChip
                      credit={member?.credit_account_balance}
                      unpaidAmount={member?.total_unpaid_amount}
                      chipChoice={ONLY_UNPAID_AMOUNT}
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
          className={classes.nonFocusablePopover}
          classes={{ paper: classes.paper }}
          onClose={() => setOpenBalancePopup(false)}
          anchorEl={iconRef.current}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={openBalancePopup}
        >
          <div className={classes.popoverBalance}>
            <div className={classes.parameterRow}>
              <Typography>{t('accountBalance')}</Typography>
              <Typography className={classes.badgeContainer}>
                <BalanceChip
                  credit={member?.credit_account_balance}
                  unpaidAmount={member?.total_unpaid_amount}
                  chipChoice={ONLY_BALANCE}
                />
              </Typography>
            </div>
            {parseFloat(member?.total_unpaid_amount) > 0 && (
              <div className={classes.parameterRow}>
                <Typography>{t('unpaidInvoiceTitle_plural')}</Typography>
                <Typography className={classes.badgeContainer}>
                  <BalanceChip
                    credit={member?.credit_account_balance}
                    unpaidAmount={member?.total_unpaid_amount}
                    chipChoice={ONLY_UNPAID_AMOUNT}
                  />
                </Typography>
              </div>
            )}
          </div>
        </Popover>
      </Hidden>

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
                  <TagCircle icon={tag.icon} color={tag.color} />
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
                <TagCircle icon={tag.icon} color={tag.color} />
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

export default TagBadge;
