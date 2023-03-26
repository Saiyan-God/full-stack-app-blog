import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({upvotes: 0, comments: []});

    const { articleId } = useParams();

    useEffect(() => {
            const loadArticleInfo = async () => {
                const response = await axios.get(`/api/articles/${articleId}`); // allowed to ignore the host and port due to 'proxy' field in package.json
                const newArticleInfo = response.data;
                console.log(newArticleInfo);
                setArticleInfo(newArticleInfo);
            }
            loadArticleInfo();
    }, [articleId])


    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const response = await axios.put(`/api/articles/${articleId}/upvote`);
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if(!article) {
        return <NotFoundPage />;
    }

    return (
       
            <>
                <h1>{ article.title }</h1>
                <div className='upvotes-section'>
                    <button onClick={addUpvote}>Upvote</button>
                </div>
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
                {article.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
                {/* <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} /> */}
                <AddCommentForm articleName={articleId} onArticleUpdated={setArticleInfo} />
                <CommentsList comments={articleInfo.comments} />
            </>
    );
}

export default ArticlePage;