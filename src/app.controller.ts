import {
  Controller,
  Get,
  OnModuleInit,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { HeliaLibp2p, createHelia } from 'helia';
import { UnixFS, unixfs } from '@helia/unixfs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller()
export class AppController implements OnModuleInit {
  private helia: HeliaLibp2p;
  private fs: UnixFS;
  constructor(private readonly appService: AppService) {}
  async onModuleInit() {
    this.helia = await createHelia();
    this.fs = unixfs(this.helia);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    const res = await this.fs.addBytes(image.buffer);
    return { url: `${res}.ipfs.localhost:8080` };
  }
}
