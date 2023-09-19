import omit from 'lodash/omit';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Linkify from 'react-linkify';

type Props = {
  children: string;
  variant?:
    | 'inherit'
    | 'body1'
    | 'body2'
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'inherit'
    | 'subtitle1'
    | 'subtitle2'
    | 'overline'
    | undefined;
  className?: string;
  color?:
    | 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error'
    | undefined;
  style?: React.CSSProperties;
};

const TypographyMultiline: React.FC<Props> = (props) => (
  <Typography
    component="div"
    {...omit(props, [
      'classes',
      'defaultNS',
      'i18n',
      'i18nOptions',
      'reportNS',
      't',
      'tReady',
      'multiline',
    ])}
  >
    <Linkify>
      <p style={{ whiteSpace: 'pre-line' }}>{props.children || ''}</p>
    </Linkify>
  </Typography>
);

export default React.memo(TypographyMultiline);
