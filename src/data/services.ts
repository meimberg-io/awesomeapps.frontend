export interface Service {
    id: string;
    name: string;
    description: string;
    tags: string[];
    image: string;
}

export const services: Service[] = [
    {
        id: "1",
        name: "Service 1",
        description: "Description of Service 1",
        tags: ["tag1", "tag2"],
        image: "https://via.placeholder.com/150",
    },
    {
        id: "2",
        name: "Service 2",
        description: "Description of Service 2",
        tags: ["tag2", "tag3"],
        image: "https://via.placeholder.com/150",
    },
];