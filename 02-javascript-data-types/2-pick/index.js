/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    let pickObj = {};
    for (let i = 1; i < arguments.length; i++) {
            for (let key in obj) {
                if (key === arguments[i]) {
                    pickObj[key] = obj[key];
                }
            }
    }
    return pickObj;
};
