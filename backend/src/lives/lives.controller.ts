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
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LivesService } from './lives.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/lives')
@UseGuards(JwtAuthGuard)
export class LivesController {
  constructor(private readonly livesService: LivesService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.livesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.livesService.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateLiveDto, @Request() req: any) {
    return this.livesService.create(dto, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateLiveDto,
    @Request() req: any,
  ) {
    return this.livesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.livesService.remove(id, req.user.id);
  }

  @Post(':id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 100, {
      storage: memoryStorage(),
      limits: { fileSize: 100 * 1024 * 1024 },
    }),
  )
  uploadPhotos(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req: any,
  ) {
    return this.livesService.addPhotos(id, files, req.user.id);
  }
}
