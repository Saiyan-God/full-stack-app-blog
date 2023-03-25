import { Link } from 'react-router-dom';
import articles from './article-content';

import ArticlesList from '../components/ArticlesList';

const ArticlesListPage = () => {

    return (
        <>
            <h1>Articles: </h1>
            <ArticlesList articles={articles} />
            {/* <div>
                Alternate way to list all articles
            </div>
            <ul>
                {articles.map(article => (
                    <li key={article.name}>
                        <Link to={`/articles/${article.name}`}>
                            {article.title}
                        </Link>
                    </li>
                ))}
            </ul> */}
        </>
    )
}

export default ArticlesListPage;