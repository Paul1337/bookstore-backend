import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';
import bcrypt from 'bcrypt';

export default setSeederFactory(User, faker => {
    const user = new User();

    const sexFlag = faker.number.int(1);
    const gender: 'male' | 'female' = sexFlag ? 'male' : 'female';

    user.firstName = faker.person.firstName(gender);
    user.lastName = faker.person.lastName(gender);
    user.email = faker.internet.email();
    user.username = faker.internet.userName({
        firstName: user.firstName,
        lastName: user.lastName,
    });
    user.isBanned = false;
    user.password = bcrypt.hashSync(faker.internet.password(), 1);

    return user;
});
