import React from 'react';

import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import classNames from 'classnames';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { AlertSeverity } from '.';

import './styles.css';

export type Props = {
  severity: AlertSeverity;
  children: string;
  actionElement?: React.ReactElement;
  className?: string;
};

type AlertIconProps = Pick<Props, 'severity'>;

const AlertIcon = ({ severity }: AlertIconProps) => {
  switch (severity) {
    case AlertSeverity.SUCCESS:
      return <CheckCircleOutlineOutlinedIcon />;
    case AlertSeverity.INFO:
      return <InfoOutlinedIcon />;
    case AlertSeverity.WARNING:
      return <ReportProblemOutlinedIcon />;
    case AlertSeverity.ERROR:
      return <ErrorOutlineOutlinedIcon />;
    default:
      return <></>;
  }
};

const Alert: React.FC<Props> = ({
  severity,
  children,
  actionElement,
  className,
}) => (
  <div
    className={classNames(
      'bs-alert__container',
      {
        'bs-alert__container__success': severity === AlertSeverity.SUCCESS,
        'bs-alert__container__info': severity === AlertSeverity.INFO,
        'bs-alert__container__warning': severity === AlertSeverity.WARNING,
        'bs-alert__container__error': severity === AlertSeverity.ERROR,
      },
      className,
    )}
  >
    {!!severity && (
      <div className="bs-alert__icon__container">
        <AlertIcon severity={severity} />
      </div>
    )}
    <span className="bs-alert__message">{children}</span>
    {!!actionElement && (
      <div className="bs-alert__action__container">{actionElement}</div>
    )}
  </div>
);

export const AlertForStorybook = marketplaceCssHoc()(Alert);

export default React.memo(Alert);
