import { Module } from '@nestjs/common';
import { AuthModule } from './nest-modules/auth-module/auth.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { EventModule } from './nest-modules/event-module/event.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';
import { UseCaseModule } from './nest-modules/use-case-module/use-case.module';
import { SymbolsModule } from './nest-modules/symbols-module/symbols.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SharedModule,
    DatabaseModule,
    EventModule,
    UseCaseModule,
    AuthModule,
    SymbolsModule,
  ],
})
export class AppModule {}
