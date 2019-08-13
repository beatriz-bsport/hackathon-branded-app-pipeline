// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import TypographyMultiline from './TypographyMultiline.component';

type Props = {
  t: TFunction,
  classes: Object,
  multiline: ?boolean,
  children: ?string,
  setShowFullText: (boolean) => void,
  showFullText: boolean,
};

export const TypographyWithSowMore = (props: Props) => {
  const TypographyComponent = props.multiline
    ? TypographyMultiline
    : Typography;
  const text = props.children || '';
  const textIsLong = text.length > 400;
  const textTruncated = text.slice(0, 400);
  return (
    <div>
      <TypographyComponent {...props}>
        {`${props.showFullText ? text : textTruncated}${
          !props.showFullText && textIsLong ? '...' : ''
        }`}
      </TypographyComponent>
      {textIsLong ? (
        <ButtonBase
          disableRipple
          onClick={() => props.setShowFullText(!props.showFullText)}
        >
          <Typography
            variant="body2"
            color="secondary"
            className={props.classes.showMoreButton}
          >
            {props.showFullText
              ? props.t('text.showLessText')
              : props.t('text.showMoreText')}
          </Typography>
        </ButtonBase>
      ) : null}
    </div>
  );
};

const styles = () => ({
  showMoreButton: {
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
  withNamespaces(['common']),
)(TypographyWithSowMore);
