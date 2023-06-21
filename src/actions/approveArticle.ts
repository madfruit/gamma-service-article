import { App, Action, Payload} from 'package-app';
import {ApproveArticlePayload, ApproveArticleResult, ArticleActionName} from "package-types";
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

    async execute(payload: Payload<ApproveArticlePayload>): Promise<ApproveArticleResult> {
        const {articleId, currentUser} = payload.params;
        try {
            const article = await ArticleService.getArticle(articleId);
            if (article.reviewerId && article.reviewerId !== currentUser.id) {
                return { success: false }
            }
            const date = new Date();
            await ArticleService.editArticle(articleId, {
                posted: true,
                reviewerId: currentUser.id,
                firstPublishedAt: date
            });
            return {success: true};
        } catch (err) {
            App.logError(err);
            return {success: false};
        }
    }
}





