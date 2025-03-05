import {Block} from "./block";
import {Image} from "./image";

export interface Page {
    content: Block[]
    documentId: string
    keyvisual: Image
    slug: string
    subtitle: string
    title: string
}
