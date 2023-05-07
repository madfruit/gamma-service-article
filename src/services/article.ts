import { Article as ArticleType } from '../interfaces/article'
import Article from "../models/article";
import { uuid } from 'uuidv4'
import { Table, Column, Model, HasMany } from 'sequelize-typescript';

export class ArticleService {
    public static async getArticle(id: string): Promise<Article | null> {
        const article = await Article.findByPk(id, { raw: true });
        return article;
    }

    public static async getPostedArticle(id: string): Promise<Article | null> {
        const article = await Article.findOne({where: {id, posted: true}, raw: true});
        return article;
    }

    public static async createArticle(title: string, text: string, author: string, authorName: string):Promise<Article> {
        return Article.create({id: uuid(), title, text, author, authorName, posted: false});
    }

    public static async editArticle(articleId: string, article: Partial<ArticleType>) {
        return Article.update({...article}, { where: { id: articleId } });
    }

    public static async deleteArticle(articleId: string) {
        return Article.destroy({where: { id: articleId }});
    }
}
