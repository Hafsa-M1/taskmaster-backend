import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ 
    default: 0, 
    type: 'bigint', // Keep as bigint but use transformer
    transformer: {
      to: (value: number) => value, // Store as number
      from: (value: any) => {
        // Convert from database value to JavaScript number
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
          const num = parseInt(value, 10);
          return isNaN(num) ? 0 : num;
        }
        if (typeof value === 'bigint') return Number(value);
        return 0;
      }
    }
  })
  timeSpent: number;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}