import {Member} from "./member";
import {App} from "./app";

export interface Review {
    documentId: string;
    reviewtext: string | null;
    voting: number;
    member: Member;
    service?: App;
    isPublished: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

