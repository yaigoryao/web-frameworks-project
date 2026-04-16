import { User } from '@monorepo/shared';
import { Request } from 'express';

declare module 'express' {
    export interface Request {
        login: string | null;
        role: string | null;
    }
}