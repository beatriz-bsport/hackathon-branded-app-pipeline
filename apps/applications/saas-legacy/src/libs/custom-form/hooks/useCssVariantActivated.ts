import { getTheme } from '#src/libs/theme/selectors';
import { useSelector } from 'react-redux';
import { ID_COMPANIES_CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';

export const useCssVariantActivated = () => {
  const companyTheme = useSelector(getTheme);
  if (!companyTheme) {
    console.warn(
      'useCssVariantActivated: No company theme found. Defaulting to false.',
    );
    return false;
  }
  const { company: companyId } = companyTheme;
  return ID_COMPANIES_CUSTOM_FORM_CSS_VARIANT_ACTIVATED.includes(companyId);
};
