import { Injectable,NestInterceptor,ExecutionContext,CallHandler } from "@nestjs/common";
import { tap,Observable, catchError, throwError } from "rxjs";


@Injectable()
export class ErrorInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log("running before the handler.......")
        return next.handle().pipe(
            catchError((err)=>{
                console.log('error by interceptor :',err);
                return throwError(()=> err)
            })
        )
    }
}