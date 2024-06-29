const { db } = require('./db/db');

const app = require('express')();
const PORT = 4000;

app.get('/', (req, res) => {
    res.send({
        message: 'Parking ticket system is running!'
    });
});


app.listen(PORT, async () => {
    try {
        await db;
        console.log("Connected to Database");
    }
    catch (err) {
        console.log(err);
    }

    console.log(`Server started on port ${PORT}`);
})