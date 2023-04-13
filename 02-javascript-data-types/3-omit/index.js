/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    let omitObj = Object.assign({}, obj);
    for (let i = 1; i < arguments.length; i++) {
        for (let key of Object.keys(obj)) {
            if (key === arguments[i]) {
                delete omitObj[key];
            }
        }
}
    return omitObj;
};
