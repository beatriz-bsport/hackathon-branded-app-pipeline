import React from 'react';
import { withStyles, Theme, WithTheme } from '@material-ui/core';
import { compose } from 'recompose';
import { MaterialStyleType } from '../../utils/types';

export type OwnProps = {
  text: string;
  highlight: string;
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTheme;

const HighlightedText = (props: Props) => {
  const { text = '', highlight = '', theme } = props;

  const sanitizedRegex = highlight
    ?.toLowerCase()
    ?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const startHighlight = text.toLowerCase().search(sanitizedRegex);

  return (
    <span>
      {startHighlight !== -1 && highlight && (
        <>
          {text.slice(0, startHighlight)}
          <span
            style={{
              backgroundColor: theme.palette.primary.light,
            }}
          >
            {text.slice(startHighlight, startHighlight + highlight.length)}
          </span>
          {text.slice(startHighlight + highlight.length)}
        </>
      )}
      {(startHighlight === -1 || !highlight) && text}
    </span>
  );
};

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  topBar: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(1),
  },
  topBarIconContainer: {
    marginRight: theme.spacing(2),
  },
});

export default compose<any, OwnProps>(withStyles(styles, { withTheme: true }))(
  HighlightedText,
);
