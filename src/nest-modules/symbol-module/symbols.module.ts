import { Module } from '@nestjs/common';
import { SymbolsModuleController } from './symbols.controller';
import { SymbolModel } from '@core/symbol/infra/sequelize/symbol.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SYMBOL_PROVIDERS } from './symbols.providers';

@Module({
    imports: [SequelizeModule.forFeature([SymbolModel])],
    controllers: [SymbolsModuleController],
    providers: [
        ...Object.values(SYMBOL_PROVIDERS.REPOSITORIES),
        ...Object.values(SYMBOL_PROVIDERS.USE_CASES),
        ...Object.values(SYMBOL_PROVIDERS.VALIDATIONS),
    ],
    exports: [
        SYMBOL_PROVIDERS.REPOSITORIES.SYMBOL_REPOSITORY.provide,
        SYMBOL_PROVIDERS.VALIDATIONS.SYMBOLS_IDS_EXISTS_IN_DATABASE_VALIDATOR
            .provide,
    ],
})
export class SymbolsModule { }
