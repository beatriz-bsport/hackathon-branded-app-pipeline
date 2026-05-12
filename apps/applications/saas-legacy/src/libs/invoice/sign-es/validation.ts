import * as Yup from 'yup';

/**
 * Validates Spanish NIF (Número de Identificación Fiscal) or NIE (Número de Identidad de Extranjero).
 *
 * DNI format: 8 digits followed by 1 letter (e.g., 12345678Z)
 * NIE format: 1 letter (X, Y, or Z) followed by 7 digits and 1 letter (e.g., X1234567L)
 *
 * The check letter is calculated using modulo 23 on the numeric part.
 */
export const validateSpanishNIF = (nif: string | null | undefined): boolean => {
  if (!nif) return true; // Optional field

  const normalizedNif = nif.trim().toUpperCase();

  // DNI: 8 digits followed by 1 letter
  // NIE: 1 letter (X, Y, Z) followed by 7 digits and 1 letter
  const nifPattern = /^(\d{8}[A-Z]|[XYZ]\d{7}[A-Z])$/;
  if (!nifPattern.test(normalizedNif)) {
    return false;
  }

  // Extract digits and check letter based on format
  let digits: string;
  let letter: string;

  if (normalizedNif[0].match(/\d/)) {
    // DNI format: 8 digits + letter
    digits = normalizedNif.slice(0, 8);
    letter = normalizedNif[8];
  } else {
    // NIE format: letter + 7 digits + letter
    // Convert initial letter to digit for calculation: X=0, Y=1, Z=2
    const nieLetterMap: Record<string, string> = { X: '0', Y: '1', Z: '2' };
    digits = nieLetterMap[normalizedNif[0]] + normalizedNif.slice(1, 8);
    letter = normalizedNif[8];
  }

  // Validate check letter using Spanish NIF/NIE algorithm
  // The letter is determined by: digits % 23, then lookup in the letter table
  const nifLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const expectedLetter = nifLetters[parseInt(digits, 10) % 23];

  return letter === expectedLetter;
};

export const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('common:requiredField'),
  last_name: Yup.string().required('common:requiredField'),
  dni_nie: Yup.string().test(
    'spanish-nif',
    'configuration.verifactu.form.dni_nie_invalid',
    validateSpanishNIF,
  ),
  address: Yup.string(),
  street_number: Yup.string(),
  postal_code: Yup.string().test(
    'postal-code-format',
    'configuration.verifactu.form.postal_code_invalid',
    (value) => {
      if (!value || value.trim() === '') return true; // Optional field
      const trimmed = value.trim();
      if (trimmed.length < 3 || trimmed.length > 10) return false;
      return /^[a-zA-Z0-9\s-]+$/.test(trimmed);
    },
  ),
  city: Yup.string(),
  municipality: Yup.string(),
  country: Yup.string(),
});
