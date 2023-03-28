import fs from 'fs';
import admin from 'firebase-admin';
import {db, connectToDb} from './db.js';
import express from 'express';
const port = 8000;

const mongoDbCollection = 'articles';

const credentials = JSON.parse(
    fs.readFileSync('./credentials.json'),
);
admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (req, res, next) => {
    const { authtoken } = req.headers;
    if(authtoken){
        try{
            req.user = await admin.auth().verifyIdToken(authtoken);
        } catch(e) {
            return res.sendStatus(400);
        }
    }

    req.user = req.user || {};

    next();
})

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params;
    const { uid } = req.user;
    console.log('uid');
    console.log(uid);

    const article = await db.collection(mongoDbCollection).findOne({ name });
    
    if(article) {
        const upvoteIds = article.upvoteIds || [];
        article.canUpvote = (uid && !upvoteIds.includes(uid));
        res.json(article);
        console.log(article);
    }
    else {
        res.status(404).send(`Article '${name}' not found`);
    }
});

// middlware with more strict requirements for the endpoints that follow
app.use((req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
});  

app.put('/api/articles/:name/upvote', async (req, res) => {
    const {name} = req.params;
    const { uid } = req.user;
    
    const article = await db.collection(mongoDbCollection).findOne({ name });

    if(article) {
        const upvoteIds = article.upvoteIds || [];
        const canUpvote = uid && !upvoteIds.includes(uid);

        if(canUpvote) {
            await db.collection(mongoDbCollection).updateOne({ name }, {
                $inc: {upvotes: 1},
                $push: { upvoteIds: uid },
            });
        }
        
        const updatedArticle = await db.collection(mongoDbCollection).findOne({ name });
        
        res.send(updatedArticle)
    } else {
        res.send(`The '${name}' article does not exist`)
    }
});

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params;              // extracts param from url
    const { text } = req.body;      // extracts params from payload body
    const { email } = req.user;

    await db.collection(mongoDbCollection).updateOne({ name }, {
        $push: {comments: { postedBy: email, text}}
    });
    const article = await db.collection(mongoDbCollection).findOne({ name });

    if(article) {
        // res.send(`The '${name}' now has ${article.comments.length} comments(s)`)
        res.send(article);
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
