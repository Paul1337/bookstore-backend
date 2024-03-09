import { UserProfile } from 'src/users/entities/user-profile.entity';
import { UserRole } from 'src/users/entities/user-role.entity';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class UserSeeder implements Seeder {
    private readonly UsersCount = 1;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        console.log('Running user seeder :)');

        const userFactory = factoryManager.get(User);
        const profileFactory = factoryManager.get(UserProfile);

        const basicUserRole = await dataSource
            .getRepository(UserRole)
            .findOne({ where: { name: 'user' } });

        for (let i = 0; i < this.UsersCount; i++) {
            const user = await userFactory.make();
            user.profile = await profileFactory.make();
            user.roles = [basicUserRole];
            await userFactory.save(user);
        }
    }
}
