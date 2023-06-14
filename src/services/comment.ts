import Comment from "../models/comment";
import {uuid} from "uuidv4";

export class CommentService {
    public static async createComment(articleId: string, text: string, authorId: string):Promise<Comment> {
        return Comment.create({id: uuid(), articleId: articleId, text, authorId}, {raw: true});
    }

    public static async getArticleComments(articleId: string): Promise<Comment[]> {
        return Comment.findAll({where: {articleId}, order: [[ 'createdAt', 'DESC']], raw: true});
    }

    public static async editComment(commentId: string, comment: Partial<Comment>): Promise<void> {
        await Comment.update({...comment}, {where: {id: commentId}});
    }

    public static async deleteComment(commentId: string): Promise<void> {
        await Comment.destroy({where: {id: commentId}});
    }

    public static async getComment(commentId: string): Promise<Comment | null> {
        return Comment.findByPk(commentId);
    }

    public static getCommentsByAuthor(authorId: string): Promise<Comment[]> {
        return Comment.findAll({where: {authorId}});
    }
}
