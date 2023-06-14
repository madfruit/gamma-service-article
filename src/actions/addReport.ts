import {App, Action, Payload} from 'package-app';
import {
    AddReportPayload,
    AddReportResult,
    ArticleActionName,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {ReportService} from "../services/reportService";

export default new class AddReport implements Action{
    getName(): string{
        return ArticleActionName.AddReport;
    }

    getValidationSchema(): any {
        return {
            commentId: { type: 'string' },
            currentUser: { type: 'object', props: CurrentUserSchema }
        }
    }

    async execute(payload: Payload<AddReportPayload>): Promise<AddReportResult> {
        const { commentId, currentUser } = payload.params;
        try {
            await ReportService.createReport(commentId, currentUser.id);
            return { success: true };
        } catch (err) {
            App.logError(err);
            return { success: false };
        }
    }
}





