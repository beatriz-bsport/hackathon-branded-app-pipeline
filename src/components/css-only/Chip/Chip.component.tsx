import React from 'react';

import classNames from 'classnames';

import './styles.css';

export type Props = {
  label: string;
  classes?: { [key: string]: string };
  icon?: React.ReactNode;
};

const Chip: React.FC<Props> = ({ label, icon, classes }) => {
  if (!label && !icon) {
    return null;
  }
  return (
    <div className={classNames('bs-chip', { ...classes })}>
      {icon && <span className="bs-chip-icon">{icon}</span>}
      {label && <span>{label}</span>}
    </div>
  );
};

export default React.memo(Chip);
