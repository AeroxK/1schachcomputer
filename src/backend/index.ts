import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('dist/assets'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
