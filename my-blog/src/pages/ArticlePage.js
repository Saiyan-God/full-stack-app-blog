import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import useUser from '../hooks/useUser';
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";
import CommentsList from '../components/CommentsList';
import AddCommentForm from '../components/AddCommentForm';

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({upvotes: 0, comments: [], canUpvote: false});
    const { user, isLoading } = useUser();


    const { articleId } = useParams();

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token} : {};
            const response = await axios.get(`/api/articles/${articleId}`, {
                headers,
            }); // allowed to ignore the host and port in endpoint due to 'proxy' field in package.json
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
        };
        if(!isLoading){
            loadArticleInfo();
        }
    }, [isLoading, user, articleId]);


    const article = articles.find(article => article.name === articleId);
    
    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token} : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, {headers});
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if(!article) {
        return <NotFoundPage />;
    }

    console.log(article);

    return (
            <>
                <h1>{ article.title }</h1>
                <div className='upvotes-section'>
                    {user ? (
                        <button onClick={addUpvote}>{articleInfo.canUpvote ? 'Upvote' : 'Already upvoted'}</button>
                    ): (
                        <Link to='/login'>
                            <button>Log in to upvote</button>
                        </Link>
                    )}
                </div>
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
                {article.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
                {user ? (
                    <AddCommentForm articleName={articleId} onArticleUpdated={setArticleInfo} />
                    // {/* <AddCommentForm articleName={articleId} onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} /> */}
                ): (
                    <Link to='/login'>
                        <button>Log in to add comments</button>
                    </Link>
                )}
                <CommentsList comments={articleInfo.comments} />
            </>
    );
}

export default ArticlePage;