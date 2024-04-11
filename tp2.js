const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('Hello You!');
});

app.get('/greet', (req, res) => {
    const name = req.query.name || "You";
    res.send(`Hello, ${name}!`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});