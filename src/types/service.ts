
// @ts-ignore
import {RootNode} from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import {Block} from "./block";
import {Image} from "./image";
import {Tag} from "./tag";

export interface Service {
    documentId: string;
    name: string;
    slug: string;
    url: string;
    shortdescription: string | null;
    longdescription: RootNode[];
    articlecontent: Block[];
    thumbnail: Image;
    logo: Image;
    tags: Tag[];
}