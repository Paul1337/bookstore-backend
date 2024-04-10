import { PartialType } from '@nestjs/swagger';
import { CreateTestModuleDto } from './create-test-module.dto';

export class UpdateTestModuleDto extends PartialType(CreateTestModuleDto) {}
