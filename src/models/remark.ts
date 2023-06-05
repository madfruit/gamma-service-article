import {Column, PrimaryKey, Table, Model, DataType, ForeignKey, BelongsTo} from "sequelize-typescript";
import {App} from "package-app";
import Article from "./article";

const sequelize = App.getInstance().getDBConnection();

@Table({ tableName: 'remarks' })
class Remark extends Model<Remark> {
    @PrimaryKey
    @Column({
        type: DataType.UUIDV4,
        defaultValue: DataType.UUIDV4
    })
    id: string;

    @Column(DataType.UUIDV4)
    @ForeignKey(() => Article)
    articleId: string;

    @BelongsTo(() => Article)
    article: Article;

    @Column(DataType.CHAR(500))
    text: string;
}

export default Remark
