import Article from "../models/article";
import Comment from "../models/comment";
import {Op} from "sequelize";

export class ArticleService {
    public static async getArticle(id: string): Promise<Article | null> {
        const article = await Article.findByPk(id, {include: [Comment]});
        return article.get({plain: true});
    }

    public static async getPostedArticle(id: string): Promise<Article | null> {
        const article = await Article.findOne({where: {id, posted: true}, include: [Comment] });
        return article.get({plain: true});
    }

    public static async getArticles(text: string): Promise<Article[]> {
        const articlesByTitle = await Article.findAll({
            where: {
                title: {
                    [Op.like]: `%${text}%`
                },
                posted: true
            }, order: [['createdAt', 'DESC']], raw: true
        });
        const articlesByText = await Article.findAll({
            where: {
                text: {
                    [Op.like]: `%${text}%`
                },
                posted: true
            }, order: [['createdAt', 'DESC']], raw: true
        });
        const result: Article[] = [];
        [...articlesByTitle, ...articlesByText].map((article) => {
            if(!result.find(a => a.id === article.id)) {
                result.push(article);
            }
        });

        return result;
    }

    public static getArticlesForReview(title?: string, authorId?: string): Promise<Article[]> {
        if(!title && !authorId) {
            return Article.findAll({where: { posted: false }});
        } else if(title && !authorId) {
            return Article.findAll({where: { posted: false, title }});
        } if(!title && authorId) {
            return Article.findAll({where: { posted: false, authorId }});
        } else {
            return Article.findAll({where: {title, authorId}});
        }
    }

    public static getArticlesByAuthor(authorId: string): Promise<Article[]> {
        return Article.findAll({ where: { authorId, posted: false } });
    }

    public static getMyArticles(authorId: string): Promise<Article[]> {
        return Article.findAll({where: {authorId}});
    }

    public static async createArticle(title: string, text: string, authorId: string, image: string, tags?: string[]): Promise<Article> {
        return Article.create({title, text, tags, authorId, image, posted: false, createdAt: new Date()});
    }

    public static async editArticle(articleId: string, article: Partial<Article>): Promise<void> {
        await Article.update({...article}, {where: {id: articleId}});
    }

    public static async deleteArticle(articleId: string): Promise<void> {
        await Article.destroy({where: {id: articleId}});
    }
}
