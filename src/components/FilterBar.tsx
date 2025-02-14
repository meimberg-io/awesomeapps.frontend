import React from "react";

interface Props {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

const FilterBar: React.FC<Props> = ({ tags, selectedTag, onSelectTag }) => {
    return (
        <div>
            <button onClick={() => onSelectTag(null)}>Alle</button>
            {tags.map(tag => (
                <button
                    key={tag}
                    onClick={() => onSelectTag(tag)}
                    style={{ fontWeight: tag === selectedTag ? "bold" : "normal" }}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
