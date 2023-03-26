import {db, connectToDb} from './db.js';
import express from 'express';
const port = 8000;

const mongoDbCollection = 'articles';

const app = express();
app.use(express.json());

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;

    const article = await db.collection(mongoDbCollection).findOne({ name });
    
    if(article) {
        res.json(article);
    }
    else {
        res.status(404).send(`Article '${name}' not found`);
    }
})

app.put('/api/articles/:name/upvote', async (req, res) => {
    const {name} = req.params;

    await db.collection(mongoDbCollection).updateOne({ name }, {
        $inc: {upvotes: 1}
    });

    const article = await db.collection(mongoDbCollection).findOne({ name });

    if(article) {
        res.send(`The '${name}' now has ${article.upvotes} upvote(s)`)
    } else {
        res.send(`The '${name}' article does not exist`)
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const {name} = req.params;              // extracts param from url
    const {postedBy, text} = req.body;      // extracts params from payload body

    await db.collection(mongoDbCollection).updateOne({ name }, {
        $push: {comments: { postedBy, text}}
    });
    const article = await db.collection(mongoDbCollection).findOne({ name });
    

    if(article) {
        // res.send(`The '${name}' now has ${article.comments.length} comments(s)`)
        res.send(article.comments);
    } else {
        res.status(400).send(`The '${name}' article does not exist`)
    }
});

connectToDb(() => {
    console.log('successfully connected to database');
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    })
})
