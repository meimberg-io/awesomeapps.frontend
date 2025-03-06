
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
    description: string | null;
    longdesc: RootNode[];
    longdescription: Block[];
    thumbnail: Image;
    logo: Image;
    tags: Tag[];
}