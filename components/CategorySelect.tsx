"use client";

import React from "react";

interface CategorySelectProps {
  defaultValue: string;
  categories: string[];
}

export function CategorySelect({
  defaultValue,
  categories,
}: CategorySelectProps) {
  return (
    <select
      name="category"
      data-testid="category-select"
      defaultValue={defaultValue}
      onChange={(e) => {
        // Automatically submit the GET form when category changes
        if (e.currentTarget.form) {
          if (typeof e.currentTarget.form.requestSubmit === "function") {
            e.currentTarget.form.requestSubmit();
          } else {
            e.currentTarget.form.submit();
          }
        }
      }}
      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all cursor-pointer"
    >
      <option value="" className="bg-slate-900 text-white">
        All
      </option>
      {categories.map((cat) => (
        <option key={cat} value={cat} className="bg-slate-900 text-white">
          {cat}
        </option>
      ))}
    </select>
  );
}

export default CategorySelect;
