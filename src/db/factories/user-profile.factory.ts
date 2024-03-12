import { UserProfile } from 'src/users/entities/user-profile.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserProfile, faker => {
    const userProfile = new UserProfile();
    userProfile.age = faker.number.int({
        min: 14,
        max: 50,
    });
    userProfile.balance = faker.number.int({
        min: 200,
        max: 2000,
    });
    return userProfile;
});
