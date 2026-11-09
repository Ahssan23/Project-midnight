import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';

@Catch()
export class MyFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log('EXCEPTION:', exception);
    console.log('HOST:', host);
  }
}