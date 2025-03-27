import classNames from "classnames";
import React from "react";

import "./index.css";

type GiftcardPreviewProps = {
  amount: string;
  amountHint: string;
  buyerName: string;
  buyerNameHint: string;
  companyCover?: string;
  customMessage?: string;
  giftcardImage?: string;
  giftcardName: string;
  recipientName: string;
  recipientNameHint: string;
};

/** TODO
 * Make this a business component
 * Intentionaly no translations are computed internally,
 * Because Business and Kaizen components internationalization is not configured
 */
const GiftcardPreview: React.FC<GiftcardPreviewProps> = ({
  amount,
  amountHint,
  buyerName,
  buyerNameHint,
  companyCover,
  customMessage,
  giftcardImage,
  giftcardName,
  recipientName,
  recipientNameHint,
}) => {
  return (
    <div className="giftcard-preview__card">
      {giftcardImage && (
        <img
          src={giftcardImage}
          alt={`Selected image : ${giftcardImage}`}
          className="giftcard-preview__image"
        />
      )}
      <div
        className={classNames("giftcard-preview__content-container", {
          "giftcard-preview__content-container__full": !giftcardImage,
          "giftcard-preview__content-container__partial": !!giftcardImage,
        })}
      >
        <h4 className="giftcard-preview__title">{giftcardName}</h4>
        <p className="giftcard-preview__hint">{buyerNameHint}</p>
        <p className="giftcard-preview__data">{buyerName}</p>
        <p className="giftcard-preview__hint">{recipientNameHint}</p>
        <p className="giftcard-preview__data">{recipientName}</p>
        <p className="giftcard-preview__data-weaker">{customMessage}</p>
        <div className="giftcard-preview__footer">
          <div className="giftcard-preview__footer-value">
            <p className="giftcard-preview__hint">{amountHint}</p>
            <p className="giftcard-preview__data-stronger">{amount}</p>
          </div>
          <img
            src={companyCover || ""}
            alt="Company cover"
            className="giftcard-preview__company-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default GiftcardPreview;
