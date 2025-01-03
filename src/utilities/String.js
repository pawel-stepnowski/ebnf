/**
 * @template T
 * @param {Array<T>[]} arrays 
 * @returns {Array<T>}
 */
export function concat(...arrays)
{
    return arrays.reduce((acc, a) => acc.concat(a), []);
}
