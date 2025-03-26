'use client'

import {useEffect, useState} from 'react'
import ServiceList from '@/components/servicelist/ServiceList'
import TagsAvailable from '@/components/servicelist/TagsAvailable'
import TagsSelected from '@/components/servicelist/TagsSelected'
import {Service} from '@/types/service'
import {Tag} from '@/types/tag'
import {fetchServices, fetchTags} from '@/lib/services'

interface Props {
    initialServices: Service[]
    initialTags: Tag[]
}

export default function InteractiveServiceList({ initialServices, initialTags }: Props) {
    const [services, setServices] = useState<Service[]>(initialServices)
    const [tags, setTags] = useState<Tag[]>(initialTags)
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])

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
        fetchServices(selectedTags).then(setServices).catch(console.error)
        fetchTags(selectedTags).then(setTags).catch(console.error)
    }, [selectedTags])

    return (
        <>
            <div className="shadow-lg">
                <TagsAvailable tags={tags} selectedTags={selectedTags} toggleTag={toggleTag} />
                {selectedTags.length > 0 && (
                    <TagsSelected selectedTags={selectedTags} toggleTag={toggleTag} />
                )}
            </div>
            <ServiceList services={services} selectedTags={selectedTags} toggleTag={toggleTag} />
        </>
    )
}
