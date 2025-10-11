import {Image} from "./image";

export interface Member {
    documentId: string;
    email: string;
    username: string | null;
    displayName: string | null;
    avatarUrl: string | null;
    oauthProvider: 'google' | 'github' | 'azure-ad' | 'local';
    oauthId: string | null;
    lastlogin: string | null;
    bio: string | null;
    avatar: Image | null;
    isActive: boolean;
    createdAt: string;
}

