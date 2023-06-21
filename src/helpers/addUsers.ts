import Article from "../models/article";
import Comment from "../models/comment";
import {App} from "package-app";
import {
    GetUsersPayload,
    GetUsersResult,
    ServiceName,
    UsersActionName,
    ArticleWithUsers,
    CommentWithUser,
    ReportWithUser,
    RemarkWithUser
} from "package-types";
import Report from "../models/report";
import Remark from "../models/remark";

export async function addUsersArticles(articles: Article[]): Promise<ArticleWithUsers[]> {
    const userIds: string[] = [];
    articles.forEach((article) => {
        if(!userIds.includes(article.authorId)) {
            userIds.push(article.authorId);
        }
        if(!userIds.includes(article.reviewerId)) {
            userIds.push(article.reviewerId);
        }
        if(article.comments) {
            article.comments.forEach((comment) => {
                userIds.push(comment.authorId);
            });
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return articles.map((article: ArticleWithUsers) => {
        article.author = users.find(u => u.id === article.authorId);
        article.reviewer = users.find(u => u.id === article.reviewerId);
        if(article.comments) {
            article.comments.map((comment) => {
                comment.author = users.find(u => u.id === comment.authorId);
                return comment;
            })
        }
        return article;
    });
}

export async function addUsersComments(comments: Comment[]): Promise<CommentWithUser[]> {
    const userIds: string[] = [];
    comments.forEach((comment) => {
        if(!userIds.includes(comment.authorId)) {
            userIds.push(comment.authorId);
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return comments.map((comment: CommentWithUser) => {
        comment.author = users.find(u => u.id === comment.authorId);
        return comment;
    });
}

export async function addUsersRemarks(remarks: Remark[]): Promise<RemarkWithUser[]> {
    const userIds: string[] = [];
    remarks.forEach((remark) => {
        if(!userIds.includes(remark.authorId)) {
            userIds.push(remark.authorId);
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return remarks.map((remark: RemarkWithUser) => {
        remark.author = users.find(u => u.id === remark.authorId)
        return remark;
    });
}

export async function addUsersReports(reports: Report[]): Promise<ReportWithUser[]> {
    const userIds: string[] = [];
    reports.forEach((report) => {
        if(!userIds.includes(report.userId)) {
            userIds.push(report.userId);
        }
        if(!userIds.includes(report.comment.authorId)) {
            userIds.push(report.comment.authorId);
        }
    });

    const { users } = await App.call<GetUsersPayload, GetUsersResult>(ServiceName.Users, UsersActionName.GetUsers, {userIds});
    return reports.map((report: ReportWithUser) => {
        report.user = users.find(u => u.id === report.userId)
        report.comment.author = users.find(u => u.id === report.comment.authorId);
        return report;
    });
}
