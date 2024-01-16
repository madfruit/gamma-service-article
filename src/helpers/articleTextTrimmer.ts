import Article from "../models/article";

export default function articleTextTrimmer(articles: Article[]) {
    articles.map(article => {
        const imgRegexp = new RegExp('<img([\\w\\W]+?)/>', 'g');
        article.text = article.text.replace(imgRegexp, '');
        article.text = article.text.replace('\n', ' ');
        article.text = article.text.slice(0, 197) + '...';
    });
    return articles;
}
