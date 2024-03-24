import {splitArray, splitArrayWithDefaultParameters} from "./split-array";

describe('splitArray', () => {
    it('limits batch length and size and preserves the order of elements', () => {
        const elements = [
            '0-0123456789',  // 12
            '1-012345678',   // 10
            // ---- batch 1 - 22
            '2-012345678',   // 10
            '3-01234567890', // 12
            // ---- batch 2 - 22
            '4-0123456789012', // 15
            '5-01234567890123', // 16, too long
            '6-0',  // 3
            '7-0',  // 3
            '8-0',  // 3
            '9-0',  // 3
            // ---- batch 3 - 27
            '10-0', // 4
            '11-0', // 4
            '12-0', // 4
            '13-0', // 4
            '14-0', // 4
            // ---- batch 4 - 20
            '15-0', // 4
            // ---- batch 5 - 4
            ];
        const batches = splitArray(elements, 15, 30, 5);
        expect(batches).toEqual([
            elements.slice(0, 2),
            elements.slice(2, 4),
            [elements[4], ...elements.slice(6, 10)],
            elements.slice(10, 15),
            [elements[15]]
        ]);
    });

    it('returns nu batches when no elements passed', () => {
        expect(splitArray([], 15, 30, 5)).toEqual([]);
    });

    it('handles large data', () => {
        const elements = [
            '0-' + stringOfSize(1000000),
            '1-' + stringOfSize(900000),
            '2-' + stringOfSize(800000),
            '3-' + stringOfSize(800000),
            '4-' + stringOfSize(900000),
            '5-' + stringOfSize(900000),
        ];
        const batches = splitArrayWithDefaultParameters(elements);
        expect(batches).toEqual([
            elements.slice(0, 5),
            [elements[5]]
        ]);
    });
});

function stringOfSize(size) {
    return '0'.repeat(size);
}
