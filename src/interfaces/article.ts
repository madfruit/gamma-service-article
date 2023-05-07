export interface Article {
    id: string;
    title: string;
    text: string;
    author: string;
    authorName: string;
    posted: boolean;
    reviewer?: string;
    reviewerName?: string;
    createdAt: Date;
    updatedAt: Date;
    firstPublishedAt?: Date;
}
