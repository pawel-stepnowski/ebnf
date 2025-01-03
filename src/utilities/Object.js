export class Object
{
    /**
     * @template {string} Keys
     * @template Source
     * @template Target
     * @param {Record<Keys, Source>} object 
     * @param {(value: Source) => Target} map_function 
     * @returns {Record<Keys, Target>}
     */
    static mapProperties(object, map_function)
    {
        const entries = globalThis.Object.entries(object).map(([key, value]) => [key, map_function(value)]);
        return globalThis.Object.fromEntries(entries);
    }
}