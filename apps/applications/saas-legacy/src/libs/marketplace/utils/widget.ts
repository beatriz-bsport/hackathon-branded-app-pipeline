import Config from '../../../config';

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

    const code = `<script id="insert-bsport-widget-cdn">!function (b, s, p, o, r, t) { typeof window.BsportWidget === "undefined" && !document.getElementById("bsport-widget-cdn") && !function () { m = b.createElement(s), m.id = "bsport-widget-cdn", m.src = p, b.getElementsByTagName("head")[0].appendChild(m) }() }(document, "script", "${url}")</script>
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
<div id="bsport-widget${args.uuid || ''}"></div>`;

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
