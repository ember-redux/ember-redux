export function uniq(first, second) {
  let ret = [];
  const collection = first.concat(second);
  collection.forEach((k) => {
    var found = ret.findIndex((item) => {
      var itemId = item.id || item.get('id');
      var kId = k && k.id || k && k.get('id');
      return itemId === kId;
    });
    if (found === -1) {
      ret.push(k);
    }else{
      ret.splice(found, 1, k);
    }
  });
  return ret;
}
