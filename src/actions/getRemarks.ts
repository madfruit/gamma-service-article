import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName,
    GetRemarksPayload, GetRemarksResult,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {RemarkService} from "../services/remark";

export default new class GetObjectById implements Action{
    getName(): string{
        return ArticleActionName.GetRemarks;
    }

    getValidationSchema(): any {
        return {
            articleId: { type:'string'},
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetRemarksPayload>): Promise<GetRemarksResult> {
        const { articleId } = payload.params;
        try {
            const remarks = await RemarkService.getRemarks(articleId);
            return { remarks };
        } catch (err) {
            App.logError(err);
        }
    }
}





