import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase/supabase.service';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    this.logger.log(`Uploading file: ${file.originalname}, size: ${file.size}`);

    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `submissions/${fileName}`;

    // Upload via Backend using Admin Key (configured in SupabaseService)
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .storage.from('thesis-documents')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }

    // Get Public URL
    const { data: publicUrlData } = this.supabaseService
      .getClient()
      .storage.from('thesis-documents')
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      fileName: file.originalname,
    };
  }
}
