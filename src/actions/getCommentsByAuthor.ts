import {App, Action, Payload} from 'package-app';
import {
    ArticleActionName, GetCommentsByAuthorPayload, GetCommentsByAuthorResult,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {CommentService} from "../services/comment";

export default new class GetComments implements Action{
    getName(): string{
        return ArticleActionName.GetCommentsByAuthor;
    }

    getValidationSchema(): any {
        return {
            authorId: { type: 'string' },
            currentUser: { type: 'object', props: CurrentUserSchema, optional: true, nullable: true }
        }
    }

    async execute(payload: Payload<GetCommentsByAuthorPayload>): Promise<GetCommentsByAuthorResult> {
        const { authorId } = payload.params;
        try {
            const comments = await CommentService.getCommentsByAuthor(authorId);
            return { comments };
        } catch (err) {
            App.logError(err);
            return { comments: []};
        }
    }
}





