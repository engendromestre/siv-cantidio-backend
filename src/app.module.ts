import { Module } from '@nestjs/common';
import { AuthModule } from './nest-modules/auth-module/auth.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members.module';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
<<<<<<< HEAD
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';
import { PatientsModule } from './nest-modules/patients-module/patients.module';
=======
>>>>>>> ddf7011 (feature symbol)
import { EventModule } from './nest-modules/event-module/event.module';
import { GenresModule } from './nest-modules/genres-module/genres.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
<<<<<<< HEAD
import { AuthModule } from './nest-modules/auth-module/auth.module';
=======
>>>>>>> ddf7011 (feature symbol)

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
<<<<<<< HEAD
    PatientsModule,
=======
>>>>>>> ddf7011 (feature symbol)
  ],
})
export class AppModule {}
