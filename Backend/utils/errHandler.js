function handleErr(err, res) {
    const code = err.code || 500;
    const message = err.message || 'Internal server error';

    console.log(err);

    res.status(code).send({ message });
}

module.exports = handleErr;