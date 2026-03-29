import { Comment } from 'src/comments/comments.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterInsert,
  AfterRemove,
  AfterUpdate,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @AfterInsert()
  logInsert() {
    console.log(`User with ID ${this.id} has been inserted.`);
  }
  @AfterRemove()
  logRemove() {
    console.log(`User with ID ${this.id} has been removed.`);
  }
  @AfterUpdate()
  logUpdate() {
    console.log(`User with ID ${this.id} has been updated.`);
  }
}
