export function getStripeErrorMessage(t, i18n, errorCode, declineCode) {
  if (!errorCode) return null;

  const tCode = `stripe:errors.${errorCode}`;
  const message = i18n.exists(tCode)
    ? t(tCode)
    : t('stripe:errors.processing_error');
  const reason = i18n.exists(`stripe.errors.${declineCode}`)
    ? t(`stripe:errors.${declineCode}`)
    : null;
  return `${message}${reason ? `\n${reason}` : ''}`;
}
