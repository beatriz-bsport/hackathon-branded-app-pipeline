// @ts-nocheck
import moment from 'moment-timezone';
import { TFunction } from 'i18next';
import Fuse from 'fuse.js';
import { Immutable } from 'seamless-immutable';

import Config from '../../config';

import { MarketplaceOfferStatus, Offer, Offer_FULL } from '#libs/offer/types';
import type { PaymentPackCategoryWithPacks } from '#libs/payment-packs/types';
import type { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
import type { OffersGroup } from '#libs/group-offer/types';
import type { Establishment } from '#libs/establishment/types';
import type { Coach } from '#libs/associated-coach/types';
import type { MetaActivity } from '#libs/meta-activity/types';

export function isOfferInThePast(offer: Offer | Offer_FULL) {
  if (!offer) return false;
  return moment(offer.date_start).isBefore(moment());
}
export function firstOfferInGroupLocksBookingBecauseInPast(
  offerInGroup: Offer_FULL,
  offerGroup?: OffersGroup,
) {
  if (offerGroup?.first_offer_date) {
    return moment(offerGroup.first_offer_date).isSameOrBefore(moment());
  }
  if (!offerInGroup?.group || offerInGroup.group.allow_booking_after_start) {
    return false;
  }
  return moment(offerInGroup.group.first_offer_date).isSameOrBefore(moment());
}

export function isOfferBookableYet(
  offer: Offer_FULL,
  metaActivity: MetaActivity,
) {
  if (metaActivity && !metaActivity.first_booking_minutes_until) {
    return true;
  }
  if (metaActivity) {
    return moment(offer.date_start)
      .add(-metaActivity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment());
  }
  return null;
}

export function urlToMarketplace(companyName: string, companyId: string) {
  return `/m/${encodeURI(companyName)}/${companyId}`;
}

export function urlToMarketplaceTab(
  companyName: string,
  companyId: string,
  path: string,
) {
  return `${urlToMarketplace(companyName, companyId)}/${path}`;
}

export const doTextSearch = (
  searchText: string,
  coaches: Array<Coach>,
  establishments: Array<Establishment>,
  metaActivities: Array<MetaActivity>,
) => {
  let estIds = null;
  let actIds = null;
  let coachIds = null;
  if (searchText) {
    const fuseEstablishments = new Fuse(establishments, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['title'],
    });
    const resultEstablishments = fuseEstablishments.search(searchText);
    estIds = resultEstablishments.map((est) => est.id);

    const fuseMetaActivities = new Fuse(metaActivities, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['name'],
    });
    const resultMetaActivities = fuseMetaActivities.search(searchText);
    actIds = resultMetaActivities.map((act) => act.id);

    const fuseCoaches = new Fuse(coaches, {
      shouldSort: true,
      threshold: 0.3,
      distance: 100,
      keys: ['name'],
    });
    const resultCoaches = fuseCoaches.search(searchText);
    coachIds = resultCoaches.map((coach) => coach.id);
  }
  return [coachIds, estIds, actIds];
};

export class WidgetCodeStringGenerator {
  static indent(code: string, indentCount: number) {
    const indent = '    ';

    let str = ``;
    const lines = code.split('\n');
    lines.forEach((a) => {
      str += `${indent.repeat(indentCount)}${a}\n`;
    });

    return str;
  }

  static getComponentConfigString(componentConfig: any, indentCount: number) {
    const indent = '    ';

    let componentConfigCode = ``;
    const stringified = JSON.stringify(componentConfig || {}, null, 4);
    const linesCode = stringified.split('\n');
    linesCode.forEach((a, i) => {
      if (i > 0 && i < linesCode.length - 1) {
        let lineEnd = '\n';
        if (i === linesCode.length - 2) {
          lineEnd = '';
        }
        componentConfigCode += `${indent.repeat(indentCount)}${a}${lineEnd}`;
      }
    });

    return componentConfigCode;
  }

  static getString(args: {
    company: number;
    franchise: number;
    componentType: string;
    config: any;
    useIframe: boolean;
    responsiveIframe: boolean;
    dialogMode: 0 | 1 | 2;
    language?: string;
    showFab: boolean;
    uuid?: string | null;
    fullScreenPopup: boolean;
    styles: any;
    isBackofficePreview?: boolean;
  }) {
    const componentConfig = args.config[args.componentType];

    let languageValue = '';
    if (args.language && args.language !== 'none') {
      languageValue = `
        "language": "${args.language}",`;
    }

    let url = `https://${Config.REACT_APP_CDN_DOMAIN}`;

    if (url.includes('localhost')) {
      url = `http://${Config.REACT_APP_CDN_DOMAIN}/widget.js`;
    } else {
      url += '/scripts/widget.js';
    }

    const code = `<script id="insert-bsport-widget-cdn">!function (b, s, p, o, r, t) { !typeof window.BsportWidget !== "undefined" && !document.getElementById("bsport-widget-cdn") && !function () { m = b.createElement(s), m.id = "bsport-widget-cdn", m.src = p, b.getElementsByTagName("head")[0].appendChild(m) }() }(document, "script", "${url}")</script>
    <script id="bsport-widget-mount">
        function MountBsportWidget(config, repeat=1) {
            if (repeat > 50) { return }
            if (!window.BsportWidget) {
                return setTimeout(() => {
                    MountBsportWidget(config,repeat+1)
                }, 100 * repeat || 1)
            }
            BsportWidget.mount(config)
        }
    </script>
    <script>
        MountBsportWidget({
                "parentElement": "bsport-widget${args.uuid || ''}",
                "companyId": ${args.company},
                "franchiseId": ${args.franchise},
                "dialogMode": ${args.dialogMode},
                "widgetType": "${args.componentType}",${languageValue} 
                "showFab": ${args.showFab},
                "fullScreenPopup": ${args.fullScreenPopup},
                "styles":${JSON.stringify(args.styles)},
                "config": {
                    "${
                      args.componentType
                    }": {${WidgetCodeStringGenerator.getComponentConfigString(
      componentConfig,
      3,
    )}}
                }${
                  args.isBackofficePreview
                    ? ', "isBackofficePreview": true'
                    : ''
                }  
            })
    </script>
<div><div id="bsport-widget${args.uuid || ''}"/></div>`;

    if (args.useIframe) {
      if (args.responsiveIframe) {
        return `<div style="overflow:hidden !important; position:relative; padding-top:125vh;">
  <iframe style="position:absolute; 
          overflow-x:hidden !important; 
          height:100%; width:100%; 
          left:0;
          top:0;
          border:0;" 
          frameborder="0" 
          allowfullscreen 
          srcdoc='
  ${WidgetCodeStringGenerator.indent(code, 4)}'>
  </iframe>
</div>`;
      }
      return `<iframe srcdoc='
    <div>
${WidgetCodeStringGenerator.indent(code, 2)}    </div>
'>
</iframe>
`;
    }
    return code;
  }
}

export function httpParser(url: string) {
  const regex = /^https?:\/\//;
  return regex.test(url) ? url : `http://${url}`;
}

export const getBookingButtonTraduction = (
  offer: Offer_FULL,
  metaActivity: MetaActivity,
  isRegistered: boolean = false,
  t: TFunction,
) => {
  if (offer?.group?.full_booking_only && metaActivity) {
    return getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly(
      offer,
      metaActivity,
      isRegistered,
      t,
    );
  }
  let text = offer.full
    ? t('translation:marketplace.bookButton.bookOption')
    : t('translation:marketplace.bookButton.book');

  if (isOfferInThePast(offer)) {
    text = t('translation:marketplace.bookButton.isPast');
  }
  if (!offer.available) {
    text = t('translation:marketplace.bookButton.notAvailable');
  }
  if (!isOfferBookableYet(offer, metaActivity)) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }

  if (isRegistered) {
    text = t('translation:marketplace.bookButton.alreadyRegistered');
  }
  return text;
};

const getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly = (
  offer: Offer_FULL,
  metaActivity: MetaActivity,
  isRegistered: boolean = false,
  t: TFunction,
) => {
  // group.full_booking_only has to be true to enter here
  const { group } = offer;
  const { allow_booking_after_start, first_offer_date } = group;
  if (isRegistered) {
    return t('translation:marketplace.bookButton.alreadyRegistered');
  }
  if (!offer.available) {
    return t('translation:marketplace.bookButton.notAvailable');
  }
  if (offer.full) {
    return t('translation:marketplace.bookButton.full');
  }

  let text = t('translation:marketplace.bookButton.book');
  if (!allow_booking_after_start) {
    if (moment(first_offer_date).isSameOrBefore(moment())) {
      text = t('translation:marketplace.bookButton.isPast');
    }
    if (
      !moment(first_offer_date)
        .subtract(metaActivity.first_booking_minutes_until, 'minutes')
        .isSameOrBefore(moment())
    ) {
      text = t('translation:marketplace.bookButton.notBookableYet');
    }
  } else if (isOfferInThePast(offer)) {
    return t('translation:marketplace.bookButton.isPast');
  } else if (moment(first_offer_date).isSameOrBefore(moment())) {
    return t('translation:marketplace.bookButton.book');
  } else if (
    !moment(first_offer_date)
      .subtract(metaActivity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment())
  ) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }
  return text;
};

export const getPositionOfOfferInTheList = (offers: Offer[], index: number) => {
  const position: ('first' | 'last')[] = [];
  if (index === 0) {
    position.push('first');
  }
  if (index === (offers?.length || 1) - 1) {
    position.push('last');
  }
  return position;
};

// pass page - parse the categories from router params to array of numbers if any
export const getParsedPassRestrictedCategories = (
  paymentPackCategoriesRouterParam: string,
  privatePassCategoriesRouterParam: string,
) => {
  let paymentPackCategories = null;
  let privatePassCategories = null;

  if (paymentPackCategoriesRouterParam) {
    paymentPackCategories =
      typeof paymentPackCategoriesRouterParam === 'string'
        ? paymentPackCategoriesRouterParam
            .split(',')
            .map((id: string) => parseInt(id, 10))
        : paymentPackCategoriesRouterParam;
  }

  if (privatePassCategoriesRouterParam) {
    privatePassCategories =
      typeof privatePassCategoriesRouterParam === 'string'
        ? privatePassCategoriesRouterParam
            .split(',')
            .map((id: string) => parseInt(id, 10))
        : privatePassCategoriesRouterParam;
  }

  return { paymentPackCategories, privatePassCategories };
};

// pass page category filter - get all of the available categories
export const getPassFilterAvailableCategories = (
  paymentPackByCategory: Immutable<PaymentPackCategoryWithPacks[]>,
  privatePassByCategory: Immutable<PrivatePassCategoryWithPasses[]>,
  restrictedCategories: {
    paymentPack: number[] | null;
    privatePass: number[] | null;
  },
  t: TFunction,
) => {
  const parsedPaymentPackCategories = paymentPackByCategory
    .filter((category: PaymentPackCategoryWithPacks) =>
      restrictedCategories.paymentPack?.length
        ? restrictedCategories.paymentPack.includes(category.id)
        : category,
    )
    .filter((category: PaymentPackCategoryWithPacks) => !!category.packs.length)
    .filter((category: PaymentPackCategoryWithPacks) => !!category.name)
    .map((category: PaymentPackCategoryWithPacks) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  const parsedPrivatePassCategories = privatePassByCategory
    .filter((cat: PrivatePassCategoryWithPasses) =>
      restrictedCategories.privatePass?.length
        ? restrictedCategories.privatePass.includes(cat.id)
        : cat,
    )
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.passes.length)
    .filter((cat: PrivatePassCategoryWithPasses) => !!cat.name)
    .map((category: PrivatePassCategoryWithPasses) => {
      return {
        label: category.name,
        value: category.id,
      };
    });

  // add the option "No category" with all other options
  const availableCategories = [
    ...parsedPaymentPackCategories,
    ...parsedPrivatePassCategories,
    {
      label: t('marketplace:pass.filters.noCategory'),
      value: null,
    },
  ];

  return availableCategories;
};

export const getOfferStatus = (
  offer: Offer,
  metaActivity: MetaActivity,
  isRegistered: boolean,
) => {
  if (!offer) {
    return null;
  }
  if (offer.group?.full_booking_only && metaActivity) {
    return getGroupOfferSetAsFullBookingOnlyStatus(
      offer,
      metaActivity,
      isRegistered,
    );
  }
  if (isRegistered) {
    return MarketplaceOfferStatus.BOOKED;
  }
  if (!offer.available) {
    return MarketplaceOfferStatus.CANCELLED;
  }
  if (isOfferInThePast(offer)) {
    return MarketplaceOfferStatus.COMPLETED;
  }
  if (offer.full) {
    return MarketplaceOfferStatus.WAITING_LIST;
  }
  if (!isOfferBookableYet(offer, metaActivity)) {
    return MarketplaceOfferStatus.SOON;
  }
  return MarketplaceOfferStatus.BOOKABLE;
};

export const getGroupOfferSetAsFullBookingOnlyStatus = (
  offer: Offer<number, number, number, number, number, OffersGroup>,
  metaActivity: MetaActivity,
  isRegistered: boolean,
) => {
  // group.full_booking_only has to be true to enter here
  // offer can't be undefined, neither metaActivity

  const { allow_booking_after_start, first_offer_date } = offer.group;

  if (isRegistered) {
    return MarketplaceOfferStatus.BOOKED;
  }
  if (!offer.available) {
    return MarketplaceOfferStatus.CANCELLED;
  }
  if (offer.full) {
    return MarketplaceOfferStatus.WAITING_LIST;
  }
  if (!allow_booking_after_start) {
    if (moment(first_offer_date).isSameOrBefore(moment())) {
      return MarketplaceOfferStatus.COMPLETED;
    }
    if (
      !moment(first_offer_date)
        .subtract(metaActivity?.first_booking_minutes_until, 'minutes')
        .isSameOrBefore(moment())
    ) {
      return MarketplaceOfferStatus.SOON;
    }
  } else if (isOfferInThePast(offer)) {
    return MarketplaceOfferStatus.COMPLETED;
  } else if (moment(first_offer_date).isSameOrBefore(moment())) {
    return MarketplaceOfferStatus.BOOKABLE;
  } else if (
    !moment(first_offer_date)
      .subtract(metaActivity?.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment())
  ) {
    return MarketplaceOfferStatus.SOON;
  }
  return MarketplaceOfferStatus.BOOKABLE;
};
