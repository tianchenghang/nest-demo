import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Email } from './email.entity';

@Entity()
export class People {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  // @Index()
  name: string;

  @Column({ default: 0 })
  age: number;

  @OneToMany(() => Email, (email) => email.people)
  emailList: Email[];
}
