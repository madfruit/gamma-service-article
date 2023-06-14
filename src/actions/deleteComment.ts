import {App, Action, Payload} from 'package-app';
import { ArticleActionName, DeleteCommentPayload, DeleteCommentResult } from "package-types";
import {CommentService} from "../services/comment";

export default new class DeleteComment implements Action{
    getName(): string{
        return ArticleActionName.DeleteComment;
    }

    getValidationSchema(): any {
        return {
            commentId: { type: 'string' },
        }
    }

    async execute(payload: Payload<DeleteCommentPayload>): Promise<DeleteCommentResult> {
        const { commentId } = payload.params;
        try {
            await CommentService.deleteComment(commentId);
            return { success: true };
        } catch (err) {
            App.logError(err);
            return { success: false };
        }
    }
}





