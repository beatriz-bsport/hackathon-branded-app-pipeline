import React, { useCallback } from 'react';
import clsx from 'clsx';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import Typography from '#Fabrique/Typography';
import IconButton from '#Fabrique/IconButton';
import { HelpCircle } from '#src/components/untitledui';
import { openIntercomHelp } from '../../../../intercom';
import './styles.css';
import { useCssVariantActivated } from '../../hooks/useCssVariantActivated';

export type Props = {
  title: string;
  isCompany: boolean;
  simplifyUI?: boolean;
};

const CustomFormTitleCSS: React.FC<Props> = ({
  title,
  isCompany,
  simplifyUI,
}) => {
  const handleOpenIntercomHelp = useCallback(() => {
    openIntercomHelp('login');
  }, []);

  const isCssVariantActivated = useCssVariantActivated();

  if (!isCssVariantActivated) return null;

  return (
    <div className="bs-custom-form-title__root">
      <div className="bs-custom-form-title--with-border">
        <Typography className="bs-custom-form-title" variant="title-lg">
          {title}
        </Typography>
        <div
          className={clsx('bs-custom-form-title__rectangle', {
            'bs-custom-form-title__rectangle--hidden': !simplifyUI,
            'bs-custom-form-title__rectangle__company-background': isCompany,
            'bs-custom-form-title__rectangle__default-background': !isCompany,
          })}
        />
        <div
          className={clsx('bs-custom-form-title__icon-button-wrapper', {
            'bs-custom-form-title__icon-button--hidden': !simplifyUI,
          })}
        >
          <IconButton
            className="bs-custom-form-title__icon-button"
            onClick={handleOpenIntercomHelp}
            variant="text"
          >
            <HelpCircle />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export const CustomFormTitleCSSStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof CustomFormTitleCSS>>()(
    CustomFormTitleCSS,
  );
export default React.memo(CustomFormTitleCSS);
