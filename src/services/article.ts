import Article from "../models/article";
import {Op} from "sequelize";

export class ArticleService {
    public static async getArticle(id: string): Promise<Article | null> {
        return Article.findByPk(id, {raw: true});
    }

    public static async getPostedArticle(id: string): Promise<Article | null> {
        return Article.findOne({where: {id, posted: true}, raw: true});
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

    public static async createArticle(title: string, text: string, authorId: string, image: string): Promise<Article> {
        return Article.create({title, text, authorId, image, posted: false, createdAt: new Date()});
    }

    public static async editArticle(articleId: string, article: Partial<Article>): Promise<void> {
        await Article.update({...article}, {where: {id: articleId}});
    }

    public static async deleteArticle(articleId: string): Promise<void> {
        await Article.destroy({where: {id: articleId}});
    }
}
