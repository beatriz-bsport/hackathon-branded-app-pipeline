// @flow

export default function parse(url: string) {
  const pos = url.lastIndexOf('?');
  if (pos === -1) {
    return {};
  }

  const qs = url.substring(pos + 1);
  const params = qs.split('&').map((q) => q.split('=').map(decodeURIComponent));

  const q = {};
  params.forEach(([name, value]) => {
    q[name] = value;
  });

  return q;
}
