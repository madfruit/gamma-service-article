import {App} from "package-app";
import Article from "./article";
import {Column, PrimaryKey, Model, DataType, Table, ForeignKey} from "sequelize-typescript";

const sequelize = App.getInstance().getDBConnection();

@Table({tableName: 'comments'})
class Comment extends Model<Partial<Comment>> {
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column(DataType.UUIDV4)
    @ForeignKey(() => Article)
    articleId: string;

    @Column(DataType.UUIDV4)
    authorId: string;

    @Column(DataType.CHAR(1000))
    text: string;
}

export default Comment;
