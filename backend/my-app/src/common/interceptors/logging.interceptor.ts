import { Injectable,NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { tap,Observable } from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log("running before the handler.......")
        return next.handle().pipe(
            tap((data)=>{console.log("this is after the handler"  , data)})
        )
    }
}