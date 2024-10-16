import { SymbolInMemoryRepository } from "@core/symbol/infra/in-memory/symbol-in-memory.repository";
import { UpdateSymbolUseCase } from "../update-symbol.use-case"
import { Symbol, SymbolId } from "@core/symbol/domain/symbol.aggregate";
import { UpdateSymbolInput } from "../update-symbol.input";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";
import { SymbolTypes } from "@core/symbol/domain/symbol-type.vo";


describe('UpdateSymbolUseCase Unit Tests', () => {
  let useCase: UpdateSymbolUseCase;
  let repository: SymbolInMemoryRepository;

  beforeEach(() => {
    repository = new SymbolInMemoryRepository();
    useCase = new UpdateSymbolUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const symbolId = new SymbolId();

    await expect(() =>
      useCase.execute(
        new UpdateSymbolInput({
          id: symbolId.id,
          description: 'fake',
          is_active: true,
          type: SymbolTypes.ICON,
        }),
      ),
    ).rejects.toThrow(new NotFoundError(symbolId.id, Symbol));
  });

  it('should update a symbol', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = Symbol.fake().anIcon().build();
    repository.items = [entity];
    let output = await useCase.execute(
      new UpdateSymbolInput({
        id: entity.symbol_id.id,
        description: 'test',
        is_active: true,
        type: SymbolTypes.ICON,
      }),
    );

    expect(spyUpdate).toHaveBeenCalledTimes(1);

    expect(output).toStrictEqual({
      id: entity.symbol_id.id,
      description: 'test',
      type: SymbolTypes.ICON,
      is_active: true,
      created_at: entity.created_at,
    });
    type Arrange = {
      input: {
        id: string;
        description: string;
        is_active: boolean;
        type: SymbolTypes;
      };
      expected: {
        id: string;
        description: string;
        is_active: boolean;
        type: SymbolTypes;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: entity.entity_id.id,
          description: 'test',
          is_active: true,
          type: SymbolTypes.ICON,
        },
        expected: {
          id: entity.entity_id.id,
          description: 'test',
          is_active: true,
          type: SymbolTypes.ICON,
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute(
        new UpdateSymbolInput({
          id: i.input.id,
          description: i.input.description || '',
          is_active: i.input.is_active !== undefined ? i.input.is_active : false,
          type: i.input.type !== undefined ? i.input.type : SymbolTypes.ICON,
        }),
      );
      expect(output).toStrictEqual({
        id: entity.entity_id.id,
        description: i.expected.description,
        is_active: i.expected.is_active,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});