export function uniq(first, second) {
    let ret = [];
    const collection = first.concat(second);
    collection.forEach((k) => {
        var found = ret.findIndex((item) => item.id === k.id);
        if (found === -1) {
            ret.push(k);
        }else{
            ret.replace(found, 1, k);
        }
    });
    return ret;
}
