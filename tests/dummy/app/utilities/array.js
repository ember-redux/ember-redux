export function uniq(first, second) {
    let ret = [];
    const collection = first.concat(second);
    collection.forEach((k) => {
        const found = ret.filter(item => {
            return item.id === k.id;
        });
        if (found.length < 1) {
            ret.push(k);
        }
        // else update the object to reflect the latest
    });
    return ret;
}
