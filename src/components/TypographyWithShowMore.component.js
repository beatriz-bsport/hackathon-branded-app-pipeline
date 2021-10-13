// @flow
import React from 'react';
import omit from 'lodash/omit';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import TypographyMultiline from './TypographyMultiline.component';

type Props = {
  t: TFunction,
  classes: Object,
  multiline: ?boolean,
  children: ?string,
  setShowFullText: (boolean) => void,
  showFullText: boolean,
  maxCharacterCount?: number,
  alignButtonRight: ?boolean,
};

export const TypographyWithShowMore = (props: Props) => {
  const TypographyComponent = props.multiline
    ? TypographyMultiline
    : Typography;
  const text = props.children || '';
  const maxCharacterCount = props.maxCharacterCount || 400;
  const textIsLong = text.length > maxCharacterCount;
  const textTruncated = text.slice(0, maxCharacterCount);
  return (
    <div>
      <TypographyComponent
        {...omit(props, ['setShowFullText', 'showFullText'])}
      >
        {`${props.showFullText ? text : textTruncated}${
          !props.showFullText && textIsLong ? '...' : ''
        }`}
      </TypographyComponent>
      {textIsLong ? (
        <div
          className={
            props.alignButtonRight
              ? props.classes.buttonRightContainer
              : props.classes.buttonLeftContainer
          }
        >
          <ButtonBase
            disableRipple
            onClick={(ev) => {
              ev.stopPropagation();
              props.setShowFullText(!props.showFullText);
            }}
            className={props.classes.showMoreButton}
          >
            <Typography variant="body2" color="secondary">
              {props.showFullText
                ? props.t('text.showLessText')
                : props.t('text.showMoreText')}
            </Typography>
          </ButtonBase>
        </div>
      ) : null}
    </div>
  );
};

const styles = (theme) => ({
  buttonLeftContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  buttonRightContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  showMoreButton: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    '&:hover': {
      opacity: 0.5,
    },
    '&:before': {
      opacity: 1,
    },
  },
});

export default compose(
  withStyles(styles),
  withState('showFullText', 'setShowFullText', false),
  withTranslation(['common']),
)(TypographyWithShowMore);
