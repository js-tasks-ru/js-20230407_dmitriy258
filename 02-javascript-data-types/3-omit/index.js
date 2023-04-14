/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    let omitObj = Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, value]));
    for (let i = 1; i < arguments.length; i++) {
        if (arguments[i] in omitObj) {
                delete omitObj[arguments[i]];
        }
}
    return omitObj;
};
