/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let narr = arr;
    narr.sort(function(a, b) {
        if (a.localeCompare(b) > 0) {
            if (a.toLowerCase() === b.toLowerCase()) {
            return -1
            } else {
            return a.localeCompare(b); 
            }
        } else {
            return a.localeCompare(b);
        }
    });
if (param === 'asc') {
    
    return narr;
} else {
    narr.reverse();
    return narr;
}
}
