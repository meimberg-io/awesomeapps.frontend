import {fetchServices, fetchTagDetailByName, fetchTags} from '@/lib/strapi'
import InteractiveServiceList from '@/components/new/InteractiveServiceList'
import {Metadata} from "next";
import {notFound} from "next/navigation";
import {Tag} from "@/types/tag";

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const tagname = (await params).slug;
    const tag: Tag | undefined = await fetchTagDetailByName(tagname)

    if (!tag) {
        return {
            title: 'Tag ' + tagname + ' nicht gefunden',
            description: 'Das Tag ' + tagname + 'konnte nicht gefunden werden.',
        }
    }

    return {
        title: tag.name,
        description: tag.description ?? undefined,
        openGraph: {
            title: tag.name,
            description: tag.description ?? undefined,
            url: `https://serviceatlas.meimberg.io/t/${tagname}`
        },
    }
}


// Hauptseite für Service-Detail
export default async function Page({params}: {
    params: Promise<{ slug: string }>
}) {
    const tagname = (await params).slug;
    const tag: Tag | undefined = await fetchTagDetailByName(tagname)

    if (!tag) {
        notFound() // 404 Seite
    }

    const initialServices = await fetchServices([tag])
    const initialTags = await fetchTags([tag])

    return (
        <InteractiveServiceList
            initialServices={initialServices}
            initialTags={initialTags}
            maintag={tag}
        />
    )
}

