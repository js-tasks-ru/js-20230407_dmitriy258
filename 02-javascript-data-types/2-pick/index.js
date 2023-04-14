/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    const pickObj = {};
    for (let i = 1; i < arguments.length; i++) {
            if (arguments[i] in obj) {
                pickObj[arguments[i]] = obj[arguments[i]];
            }
    }
    return pickObj;
};
