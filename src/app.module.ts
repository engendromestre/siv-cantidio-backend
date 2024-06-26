import { Module } from '@nestjs/common';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';
import { PatientsModule } from './nest-modules/patients-module/patients.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
import { AuthModule } from './nest-modules/auth-module/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    DatabaseModule,
    EventModule,
    UseCaseModule,
    AuthModule,
    CategoriesModule,
    GenresModule,
    PatientsModule,
  ],
})
export class AppModule {}
