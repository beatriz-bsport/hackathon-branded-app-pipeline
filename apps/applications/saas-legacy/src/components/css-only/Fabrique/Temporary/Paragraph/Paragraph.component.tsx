import React from 'react';
import Typography from '#Fabrique/Typography';
import './styles.css';

export type Props = {
  label: string;
};

const Paragraph: React.FC<Props> = ({ label }) => {
  return (
    <div className="bs-fabrique-paragraph-container">
      <div className="bs-fabrique-paragraph-wrapper">
        <Typography className="bs-fabrique-paragraph" variant="body-xs">
          {label}
        </Typography>
      </div>
    </div>
  );
};

export default React.memo(Paragraph);
