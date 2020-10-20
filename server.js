const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path')
const apiRouter = require('./express/routes/apiRouter');
const dbConnection = require('./db/connection');
const port = process.env.PORT || 3420;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../build')))
app.use('/onelink', apiRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});

module.exports = app;