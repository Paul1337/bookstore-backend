import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(User, faker => {
    const user = new User();

    const sexFlag = faker.number.int(1);
    const gender: 'male' | 'female' = sexFlag ? 'male' : 'female';

    user.firstName = faker.person.firstName(gender);
    user.lastName = faker.person.lastName(gender);
    user.email = faker.internet.email();
    user.isBanned = false;

    return user;
});
