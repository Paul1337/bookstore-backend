import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';
import userProfileSeeder from './user-profile.factory';

export default setSeederFactory(User, async faker => {
  const user = new User();

  user.email = faker.internet.email();
  user.username = faker.internet.userName();
  user.isBanned = false;
  user.password = bcrypt.hashSync(faker.internet.password(), 1);

  return user;
});
