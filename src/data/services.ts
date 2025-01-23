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
        name: "ElevenLabs",
        description: "AI-powered text-to-speech platform for creating lifelike voices.",
        tags: ["AI", "Text-to-Speech", "Voice"],
        image: "https://picsum.photos/300/150?1",
    },
    {
        id: "2",
        name: "SoundCloud",
        description: "Music sharing platform for artists to upload and promote tracks.",
        tags: ["Music", "Streaming", "Artists"],
        image: "https://picsum.photos/300/150?2",
    },
    {
        id: "3",
        name: "Canva",
        description: "Online design tool for creating stunning graphics and presentations.",
        tags: ["Design", "Graphics", "Marketing"],
        image: "https://picsum.photos/300/150?3",
    },
    {
        id: "4",
        name: "Ved.io",
        description: "Video editing and collaboration platform for teams and creators.",
        tags: ["Video Editing", "Collaboration", "Creativity"],
        image: "https://picsum.photos/300/150?4",
    },
    {
        id: "5",
        name: "Notion",
        description: "All-in-one workspace for notes, tasks, and project management.",
        tags: ["Productivity", "Notes", "Task Management"],
        image: "https://picsum.photos/300/150?5",
    },
    {
        id: "6",
        name: "Zapier",
        description: "Automation platform that connects apps to streamline workflows.",
        tags: ["Automation", "Integration", "Productivity"],
        image: "https://picsum.photos/300/150?6",
    },
    {
        id: "7",
        name: "Figma",
        description: "Collaborative interface design tool for teams and developers.",
        tags: ["Design", "Collaboration", "UI/UX"],
        image: "https://picsum.photos/300/150?7",
    },
    {
        id: "8",
        name: "Grammarly",
        description: "AI-powered writing assistant for grammar and tone improvement.",
        tags: ["Writing", "Grammar", "AI"],
        image: "https://picsum.photos/300/150?8",
    },
    {
        id: "9",
        name: "Slack",
        description: "Messaging platform for teams to communicate and collaborate effectively.",
        tags: ["Messaging", "Collaboration", "Teams"],
        image: "https://picsum.photos/300/150?9",
    },
    {
        id: "10",
        name: "Trello",
        description: "Visual project management tool using boards, lists, and cards.",
        tags: ["Project Management", "Collaboration", "Tasks"],
        image: "https://picsum.photos/300/150?10",
    },
    {
        id: "11",
        name: "Airtable",
        description: "Flexible database platform for organizing and managing data visually.",
        tags: ["Database", "Productivity", "Collaboration"],
        image: "https://picsum.photos/300/150?11",
    },
    {
        id: "12",
        name: "Zoom",
        description: "Video conferencing tool for online meetings and webinars.",
        tags: ["Video Conferencing", "Meetings", "Communication"],
        image: "https://picsum.photos/300/150?12",
    },
];
