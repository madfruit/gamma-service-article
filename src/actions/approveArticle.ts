import { App, Action, Payload} from 'package-app';
import {ApproveArticlePayload, ArticleActionName} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";

export default new class ApproveArticle implements Action {
    getName(): string {
        return ArticleActionName.ApproveArticle;
    }

    getValidationSchema(): any {
        return {
            articleId: {type: 'string'},
            currentUser: {type: 'object', props: CurrentUserSchema}
        }
    }

    async execute(payload: Payload<ApproveArticlePayload>): Promise<any> {
        const {articleId, currentUser} = payload.params;
        const date = new Date();
        try {
            await ArticleService.editArticle(articleId, {
                posted: true,
                reviewer: currentUser.id,
                reviewerName: currentUser.name,
                firstPublishedAt: date
            });
            return {success: true};
        } catch (err) {
            App.logError(err);
            return {success: false};
        }
    }
}





