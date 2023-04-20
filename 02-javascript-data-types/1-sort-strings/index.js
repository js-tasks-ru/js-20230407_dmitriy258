/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let narr = [...arr];
    
if (param === 'asc') {
    return narr.sort((a,b) => {
        return a.localeCompare(b, ["ru", "en"], {caseFirst: "upper"})
    });
} else if (param === 'desc') {
    return narr.sort((a,b) => {
        return -1 * a.localeCompare(b, ["ru", "en"], {caseFirst: "upper"})
});
  }
}
