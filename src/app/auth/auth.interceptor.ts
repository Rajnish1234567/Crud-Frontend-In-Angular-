import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../user-auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private userAuthService:UserAuthService,
        private router: Router){}
    intercept(
        req: HttpRequest<any>, 
        next: HttpHandler
        ): Observable<HttpEvent<any>> {
        
        if(req.headers.get("No-Auth")==='True'){
            return next.handle(req.clone());
        }
        const token=this.userAuthService.getToken();
        req=this.addToken(req, token); 
        console.warn(req);
        return next.handle(req).pipe(
            catchError(
                (err:HttpErrorResponse)=>{
                    console.log(err.status);
                    if(err.status==401){
                        this.router.navigate(['/login']);
                    }
                    return throwError(()=>new Error("Something went wrong"));
                }
            )
        );
    }

    private addToken(req: HttpRequest<any>, token: string |  null){
        return req.clone({ 
            headers: req.headers.append('Authorization', `Bearer ${token}`)});
   
    }
}