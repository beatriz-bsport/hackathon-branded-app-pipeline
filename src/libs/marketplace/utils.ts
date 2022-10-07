import moment from 'moment-timezone';
import { TFunction } from 'i18next';

import { formatAsTime } from '../../utils/datetime';
import Config from '../../config';
import { Offer, Offer_FULL } from '#libs/offer/types';
import { Establishment } from '#libs/establishment/types';
import { Theme } from '#libs/theme/types';

export function isOfferInThePast(offer: Offer | Offer_FULL) {
  if (!offer) return false;
  return !moment(offer.date_start).isSameOrBefore(moment());
}

export function isOfferBookableYet(offer: Offer_FULL) {
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

export const getOfferHours = (
  offer: Offer_FULL,
  establishment: Establishment,
  theme: Theme,
) => {
  if (offer.date_start && establishment?.tzname) {
    const startMoment = moment(offer?.date_start).tz(establishment?.tzname);
    const startHour = formatAsTime(startMoment.format(), establishment?.tzname);

    const endMoment = moment(offer?.date_start)
      .add(moment.duration(offer?.duration_minute, 'minutes'))
      .tz(establishment?.tzname);

    if (!endMoment.isSame(startMoment, 'day')) {
      return startHour;
    }
    const endHour = formatAsTime(endMoment.format(), establishment?.tzname);

    return `${startHour} - ${endHour}`;
  }

  if (offer.date_start) {
    const startMoment = moment(offer?.date_start).tz(theme.timezone_name);
    const startHour = startMoment.format('HH:mm');

    const endMoment = moment(offer?.date_start)
      .add(moment.duration(offer?.duration_minute, 'minutes'))
      .tz(theme.timezone_name);
    const endHour = endMoment.format('HH:mm');

    if (!endMoment.isSame(startMoment, 'day')) {
      return startHour;
    }

    return `${startHour} - ${endHour}`;
  }
  return '';
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
