var average = (item) => {
    var total = item.reviews.map(r => r.rating).reduce((a, b) => a + b);
    return total / item.reviews.length;
};

export default function(items, filter) {
    var filterBy = parseInt(filter, 10);
    return filterBy ? items.filter(i => average(i) >= filterBy) : items;
}
