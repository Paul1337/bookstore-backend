import { User } from 'src/users/entities/user.entity';

export const userMock = new User();
userMock.id = 0;
userMock.createdAt = new Date();
userMock.email = 'p@x128.ru';
userMock.firstName = 'test-first-name';
userMock.lastName = 'test-last-name';
userMock.isBanned = false;
userMock.password = 'some-pass-hash';

// userMock.profile = {};
