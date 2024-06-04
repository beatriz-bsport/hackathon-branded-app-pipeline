import React, { useCallback, useState } from 'react';
import BottomDrawer, {
  Props as BottomDrawerProps,
} from '#Fabrique/BottomDrawer';
import IconButton from '#Fabrique/IconButton';
import Typography from '#Fabrique/Typography';
import type { Props as ButtonProps } from '#Fabrique/ButtonV2';
import type { InfoButtonSeverityType } from '#csscomponents/InfoButton/types';
import '#csscomponents/InfoButton/styles.css';
import { PortalContainer } from '#Fabrique/PortalContainer';

type Props = {
  buttonProps?: ButtonProps;
  bottomDrawerProps?: BottomDrawerProps;
  icon: React.ReactElement;
  severity: InfoButtonSeverityType;
  text: string;
  title: string;
};

const InfoBottomDrawer: React.FC<Props> = ({
  buttonProps,
  bottomDrawerProps,
  icon,
  severity,
  text,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <>
      <IconButton
        className="bs-info-button__icon-button"
        color={severity}
        onClick={handleOpen}
        variant="text"
        {...buttonProps}
      >
        {icon}
      </IconButton>
      <PortalContainer wrapperId="bs-fabrique-info-button-portal-container">
        <BottomDrawer
          className="bs-info-button__bottom-drawer"
          {...bottomDrawerProps}
          blanketProps={{ isOpen, onClick: handleClose }}
          modalDialogProps={{ title, onClose: handleClose }}
        >
          <Typography>{text}</Typography>
        </BottomDrawer>
      </PortalContainer>
    </>
  );
};

export default React.memo(InfoBottomDrawer);
