import { SymbolOutput } from '@core/symbol/application/use-cases/common/symbol-output';
import { CreateSymbolUseCase } from '@core/symbol/application/use-cases/create-symbol/create-symbol.use-case';
import { DeleteSymbolUseCase } from '@core/symbol/application/use-cases/delete-symbol/delete-symbol.use-case';
import { GetSymbolUseCase } from '@core/symbol/application/use-cases/get-symbol/get-symbol.use-case';
import { ListSymbolsUseCase } from '@core/symbol/application/use-cases/list-symbols/list-symbols.use-case';
import { UpdateSymbolInput } from '@core/symbol/application/use-cases/update-symbol/update-symbol.input';
import { UpdateSymbolUseCase } from '@core/symbol/application/use-cases/update-symbol/update-symbol.use-case';
import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { SearchSymbolsDto } from './dto/search-symbols.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { SymbolCollectionPresenter, SymbolPresenter } from './symbols.presenter';
import { AuthGuard } from '../auth-module/auth.guard';
import { CheckIsAdminGuard } from '../auth-module/check-is-admin.guard';

@UseGuards(AuthGuard, CheckIsAdminGuard)
@Controller('symbols')
export class SymbolsController {
    @Inject(CreateSymbolUseCase)
    private createUseCase: CreateSymbolUseCase;

    @Inject(UpdateSymbolUseCase)
    private updateUseCase: UpdateSymbolUseCase;

    @Inject(DeleteSymbolUseCase)
    private deleteUseCase: DeleteSymbolUseCase;

    @Inject(GetSymbolUseCase)
    private getUseCase: GetSymbolUseCase;

    @Inject(ListSymbolsUseCase)
    private listUseCase: ListSymbolsUseCase;

    @Post()
    async create(@Body() createSymbolRepo: CreateSymbolDto) {
        const output = await this.createUseCase.execute(createSymbolRepo);
        return SymbolsController.serialize(output);
    }

    @Get()
    async search(@Query() searchParams: SearchSymbolsDto) {
        const output = await this.listUseCase.execute(searchParams);
        return new SymbolCollectionPresenter(output);
    }

    @Get(':id')
    async findOne(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    ) {
        const output = await this.getUseCase.execute({ id });
        return SymbolsController.serialize(output);
    }

    @Patch(':id')
    async update(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
        @Body() updateSymbolDto: UpdateSymbolDto,
    ) {
        const input = new UpdateSymbolInput({ id, ...updateSymbolDto });
        const output = await this.updateUseCase.execute(input);
        return SymbolsController.serialize(output);
    }

    @HttpCode(204)
    @Delete(':id')
    remove(
        @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    ) {
        return this.deleteUseCase.execute({ id });
    }

    static serialize(output: SymbolOutput) {
        return new SymbolPresenter(output);
    }
}