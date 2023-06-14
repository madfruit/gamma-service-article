import {App, Action, Payload} from 'package-app';
import {AddCommentPayload, AddCommentResult, ArticleActionName, CommentWithUser} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {CommentService} from "../services/comment";

export default new class AddComment implements Action{
    getName(): string{
        return ArticleActionName.AddComment;
    }

    getValidationSchema(): any {
        return {
            articleId: { type: 'string' },
            text: {type: 'string', max: 1000},
            currentUser: { type: 'object', props: CurrentUserSchema }
        }
    }

    async execute(payload: Payload<AddCommentPayload>): Promise<AddCommentResult> {
        const { articleId, text, currentUser } = payload.params;
        try {
            const comment = await CommentService.createComment(articleId, text, currentUser.id);
            const commentWithUser = <CommentWithUser>comment;
            commentWithUser.author = currentUser;
            return { comment: commentWithUser };
        } catch (err) {
            App.logError(err);
            return {  };
        }
    }
}





