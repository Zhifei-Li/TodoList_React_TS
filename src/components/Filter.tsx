import React from "react";

interface FilterProps {
  filter: string;
  onChange: (filter: string) => void;
}

const Filter: React.FC<FilterProps> = ({ filter, onChange }) => {
  return (
    <select
      value={filter}
      onChange={(e) => onChange(e.target.value)}
      className="bg-custom-gray rounded-md mt-4 w-1/6 h-10 p-2`"
    >
      <option value="Sort By" disabled>
        Sort By
      </option>
      <option value="all">All</option>
      <option value="completed">Completed</option>
      <option value="incompleted">Incompleted</option>
    </select>
  );
};

export default Filter;
