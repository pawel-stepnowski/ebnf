export class Array
{
    // /**
    //  * @template T
    //  * @template Separator
    //  * @param {T[]} array 
    //  * @param {() => Separator} separator
    //  * @returns {(T | Separator)[]}
    //  */
    // static separateArrayElements(array, separator)
    // {
    //     if (array.length < 2) return array;
    //     const [head, ...tail] = array;
    //     const items = tail.map(item => [separator(), item]);
    //     items.unshift([head]);
    //     return items.flat();
    // }

    /**
     * @template T
     * @param {T[]} items 
     * @param {T[]} [separators] 
     * @returns {T[]}
     */
    static join(items, separators)
    {
        if (!separators) return items;
        const [head_item, ...tail_items] = items;
        if (!head_item) return [];
        const tail = tail_items ? tail_items.map((item, i) => [separators[i], item]) : [];
        tail.unshift([head_item]);
        return tail.flat();
    }
}