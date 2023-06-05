import Comment from "../models/comment";
import {uuid} from "uuidv4";

export class CommentService {
    public static async createComment(articleId: string, text: string, authorId: string):Promise<void> {
        await Comment.create({id: uuid(), articleId: articleId, text, authorId});
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
}
