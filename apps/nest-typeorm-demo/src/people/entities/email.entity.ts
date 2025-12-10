import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { People } from './people.entity';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  addr: string;

  @ManyToOne(() => People, (people) => people.emailList)
  people: People;
}
