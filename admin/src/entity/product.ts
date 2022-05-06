import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Product {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({unique: true})
	title!: string;

	@Column({unique: true})
	image!: string;

	@Column({ default: 0 })
	likes!: number;
}