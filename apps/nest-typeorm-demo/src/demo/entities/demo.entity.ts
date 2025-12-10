import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from 'typeorm';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity()
export class Demo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  gender: Gender;
  @Column({
    type: 'varchar',
    length: 255,
    name: 'password', // 数据库列名
    nullable: true,
    select: false, // 查询实体时, select 语句中是否自动包含该字段
    comment: 'password',
  })
  password: string;
  @Generated('uuid')
  uuid: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  // @Column({ type: 'enum', enum: ['male', 'female'], default: 'male' })
  // gender: 'male' | 'female';
  @Column('simple-array')
  techs: string[]; // 使用 techs.join(',') 存储
  @Column('simple-json')
  p: { name: string; age: number }; // 使用 JSON.stringify(p) 存储
}
