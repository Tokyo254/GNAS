export const PREDEFINED_CATEGORIES = [
  "Health", "Finance", "E-Mobility", "Law", "Tech",
  "Security", "Politics", "AI", "Geopolitics", "Environment",
  "Arts & Culture", "Sports"
] as const;

export type Category = typeof PREDEFINED_CATEGORIES[number];

// Helper function to validate categories
export const isValidCategory = (category: string): category is Category => {
  return PREDEFINED_CATEGORIES.includes(category as Category);
};

// Helper to get category color (optional, for consistent styling)
export const getCategoryColor = (category: Category): string => {
  const colorMap: Record<Category, string> = {
    "Health": "bg-green-500/20 text-green-400 border-green-500/30",
    "Finance": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "E-Mobility": "bg-teal-500/20 text-teal-400 border-teal-500/30",
    "Law": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "Tech": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "Security": "bg-red-500/20 text-red-400 border-red-500/30",
    "Politics": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "AI": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    "Geopolitics": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Environment": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Arts & Culture": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "Sports": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
  };
  return colorMap[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
};