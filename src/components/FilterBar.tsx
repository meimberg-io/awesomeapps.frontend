import React from "react";

interface FilterBarProps {
    tags: string[];
    selectedTag: string | null;
    onTagSelect: (tag: string | null) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ tags, selectedTag, onTagSelect }) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                className={`btn btn-sm ${!selectedTag ? "btn-primary" : "btn-outline"}`}
                onClick={() => onTagSelect(null)}
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    className={`btn btn-sm ${selectedTag === tag ? "btn-primary" : "btn-outline"}`}
                    onClick={() => onTagSelect(tag)}
                >
                    {tag}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;