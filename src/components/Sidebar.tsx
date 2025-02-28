import React from "react";
import {Tag} from "../types";
import SidebarMobile from "./SidebarMobile.tsx";
import SidebarStatic from "./SidebarStatic.tsx";


export interface SidebarProps {
    navigation: NavItem[];
    tags: Tag[];
    selectedTags: Tag[];
    toggleTag: (tag: Tag) => void;
}

export interface NavItem {
    name: string;
    href: string;
    icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string; titleId?: string } & React.RefAttributes<SVGSVGElement>>;
    current: boolean;
}

export interface TagItem {
    id: number;
    name: string;
    href: string;
    count: string;
    current: boolean;
}

export function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(' ')
}

const Sidebar: React.FC<SidebarProps> = ({navigation, tags, selectedTags, toggleTag}) => {

    return (

        <div>
            <SidebarMobile navigation={navigation} tags={tags} selectedTags={selectedTags} toggleTag={toggleTag}  />
            <SidebarStatic navigation={navigation} tags={tags} selectedTags={selectedTags} toggleTag={toggleTag}  />


        </div>
    );
};
export default Sidebar;