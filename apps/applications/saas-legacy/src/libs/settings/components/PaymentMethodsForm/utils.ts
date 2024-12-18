export const addOrRemove = (arr: number[], v: number) => {
  const _arr = [...arr];
  const index = _arr.indexOf(v);
  index === -1 ? _arr.push(v) : _arr.splice(index, 1);
  if (!_arr.length) {
    return arr;
  }
  return _arr;
};
