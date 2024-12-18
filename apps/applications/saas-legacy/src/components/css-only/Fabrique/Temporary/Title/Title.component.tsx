import React from 'react';
import Typography from '#Fabrique/Typography';
import './styles.css';

export type Props = {
  label: string;
};

const Title: React.FC<Props> = ({ label }) => {
  return (
    <div className="bs-fabrique-title-container">
      <div className="bs-fabrique-title-wrapper">
        <Typography className="bs-fabrique-title" variant="title-sm">
          {label}
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(Title);
