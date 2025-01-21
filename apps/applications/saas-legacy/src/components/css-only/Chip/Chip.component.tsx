import React from 'react';

import clsx from 'clsx';

import './styles.css';

export type Props = {
  label?: string;
  classes?: { [key: string]: string | boolean };
  icon?: React.ReactNode;
};

const Chip: React.FC<Props> = ({ label, icon, classes }) => {
  if (!label && !icon) {
    return null;
  }
  return (
    <div className={clsx('bs-chip', { ...classes })}>
      {icon && <span className="bs-chip-icon">{icon}</span>}
      {label && <span>{label}</span>}
    </div>
  );
};

export default React.memo(Chip);
