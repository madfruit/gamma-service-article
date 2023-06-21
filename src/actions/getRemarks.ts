import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName,
    GetRemarksPayload, GetRemarksResult, Role,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {RemarkService} from "../services/remark";
import {addUsersRemarks} from "../helpers/addUsers";
import {ArticleService} from "../services/article";

export default new class GetObjectById implements Action{
    getName(): string{
        return ArticleActionName.GetRemarks;
    }

    getValidationSchema(): any {
        return {
            articleId: { type:'string'},
            currentUser: { type: 'object', props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetRemarksPayload>): Promise<GetRemarksResult> {
        const { articleId, currentUser } = payload.params;
        try {
            const article = await ArticleService.getArticle(articleId);
            if(article.authorId !== currentUser.id || currentUser.role !== Role.AUTHOR) {
                return { remarks: [] };
            }
            const remarks = await RemarkService.getRemarks(articleId);
            const remarksWithUsers = await addUsersRemarks(remarks);
            return { remarks: remarksWithUsers };
        } catch (err) {
            App.logError(err);
        }
    }
}





