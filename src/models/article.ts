import {App} from "package-app";
import {Column, PrimaryKey, Table, Model, DataType, Default, AllowNull, Index} from "sequelize-typescript";

const sequelize = App.getInstance().getDBConnection();

@Table({tableName: 'articles'})
class Article extends Model<Article> {
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Index('article_search_index')
    @Column(DataType.CHAR(200))
    title: string;

    @Index('article_search_index')
    @Column(DataType.TEXT)
    text: string;

    @Column(DataType.UUIDV4)
    authorId: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    posted: boolean;

    @AllowNull
    @Column(DataType.UUIDV4)
    reviewerId?: string;

    @AllowNull
    @Column(DataType.DATE)
    firstPublishedAt?: Date;

    @Column(DataType.CHAR(400))
    image: string;

    @Column(DataType.DATE)
    createdAt: Date;

    @AllowNull
    @Column(DataType.DATE)
    updatedAt?: Date;
}

export default Article

