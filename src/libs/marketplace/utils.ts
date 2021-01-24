import moment from 'moment-timezone';
import {
  MarketplaceComponentConfig,
  Offer,
  WidgetComponentsEnum,
} from './types';

import Config from '../../config';

export function isOfferInThePast(offer: Offer) {
  return !moment(offer.date_start).isSameOrBefore(moment());
}

export function isOfferBookableYet(offer: Offer) {
  if (offer.meta_activity) {
    return moment(offer.date_start)
      .add(-offer.meta_activity.first_booking_minutes_until, 'minutes')
      .isSameOrBefore(moment());
  }
  return null;
}

export function urlToMarketplace(companyName: string, companyId: string) {
  return `/m/${companyName.replace(' ', '-')}/${companyId}`;
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
    const stringified = JSON.stringify(componentConfig, null, 4);
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
    componentType: WidgetComponentsEnum;
    config: MarketplaceComponentConfig;
    useIframe: boolean;
  }) {
    const componentConfig = args.config[args.componentType];
    const code = `<script src="https://${
      Config.REACT_APP_CDN_DOMAIN
    }/scripts/widget.js"></script>
<script> 
    BsportWidget.mount({
        "parentElement": "bsport-widget",
        "companyId": ${args.company},
        "widgetType": "${args.componentType}",
        "config": {
            "${args.componentType}": {
${WidgetCodeStringGenerator.getComponentConfigString(
  componentConfig,
  3,
)}                   
            }
        }  
    })
</script>
<div id="bsport-widget"/>`;

    if (args.useIframe) {
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
