import {App, Action, Payload} from 'package-app';
import {ArticleActionName, RejectArticlePayload} from "package-types";
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
            remarks: {type: 'array', items: {type: 'string', max: 1000}},
            currentUser: { type: 'object', props: CurrentUserSchema }
        }
    }

    async execute(payload: Payload<RejectArticlePayload>): Promise<any> {
        const { articleId, currentUser, remarks } = payload.params;
        try {
            await ArticleService.editArticle(articleId, {
                posted: false,
                reviewerId: currentUser.id
            });
            await RemarkService.createRemarks(articleId, remarks);
            return { success: true };
        } catch (err) {
            App.logError(err);
            return { success: false };
        }
    }
}





