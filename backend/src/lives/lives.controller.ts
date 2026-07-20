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
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LivesService } from './lives.service';
import { CreateLiveDto } from './dto/create-live.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api/lives')
export class LivesController {
  constructor(private readonly livesService: LivesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    return this.livesService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.livesService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateLiveDto, @Request() req: any) {
    return this.livesService.create(dto, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateLiveDto,
    @Request() req: any,
  ) {
    return this.livesService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ) {
    return this.livesService.remove(id, req.user.id);
  }

  @Post(':id/photos')
  @UseGuards(JwtAuthGuard)
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

  @Get('photos/{*key}')
  async getPhoto(@Param('key') key: string | string[], @Res() res: Response) {
    const resolvedKey = Array.isArray(key) ? key.join('/') : key;
    const { body, contentType } = await this.livesService.getPhoto(resolvedKey);
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    (body as any).pipe(res);
  }
}
