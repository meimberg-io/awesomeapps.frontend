'use client'

import {useEffect, useState} from 'react'
import ServiceList from '@/components/servicelist/ServiceList'
import TagsAvailable from '@/components/servicelist/TagsAvailable'
import TagsSelected from '@/components/servicelist/TagsSelected'
import {Service} from '@/types/service'
import {Tag} from '@/types/tag'
import {fetchServices, fetchTags} from '@/lib/strapi'
import PageHeader from "@/components/PageHeader";
import {PageHeaderStyle} from "@/types/PageHeaderStyle";
import {useLocale} from 'next-intl';
import {Locale} from '@/types/locale';

interface Props {
    initialServices: Service[]
    initialTags: Tag[]
    maintag?: Tag
}

export default function InteractiveServiceList({ initialServices, initialTags, maintag }: Props) {
    const locale = useLocale() as Locale;
    const [services, setServices] = useState<Service[]>(initialServices)
    const [tags, setTags] = useState<Tag[]>(initialTags)

    const [selectedTags, setSelectedTags] = useState<Tag[]>(maintag ? [maintag] : [])

    const toggleTag = (tagID: string) => {
        const tag = tags.find((t) => t.documentId === tagID)
        if (!tag) return
        setSelectedTags((prev) =>
            prev.some((t) => t.documentId === tagID)
                ? prev.filter((t) => t.documentId !== tagID)
                : [...prev, tag]
        )
    }

    useEffect(() => {
        fetchServices(selectedTags, locale).then(setServices).catch(console.error)
        fetchTags(selectedTags, locale).then(setTags).catch(console.error)
    }, [selectedTags, locale])

    return (
        <>
            <div className="shadow-lg">
                {maintag !== undefined && (
                    <PageHeader
                        title={maintag.name}
                        subtitle={maintag.description ?? " "}
                        iconname={maintag.icon}
                        style={PageHeaderStyle.TAG}
                    />
                )}
                <TagsAvailable tags={tags} selectedTags={selectedTags} toggleTag={maintag ? toggleTag : undefined} />
                {selectedTags.length > 1 && (
                    <TagsSelected selectedTags={selectedTags.filter(tag => {
                        return !maintag || tag.name !== maintag.name
                    })} toggleTag={toggleTag} />
                )}
            </div>
            <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag} />
        </>
    )
}
