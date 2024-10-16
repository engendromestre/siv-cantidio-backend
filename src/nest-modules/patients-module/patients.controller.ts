import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Inject,
  ParseUUIDPipe,
  UploadedFiles,
  ValidationPipe,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { CreatePatientUseCase } from '../../core/patient/application/use-cases/create-patient/create-patient.use-case';
import { UpdatePatientUseCase } from '@core/patient/application/use-cases/update-patient/update-patient.use-case';
import { GetPatientUseCase } from '../../core/patient/application/use-cases/get-patient/get-patient.use-case';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UpdatePatientInput } from '@core/patient/application/use-cases/update-patient/update-patient.input';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
<<<<<<< HEAD

=======
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('patients')
@ApiBearerAuth()
>>>>>>> fix-patient-sequelize
@Controller('patients')
export class PatientsController {
  @Inject(CreatePatientUseCase)
  private createUseCase: CreatePatientUseCase;

  @Inject(UpdatePatientUseCase)
  private updateUseCase: UpdatePatientUseCase;

  @Inject(GetPatientUseCase)
  private getUseCase: GetPatientUseCase;

  @Post()
  async create(@Body() createPatientDto: CreatePatientDto) {
    const { id } = await this.createUseCase.execute(createPatientDto);
    //PatientPresenter
    return await this.getUseCase.execute({ id });
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    //PatientPresenter
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updatePatientDto: any,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
    },
  ) {
    const hasFiles = files ? Object.keys(files).length : false;
    const hasData = Object.keys(updatePatientDto).length > 0;

    if (hasFiles && hasData) {
      throw new BadRequestException('Files and data cannot be sent together');
    }

    if (hasData) {
      const data = await new ValidationPipe({
        errorHttpStatusCode: 422,
      }).transform(updatePatientDto, {
        metatype: UpdatePatientDto,
        type: 'body',
      });
      const input = new UpdatePatientInput({ id, ...data });
      await this.updateUseCase.execute(input);
    }

    //use case upload image media
    return await this.getUseCase.execute({ id });
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'thumbnail_half', maxCount: 1 },
    ]),
  )
  @Patch(':id/upload')
  async uploadFile(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @UploadedFiles()
    files: {
      photo?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      thumbnail_half?: Express.Multer.File[];
    },
  ) {
    const hasMoreThanOneFile = Object.keys(files).length > 1;

    if (hasMoreThanOneFile) {
      throw new BadRequestException('Only one file can be sent');
    }

    //use case upload image media

    return await this.getUseCase.execute({ id });
  }
}
