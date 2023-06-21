import { App, Action, Payload} from 'package-app';
import {
    ArticleActionName,
    DeleteArticlePayload,
    DeleteArticleResult
} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";

export default new class DeleteArticle implements Action {
    getName(): string {
        return ArticleActionName.DeleteArticle;
    }

    getValidationSchema(): any {
        return {
            articleId: {type: 'string'},
            currentUser: {type: 'object', props: CurrentUserSchema}
        }
    }

    async execute(payload: Payload<DeleteArticlePayload>): Promise<DeleteArticleResult> {
        const {articleId} = payload.params;
        try {
            await ArticleService.deleteArticle(articleId);
            return {success: true};
        } catch (err) {
            App.logError(err);
            return {success: false};
        }
    }
}





