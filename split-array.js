/**
 *
 * @param elements - array of elements to split, string[]
 * @param maxElementSize - maximum size of an element, i.e. length of a string
 * @param maxBatchSize - maximum size of a batch, i.e. sum of lengths of all elements in a batch
 * @param maxBatchLength - maximum number of elements in a batch
 */
export function splitArray(elements, maxElementSize, maxBatchSize, maxBatchLength) {
    const { batches: processedBatches } = elements
        .filter(e => e?.length <= maxElementSize)
        .reduce((state, e) => {
            const { batches, currentBatchSize } = state;
            const currentBatch = batches[batches.length - 1];
            const currentBatchLength = currentBatch.length;
            const batchSizeAfterUpdate = currentBatchSize + e.length;
            const batchLengthAfterUpdate = currentBatchLength + 1;
            if (batchLengthAfterUpdate > maxBatchLength || batchSizeAfterUpdate > maxBatchSize) {
                batches.push([e]);
                return { batches, currentBatchSize: e.length };
            }
            currentBatch.push(e);
            return { batches, currentBatchSize: batchSizeAfterUpdate };
        }, { batches: [[]], currentBatchSize: 0 });
    if (processedBatches[processedBatches.length - 1].length === 0) {
        processedBatches.pop();
    }
    return processedBatches;
}

const MAX_ELEMENT_SIZE = 1024 * 1024; // 1MB
const MAX_BATCH_SIZE = 1024 * 1024 * 5; // 5MB
const MAX_BATCH_LENGTH = 500;

export function splitArrayWithDefaultParameters(elements) {
    return splitArray(elements, MAX_ELEMENT_SIZE, MAX_BATCH_SIZE, MAX_BATCH_LENGTH);
}
