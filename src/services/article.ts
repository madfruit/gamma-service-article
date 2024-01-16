import Article from "../models/article";
import Comment from "../models/comment";
import {Op} from "sequelize";

const limit = 10;

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
        return Article.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${text}%`
                },
                posted: true
            }, order: [[orderBy, order]], raw: true, offset: (page -1) * limit, limit
        });
    }

    public static getArticlesForReview(page?: number, title?: string, authorId?: string): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        if(!title && !authorId) {
            return Article.findAll({where: { posted: false }, order: [['updatedAt', 'DESC']], offset: (page -1) * limit, limit});
        } else if(title && !authorId) {
            return Article.findAll({where: { posted: false, title: { [Op.iLike]: `%${title}%`} }, order: [['updatedAt', 'DESC']], offset: (page -1) * limit, limit});
        } if(!title && authorId) {
            return Article.findAll({where: { posted: false, authorId }, order: [['updatedAt', 'DESC']], offset: (page -1) * limit, limit});
        } else {
            return Article.findAll({where: {title: { [Op.iLike]: `%${title}%`}, authorId}, order: [['updatedAt', 'DESC']], offset: (page -1) * limit, limit});
        }
    }

    public static getArticlesByAuthor(authorId: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({ where: { authorId, posted: false }, offset: (page -1) * limit, limit });
    }

    public static getMyArticles(authorId: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({where: {authorId}, offset: (page -1) * limit, limit});
    }

    public static getArticlesByTags(tags: string[], order: string, orderBy: string, page?: number): Promise<Article[]> {
        if(!page) {
            page = 1;
        }
        return Article.findAll({where: {tags: {[Op.contains]: tags }, posted: true}, offset: (page -1) * limit, limit, order: [[orderBy, order]] });
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
