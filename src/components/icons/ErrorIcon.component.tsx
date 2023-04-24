// @ts-nocheck
import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';

export const ErrorIcon: React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.validationIcon}>
        <svg
          width="70"
          height="70"
          viewBox="0 0 54 54"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classes.checkIcon}
        >
          <path
            d="M2.28218 2.28206C3.21975 1.34478 4.4912 0.818237 5.81692 0.818237C7.14265 0.818237 8.41409 1.34478 9.35166 2.28206L27.0304 19.9608L44.7091 2.28206C45.652 1.37134 46.9149 0.867403 48.2258 0.878795C49.5367 0.890186 50.7907 1.41599 51.7176 2.34296C52.6446 3.26994 53.1704 4.52391 53.1818 5.83479C53.1932 7.14568 52.6893 8.4086 51.7785 9.35154L34.0998 27.0302L51.7785 44.7089C52.6893 45.6519 53.1932 46.9148 53.1818 48.2257C53.1704 49.5366 52.6446 50.7905 51.7176 51.7175C50.7907 52.6445 49.5367 53.1703 48.2258 53.1817C46.9149 53.1931 45.652 52.6891 44.7091 51.7784L27.0304 34.0997L9.35166 51.7784C8.40872 52.6891 7.1458 53.1931 5.83492 53.1817C4.52403 53.1703 3.27006 52.6445 2.34309 51.7175C1.41611 50.7905 0.890308 49.5366 0.878917 48.2257C0.867526 46.9148 1.37146 45.6519 2.28218 44.7089L19.9609 27.0302L2.28218 9.35154C1.3449 8.41397 0.818359 7.14252 0.818359 5.8168C0.818359 4.49108 1.3449 3.21963 2.28218 2.28206Z"
            fill="#F73C39"
          />
        </svg>

        <svg
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="55" cy="55" r="55" fill="rgba(247, 60, 57, 0.3)" />
        </svg>
      </div>
    </div>
  );
};
const useStyles = makeStyles<Theme>(() => ({
  checkIcon: {
    position: 'absolute',
  },
  container: { display: 'flex' },
  validationIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
export default ErrorIcon;
