import {uuid} from "uuidv4";
import Report from "../models/report";
import Comment from '../models/comment';

export class ReportService {
    public static async createReport(commentId: string, userId: string): Promise<void> {
        await Report.create({ id: uuid(), commentId, userId });
    }

    public static async getAllReports(): Promise<Report[]> {
        const reports = await Report.findAll({ include: [Comment] });
        return reports.map(report => {
            return report.get({plain: true});
        });
    }

    public static async getReportByCommentAndUserId(commentId: string, userId: string): Promise<Report | undefined> {
        return Report.findOne({where: {commentId, userId}});
    }

    public static async deleteReport(id: string): Promise<void> {
        await Report.destroy({where: {id}});
    }
}
