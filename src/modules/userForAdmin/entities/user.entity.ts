import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255})
  password: string;

  @Column({ name: 'phone_number', nullable: true , length: 15 })
  phoneNumber: string;

  @Column({ type: 'enum', enum: ['admin', 'customer'], default: 'customer' })
  role: 'admin' | 'customer';

  @Column({ type: 'int', nullable: true })
  age: number;

  @Column({nullable: true})
  photo: string;

  @Column({ name: 'verification_code', nullable: true })
  verificationCode: string;

  @Column({ name: 'is_active', default: true})
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}