import { Action, Payload } from 'package-app';
import {ArticleActionName, GetArticlePayload, RequestAddArticlePayload, Role} from "package-types";
import {ArticleService} from "../services/article";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";

export default new class GetObjectById implements Action{
    getName(): string{
        return ArticleActionName.GetArticle;
    }

    getValidationSchema(): any {
        return {
            id: { type:'string'},
            currentUser: { type: 'object', optional: true, nullable: true, props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetArticlePayload>): Promise<any> {
        const { id, currentUser } = payload.params;
        if(currentUser && currentUser.role === Role.AUTHOR) {
            return ArticleService.getArticle(id);
        }
        return ArticleService.getPostedArticle(id);
    }
}





