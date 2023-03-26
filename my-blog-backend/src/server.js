import express from 'express';
const port = 8000;

let articlesInfo = [
    {
        name: 'learn-react',
        upvotes: 0,
        comments: [],
    },
    {
        name: 'learn-node',
        upvotes: 0,
        comments: [],
    },
    {
        name: 'mongodb',
        upvotes: 0,
        comments: [],
    },
];

const app = express();
app.use(express.json());

app.post('/hello', (req, res) => {
    console.log(req.body);
    res.send(`hello, ${req.body.name}!`);
});

app.get('/hello/:name', (req, res) => {
    const {name} = req.params;
    res.send(`Hey, ${name} (from url)`);
})

app.put('/api/articles/:name/upvote', (req, res) => {
    const {name} = req.params;
    const article = articlesInfo.find(article => article.name === name);
    if(article) {
        article.upvotes += 1;
        res.send(`The '${name}' now has ${article.upvotes} upvote(s)`)
    } else {
        res.send(`The '${name}' article does not exist`)
    }
});

app.post('/api/articles/:name/new-comment', (req, res) => {
    const {name} = req.params;
    const {postedBy, text} = req.body;
    const article = articlesInfo.find(article => article.name === name);
    if(article) {
        article.comments.push({
            postedBy, text
        });
        // res.send(`The '${name}' now has ${article.comments.length} comments(s)`)
        res.send(article.comments);
    } else {
        res.send(`The '${name}' article does not exist`)
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})