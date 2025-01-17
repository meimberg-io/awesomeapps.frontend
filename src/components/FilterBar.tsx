import React from "react";

interface FilterBarProps {
    tags: string[];
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ tags, selectedTag, onTagSelect }) => {
    return (
        <div className="flex gap-2 mb-4">
            <button
                className={`btn ${!selectedTag ? "btn-primary" : ""}`}
                onClick={() => onTagSelect(null)}
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`btn ${selectedTag === tag ? "btn-primary" : ""}`}
                    onClick={() => onTagSelect(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;