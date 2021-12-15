import FacebookPixel from './FacebookPixel';
import GoogleAnalytics from './GoogleAnalytics';

function getAnalytics() {
  const analytics = [];
  analytics.push({
    name: 'GoogleAnalytics',
    methods: GoogleAnalytics.methods,
    apply: GoogleAnalytics.applyMethod,
  });
  analytics.push({
    name: 'FacebookPixel',
    methods: FacebookPixel.methods,
    apply: FacebookPixel.applyMethod,
  });
  analytics.push({
    name: 'SegmentAnalytics',
    methods: window.analytics,
    apply: null,
  });
  return analytics;
}

export const analytics = getAnalytics();

export function createData() {
  const descriptions = [];
  analytics.forEach((e) =>
    e.methods.forEach((el) => {
      if (!descriptions.includes(el.name)) {
        descriptions.push(el.name);
      }
    }),
  );
  return descriptions.map((d) => {
    return {
      description: d,
      analyticSpec: analytics.map((a) => {
        const meth = a.methods.find((e) => e.name === d);
        return meth
          ? {
              name: a.name,
              specs: meth.specs,
              label: meth.translation_key,
            }
          : {
              name: a.name,
              specs: [],
              label: '',
            };
      }),
    };
  });
}
