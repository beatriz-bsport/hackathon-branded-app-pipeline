// @ts-nocheck
import moment from 'moment-timezone';
import { TFunction } from 'i18next';
import Config from '../../config';
import { Offer, Offer_FULL } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { Theme } from '#libs/theme/types';
import { PaymentPackCategoryWithPacks } from '#libs/payment-packs/types';
import { PrivatePassCategoryWithPasses } from '#libs/private-service/types';
import { MetaActivity } from '#libs/meta-activity/types';

export function isOfferInThePast(offer: Offer | Offer_FULL) {
  if (!offer) return false;
  return !moment(offer.date_start).isSameOrBefore(moment());
}
export function firstOfferInGroupLocksBookingBecauseInPast(
  offerInGroup: Offer_FULL,
) {
  if (!offerInGroup?.group || offerInGroup.group.allow_booking_after_start) {
    return false;
  }
  return moment(offerInGroup.group.first_offer_date).isSameOrBefore(moment());
}
export function isOfferBookableYet(offer: Offer_FULL) {
  if (offer.meta_activity && !offer.meta_activity.first_booking_minutes_until) {
    return true;
  }
  if (offer.meta_activity) {
    return moment(offer.date_start)
      .add(-offer.meta_activity.first_booking_minutes_until, 'minutes')
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

export function httpParser(url) {
  const regex = /^https?:\/\//;
  return regex.test(url) ? url : `http://${url}`;
}

export const getBookingButtonTraduction = (
  offer: Offer_FULL,
  isRegistered: boolean = false,
  t: TFunction,
) => {
  if (offer?.group?.full_booking_only && offer?.meta_activity) {
    return getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly(
      offer,
      isRegistered,
      t,
    );
  }
  let text = offer.full
    ? t('translation:marketplace.bookButton.bookOption')
    : t('translation:marketplace.bookButton.book');

  if (!isOfferInThePast(offer)) {
    text = t('translation:marketplace.bookButton.isPast');
  }
  if (!offer.available) {
    text = t('translation:marketplace.bookButton.notAvailable');
  }
  if (!isOfferBookableYet(offer)) {
    text = t('translation:marketplace.bookButton.notBookableYet');
  }

  if (isRegistered) {
    text = t('translation:marketplace.bookButton.alreadyRegistered');
  }
  return text;
};

const getBookingButtonTraductionForOfferGroupSetAsFullBookingOnly = (
  offer: Offer_FULL,
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
  if (offer.is_full) {
    return t('translation:marketplace.bookButton.full');
  }

  let text = t('translation:marketplace.bookButton.book');
  if (!allow_booking_after_start) {
    if (moment(first_offer_date).isSameOrBefore(moment())) {
      text = t('translation:marketplace.bookButton.isPast');
    }
    if (
      !moment(first_offer_date)
        .subtract(offer.meta_activity.first_booking_minutes_until, 'minutes')
        .isSameOrBefore(moment())
    ) {
      text = t('translation:marketplace.bookButton.notBookableYet');
    }
  } else if (!isOfferInThePast(offer)) {
    return t('translation:marketplace.bookButton.isPast');
  } else if (moment(first_offer_date).isSameOrBefore(moment())) {
    return t('translation:marketplace.bookButton.book');
  } else if (
    !moment(first_offer_date)
      .subtract(offer.meta_activity.first_booking_minutes_until, 'minutes')
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
  paymentPackByCategory: PaymentPackCategoryWithPacks[],
  privatePassByCategory: PrivatePassCategoryWithPasses[],
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
        value: category.id?.toString(),
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
        value: category.id?.toString(),
      };
    });

  const availableCategories = [
    ...parsedPaymentPackCategories,
    ...parsedPrivatePassCategories,
    {
      label: t('marketplace:pass.filters.noCategory'),
      value: '',
    },
  ];

  return availableCategories;
};
