import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

export const createAdminUser = async (dataSource: DataSource) => {
  const userRepo = dataSource.getRepository(User);

  const adminEmail = 'example@gmail.com';
  const existingAdmin = await userRepo.findOne({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = userRepo.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await userRepo.save(admin);
    console.log('✅ Admin user created');} 
    
    else {console.log('⚠️ Admin user already exists');}
};