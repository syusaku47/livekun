import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { LivesService } from './lives.service';
import { CreateLiveDto } from './dto/create-live.dto';

const useS3 = !!process.env.S3_BUCKET;

const storageConfig = useS3
  ? { storage: memoryStorage() }
  : {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    };

@Controller('api/lives')
@UseGuards(JwtAuthGuard)
export class LivesController {
  constructor(private readonly livesService: LivesService) {}

  @Get()
  findAll() {
    return this.livesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.livesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLiveDto) {
    return this.livesService.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateLiveDto,
  ) {
    return this.livesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.livesService.remove(id);
  }

  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 100, {
      ...storageConfig,
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  uploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.livesService.addPhotos(id, files);
  }
}
