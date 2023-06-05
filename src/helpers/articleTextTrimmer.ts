import Article from "../models/article";

export default function articleTextTrimmer(articles: Article[]) {
    articles.map(article => {
        article.text = article.text.slice(0, 197) + '...';
    });
    return articles;
}
