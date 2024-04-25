import React from 'react';
import { useTranslation } from 'react-i18next';

import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import { formatAsDate } from '#utils/datetime';

import ConsumerCardSection from '#libs/consumer-space/components/reworked/common/ConsumerCardSection';
import List from '#Fabrique/List';
import ListItem from '#Fabrique/ListItem';
import Typography from '#Fabrique/Typography';
import type { ConsumerSubscriptionDetailsCardProps } from '..';
import CircularProgress from '#components/css-only/CircularProgress';
import Button from '#Fabrique/ButtonV2';
import classNames from 'classnames';
import IconButton from '#components/css-only/Fabrique/IconButton';
import { FileDownload02 } from '#components/untitledui';

type Props = Pick<
  ConsumerSubscriptionDetailsCardProps,
  | 'areDetailsLoading'
  | 'handleInvoiceDetailsPaginationFetchMore'
  | 'hasDetailsNextPage'
  | 'selectedSubscriptionInvoiceDetails'
>;

const DownloadPdfButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <IconButton size="md" color="grey" variant="outlined" onClick={onClick}>
      <FileDownload02 stroke="currentColor" />
    </IconButton>
  );
};

const ConsumerSubscriptionDetailsCardBillingHistory: React.FC<Props> = ({
  areDetailsLoading,
  selectedSubscriptionInvoiceDetails,
  handleInvoiceDetailsPaginationFetchMore,
  hasDetailsNextPage,
}) => {
  const { t } = useTranslation('consumerSpace');

  const handleDownloadInvoice = (invoicePdf: string) => () => {
    if (!invoicePdf) return;
    window.open(invoicePdf);
  };

  return (
    <ConsumerCardSection
      className="bs-consumer__subscription-details-card__description__section"
      title={t(
        'reworked.mySubscriptions.consumerSubscriptionCardDetails.billingHistory',
      )}
    >
      {areDetailsLoading ? (
        <CircularProgress size="sm" />
      ) : (
        <List>
          {selectedSubscriptionInvoiceDetails?.length ? (
            selectedSubscriptionInvoiceDetails.map((item) => (
              <ListItem
                captionText={getCurrencyDisplayWithPrice(
                  (parseFloat(item.amount_paid_cts) / 100).toString(),
                )}
                classes={{
                  label:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__title',
                  captionText:
                    'bs-consumer__subscription-details-card__failed_payments__section__list-item__caption-text',
                }}
                className="bs-consumer__subscription-details-card__failed_payments__section__list-item"
                label={formatAsDate(item.date)}
                rightSlot={
                  <DownloadPdfButton
                    onClick={handleDownloadInvoice(item.stripe_invoice_pdf)}
                  />
                }
              />
            ))
          ) : (
            <Typography variant="body-md">
              {t(
                'reworked.mySubscriptions.consumerSubscriptionCardDetails.emptyInvoices',
              )}
            </Typography>
          )}
        </List>
      )}

      <Button
        className={classNames(
          'bs-consumer__subscription-details-card__billing_history__load_button',
          {
            'bs-consumer__subscription-details-card__billing_history__load_button--hidden':
              !hasDetailsNextPage,
          },
        )}
        color="primary"
        onClick={handleInvoiceDetailsPaginationFetchMore}
        variant="text"
      >
        {t('reworked.mySubscriptions.consumerSubscriptionCardDetails.loadMore')}
      </Button>
    </ConsumerCardSection>
  );
};

export default React.memo(ConsumerSubscriptionDetailsCardBillingHistory);
