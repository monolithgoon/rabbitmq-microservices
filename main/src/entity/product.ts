import {Column, Entity, ObjectIdColumn, ObjectID} from "typeorm";

@Entity("product")
export class Product {
    @ObjectIdColumn()
    id!: string;
    // id!: ObjectID;

    @Column({unique: true})
    admin_product_id!: number;

    @Column()
    title!: string;

    @Column()
    image!: string;

    @Column({default: 0})
    likes!: number;
}
