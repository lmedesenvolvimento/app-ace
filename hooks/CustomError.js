import Sentry from 'sentry-expo';

import Session from '../services/Session';

export class CustomError extends Error {
    constructor(...args){
        super(...args);
        this.stack = (new Error()).stack;
    }
}

export function captureException(e){
    Session.Credential.get().then((user) => {
        if(user){
            e.message = `${user.email}: ${e.message}`;
            Sentry.captureException(e);
        } else{
            e.message = `Usuário não logado: ${e.message}`;
            Sentry.captureException(e);
        }
    })
}