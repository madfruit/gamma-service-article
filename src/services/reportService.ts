import {uuid} from "uuidv4";
import Report from "../models/report";
import Comment from '../models/comment';

export class ReportService {
    public static async createReport(commentId: string, userId: string): Promise<void> {
        await Report.create({ id: uuid(), commentId, userId });
    }

    public static async getAllReports(): Promise<Report[]> {
        return Report.findAll({ include: [Comment] });
    }
}
