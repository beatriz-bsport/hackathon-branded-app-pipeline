import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { Theme } from 'bsport-saas/src/libs/theme/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';


type Props = {
  theme: Theme
} & MaterialStyleType<ReturnType<typeof styles>>

const BsportLogo = (props) => {
    const classes = useStyles();
    return (
      <div className={classes.poweredByContainer}>
        <div className={classes.centerRight}>
          <a
            className={classes.poweredBy}
            href={`https://pro.bsport.io?utm_source=widget&utm_medium=referral&utm_content=bsport_logo&utm_campaign=${(
              props.theme.company_name || ''
            ).replace(/\//gi, '-')}`}
          >
            <Typography color="textSecondary" variant="caption">
              Powered by
            </Typography>
            <img
              alt="bsport"
              className={classes.logo}
              src="https://cdn.bsport.io/bsport_logo_txt.png"
            />
          </a>
        </div>
      </div>
    );
};

const useStyles = makeStyles(() => ({
  poweredByContainer: {
    width: '100% !important',
    backgroundColor: 'transparent !important',
  },
  centerRight: {
    display: 'flex !important',
    width: '100% !important',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent !important',
  },
  poweredBy: {
    backgroundColor: 'transparent !important',
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'flex-end !important',
    padding: 18,
    '&>*': {
      textDecoration: 'none !important', // not working ?
    },
  },
  logo: {
    maxHeight: '24px !important',
    backgroundColor: 'transparent !important',
  },
}));

// @ts-ignore
export default BsportLogo;
