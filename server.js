const bodyParser = require('body-parser');
const express = require ('express');

const app = express();
app.use(bodyParser.json());
app.get('/', (req,res) => {
    res.send("the server is running")
})


app.listen(3000,() => [
    console.log(`port connected`)
])