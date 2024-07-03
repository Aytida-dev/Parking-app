const { db } = require('./db/db');

const app = require('express')();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 4000;

app.get('/', (req, res) => {
    res.send({
        message: 'Parking ticket system is running!'
    });
});

require('./routes/organisation.routes')(app);
require('./routes/infrastructure.routes')(app);
require('./routes/building.routes')(app);
require('./routes/occupency.routes')(app);
require('./routes/spots.routes')(app);

app.listen(PORT, async () => {
    try {
        console.log("connecting to db....");
        await db;
        console.log("Connected to db!");
    }
    catch (err) {
        console.log(err);
    }

    console.log(`Server started on port ${PORT}`);
})