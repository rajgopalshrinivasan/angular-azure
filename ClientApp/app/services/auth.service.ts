﻿// src/app/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as auth0 from 'auth0-js';

(window as any).global = window;

@Injectable()
export class AuthService {

    auth0 = new auth0.WebAuth({
        clientID: 'jTgDTrWA3mGdKpyL4UBGnp0crPWBanMC',
        domain: 'rajshrinivasan.auth0.com',
        responseType: 'token id_token',
        audience: 'https://rajshrinivasan.auth0.com/userinfo',
        redirectUri: 'http://localhost:55762/callback',
        scope: 'openid'
    });

    constructor(public router: Router) { }

    public login(): void {
        this.auth0.authorize();
    }
    public logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public setSession(authResult: any): void {

        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    public handleAuthentication(): void {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken) {
                this.setSession(authResult);
            }
            else if (err) {
                this.router.navigate(['/home']);
            }
        });
    }


    public isAuthenticated(): boolean {
        let expiresAt = localStorage.getItem('expires_at');

        if (!expiresAt) return false;

        return new Date().getTime() < JSON.parse(expiresAt);
    }


}