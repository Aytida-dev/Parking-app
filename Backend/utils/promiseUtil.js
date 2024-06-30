async function runPromise(promise) {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        console.error(error);
        return [null, error];
    }
}

module.exports = runPromise