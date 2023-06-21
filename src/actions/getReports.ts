import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName,
    GetReportsPayload,
    GetReportsResult,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {ReportService} from "../services/report";
import {addUsersReports} from "../helpers/addUsers";

export default new class GetReports implements Action{
    getName(): string{
        return ArticleActionName.GetReports;
    }

    getValidationSchema(): any {
        return {
            articleId: { type: 'string', optional: true, nullable: true },
            currentUser: { type: 'object', props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<GetReportsPayload>): Promise<GetReportsResult> {
        try {
            const reports = await ReportService.getAllReports();
            const reportsWithUsers = await addUsersReports(reports);
            return { reports: reportsWithUsers };
        } catch (err) {
            App.logError(err);
            return { reports: [] };
        }
    }
}





