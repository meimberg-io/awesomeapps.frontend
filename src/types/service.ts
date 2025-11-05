
// @ts-ignore
import {RootNode} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import {Block} from "./block";
import {Image} from "./image";
import {Tag} from "./tag";
import {Review} from "./review";

export interface Service {
    documentId: string;
    name: string;
    slug: string;
    url: string;
    abstract: string | null;
    pricing: string | null;
    shortfacts:  string | null;
    description:  string | null;
    functionality:  string | null;
    thumbnail: Image;
    screenshots: Image[];
    logo: Image;
    youtube_video: string;
    youtube_title: string;
    tags: Tag[];
    reviews?: Review[];
    reviewCount?: number;
    averageRating?: number;
    createdAt: string;
    updatedAt: string;
    publishdate: string;
    top: boolean;
}