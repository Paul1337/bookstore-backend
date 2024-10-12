import { UserProfile } from 'src/users/entities/user-profile.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(UserProfile, faker => {
  const userProfile = new UserProfile();
  const genderFlag = faker.number.int(1);
  const gender: 'male' | 'female' = genderFlag ? 'male' : 'female';

  userProfile.firstName = faker.person.firstName(gender);
  userProfile.lastName = faker.person.lastName(gender);
  userProfile.birthDate = faker.date.anytime();
  userProfile.balance = faker.number.int({
    min: 200,
    max: 2000,
  });
  return userProfile;
});
