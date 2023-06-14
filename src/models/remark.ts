import {Column, PrimaryKey, Table, Model, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";
import Article from "./article";

@Table({ tableName: 'remarks' })
class Remark extends Model<Remark> {
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column(DataType.UUIDV4)
    authorId: string;

    @Column(DataType.UUIDV4)
    @ForeignKey(() => Article)
    articleId: string;

    @BelongsTo(() => Article)
    article: Article;

    @Column(DataType.CHAR(500))
    text: string;
}

export default Remark
