import {Member} from "./member";
import {Service} from "./service";

export interface Review {
    documentId: string;
    reviewtext: string | null;
    voting: number;
    member: Member;
    service?: Service;
    isPublished: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

