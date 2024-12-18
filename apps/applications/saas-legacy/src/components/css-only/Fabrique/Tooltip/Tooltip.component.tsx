import React, { useCallback } from 'react';

import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';

import './styles.css';

export type Props = {
  id: string;
  children: React.ReactNode;
  text: string;
};

const Tooltip: React.FC<Props> = ({ id, children, text }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <div
      className="bs-tooltip__container"
      id={id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <Popper
        disablePortal
        transition
        anchorEl={anchorEl}
        className="bs-tooltip__popper"
        open={!!anchorEl}
        placement="bottom"
      >
        {({ TransitionProps }) => (
          <div className="bs-tooltip">
            <Fade {...TransitionProps} timeout={100}>
              <p className="bs-tooltip__text">{text}</p>
            </Fade>
          </div>
        )}
      </Popper>
    </div>
  );
};

export default React.memo(Tooltip);
