import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data-science", label: "Data Science" },
  { id: "frontend-development", label: "Frontend Development" },
  { id: "fullstack-development", label: "Fullstack Development" },
  { id: "mern-stack-development", label: "MERN Stack Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const priceRanges = [
  { id: "free", label: "Free" },
  { id: "0-25", label: "$0 - $25" },
  { id: "25-50", label: "$25 - $50" },
  { id: "50-100", label: "$50 - $100" },
  { id: "100+", label: "$100+" },
];

const Filter = ({ handleFilterChange }) => {
  const { theme, setTheme } = useTheme();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [showPriceRanges, setShowPriceRanges] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Filter categories based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(category => 
        category.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery]);

  // Apply all filters
  const applyFilters = () => {
    handleFilterChange({
      categories: selectedCategories,
      priceRanges: selectedPriceRanges,
      sortBy: sortByPrice,
      search: searchQuery
    });
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId];
      return newCategories;
    });
  };

  const handlePriceRangeChange = (rangeId) => {
    setSelectedPriceRanges((prevRanges) => {
      const newRanges = prevRanges.includes(rangeId)
        ? prevRanges.filter((id) => id !== rangeId)
        : [...prevRanges, rangeId];
      return newRanges;
    });
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSortByPrice("");
    setSearchQuery("");
    handleFilterChange({
      categories: [],
      priceRanges: [],
      sortBy: "",
      search: ""
    });
  };

  const removeCategoryFilter = (categoryId) => {
    setSelectedCategories(prevCategories => 
      prevCategories.filter(id => id !== categoryId)
    );
  };

  const removePriceRangeFilter = (rangeId) => {
    setSelectedPriceRanges(prevRanges => 
      prevRanges.filter(id => id !== rangeId)
    );
  };

  return (
    <div className="w-full md:w-72 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
      {/* Header with Theme Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Filters</h1>
        <button 
          onClick={toggleTheme} 
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>
      
      {/* Mobile Toggle */}
      <div className="md:hidden mb-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </div>
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`${!showFilters && 'hidden md:block'}`}>
        {/* Sort By */}
        <div className="mb-4">
          <Select value={sortByPrice} onValueChange={setSortByPrice}>
            <SelectTrigger className="w-full h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              <SelectGroup>
                <SelectLabel>Sort by Price</SelectLabel>
                <SelectItem value="low">Low to High</SelectItem>
                <SelectItem value="high">High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Search Box */}
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 py-2 h-9 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>

        {/* Selected Filters */}
        {(selectedCategories.length > 0 || selectedPriceRanges.length > 0) && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-6 text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-0"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(catId => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <Badge key={catId} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {category.label}
                    <button onClick={() => removeCategoryFilter(catId)} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
              {selectedPriceRanges.map(rangeId => {
                const range = priceRanges.find(r => r.id === rangeId);
                return range ? (
                  <Badge key={rangeId} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    {range.label}
                    <button onClick={() => removePriceRangeFilter(rangeId)} className="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

        {/* Categories Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full font-semibold mb-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setShowCategories(!showCategories)}
          >
            <span>Categories</span>
            {showCategories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showCategories && (
            <div className="max-h-60 overflow-y-auto pr-1 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {filteredCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 py-1.5">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                    className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-2">No categories match your search</p>
              )}
            </div>
          )}
        </div>

        <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

        {/* Price Range Section */}
        <div className="mb-4">
          <button 
            className="flex items-center justify-between w-full font-semibold mb-2 text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setShowPriceRanges(!showPriceRanges)}
          >
            <span>Price Range</span>
            {showPriceRanges ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {showPriceRanges && (
            <div className="space-y-1">
              {priceRanges.map((range) => (
                <div key={range.id} className="flex items-center space-x-2 py-1.5">
                  <Checkbox 
                    id={`price-${range.id}`} 
                    checked={selectedPriceRanges.includes(range.id)}
                    onCheckedChange={() => handlePriceRangeChange(range.id)}
                    className="border-gray-400 dark:border-gray-500 data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400"
                  />
                  <Label 
                    htmlFor={`price-${range.id}`}
                    className="text-sm font-medium leading-none cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Apply Filters Button */}
        <Button 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Filter;