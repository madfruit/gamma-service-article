import Article from "../models/article";
import Comment from "../models/comment";
import {Op} from "sequelize";
import {Sequelize} from "sequelize-typescript";
import {raw} from "@prisma/client/runtime";

export class ArticleService {
    public static async getArticle(id: string): Promise<Article | null> {
        const article = await Article.findByPk(id, {include: [Comment]});
        const viewCount = article.viewCount + 1;
        await Article.update({viewCount}, {where: {id}});
        return article.get({plain: true});
    }

    public static async getPostedOrSelfArticle(id: string, authorId?: string): Promise<Article | null> {
        const article = (await Article.findOne({where: {id}, include: [Comment] })).get({plain: true});
        if(article.authorId === authorId || article.posted) {
            await Article.update({viewCount: article.viewCount + 1}, {where: {id}});
            return article;
        }
    }

    public static async getArticles(text: string, order: string, orderBy: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        const articlesByTitle = await Article.findAll({
            where: {
                title: {
                    [Op.like]: `%${text}%`
                },
                posted: true
            }, order: [[orderBy, order]], raw: true, offset: (page -1) * 20, limit: 20
        });
        const articlesByText = await Article.findAll({
            where: {
                text: {
                    [Op.like]: `%${text}%`
                },
                posted: true
            }, order: [[orderBy, order]], raw: true
        });
        const result: Article[] = [];
        [...articlesByTitle, ...articlesByText].map((article) => {
            if(!result.find(a => a.id === article.id)) {
                result.push(article);
            }
        });

        return result;
    }

    public static getArticlesForReview(page?: number, title?: string, authorId?: string): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        if(!title && !authorId) {
            return Article.findAll({where: { posted: false }, order: [['updatedAt', 'DESC']], offset: (page -1) * 20, limit: 20});
        } else if(title && !authorId) {
            return Article.findAll({where: { posted: false, title }, order: [['updatedAt', 'DESC']], offset: (page -1) * 20, limit: 20});
        } if(!title && authorId) {
            return Article.findAll({where: { posted: false, authorId }, order: [['updatedAt', 'DESC']], offset: (page -1) * 20, limit: 20});
        } else {
            return Article.findAll({where: {title, authorId}, order: [['updatedAt', 'DESC']], offset: (page -1) * 20, limit: 20});
        }
    }

    public static getArticlesByAuthor(authorId: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({ where: { authorId, posted: false }, offset: (page -1) * 20, limit: 20 });
    }

    public static getMyArticles(authorId: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({where: {authorId}, offset: (page -1) * 20, limit: 20});
    }

    public static getArticlesByTags(tags: string[], order: string, orderBy: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({where: {tags: {[Op.contains]: tags }, posted: true}, offset: (page -1) * 20, limit: 20, order: [[orderBy, order]] });
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
