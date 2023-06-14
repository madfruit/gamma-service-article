import {App, Action, Payload} from 'package-app';
import {ArticleActionName, RejectArticlePayload, RejectArticleResult} from "package-types";
import {ArticleService} from "../services/article";
import {RemarkService} from "../services/remark";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";

export default new class RejectArticle implements Action{
    getName(): string{
        return ArticleActionName.RejectArticle;
    }

    getValidationSchema(): any {
        return {
            articleId: {type: 'string'},
            remarks: [
                {type: 'array', items: {type: 'string', max: 1000}},
                {type: 'string', max: 1000}
            ],
            currentUser: { type: 'object', props: CurrentUserSchema }
        }
    }

    async execute(payload: Payload<RejectArticlePayload>): Promise<RejectArticleResult> {
        const { articleId, currentUser, remarks } = payload.params;
        const remarksForDb = typeof remarks === 'string' ? [remarks] : remarks;
        try {
            await ArticleService.editArticle(articleId, {
                posted: false,
                reviewerId: currentUser.id
            });
            const result = await RemarkService.createRemarks(articleId, remarksForDb, currentUser.id);
            return { remarks: result };
        } catch (err) {
            App.logError(err);
        }
    }
}





