import {Action, App, Payload} from 'package-app';
import {
    ArticleActionName, DeleteReportPayload, DeleteReportResult,
} from "package-types";
import {CurrentUserSchema} from "package-types/dist/validationSchemas/currentUser";
import {ReportService} from "../services/report";

export default new class DeleteReport implements Action{
    getName(): string{
        return ArticleActionName.DeleteReport;
    }

    getValidationSchema(): any {
        return {
            reportId: { type: 'string' },
            currentUser: { type: 'object', props: CurrentUserSchema }
        };
    }

    async execute(payload: Payload<DeleteReportPayload>): Promise<DeleteReportResult> {
        try {
            await ReportService.deleteReport(payload.params.reportId);
            return { success: true };
        } catch (err) {
            App.logError(err);
            return { success: false };
        }
    }
}





