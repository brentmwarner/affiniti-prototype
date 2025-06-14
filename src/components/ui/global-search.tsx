import * as React from "react";
import { useState, useMemo, useRef, useEffect } from "react";
import { SearchIcon, UsersIcon, CreditCardIcon, RefreshCwIcon, FileTextIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

interface SearchResult {
  id: string;
  type: 'member' | 'application' | 'renewal' | 'business';
  title: string;
  subtitle: string;
  description?: string;
  path?: string;
  data: any;
}

interface SearchCategory {
  name: string;
  icon: React.ReactNode;
  results: SearchResult[];
}

interface GlobalSearchProps {
  data?: {
    members?: any[];
    applications?: any[];
    renewals?: any[];
  };
  onNavigate?: (path: string) => void;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ 
  data = {}, 
  onNavigate,
  className 
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search functionality
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search members
    if (data.members) {
      data.members.forEach((member: any) => {
        const searchableText = [
          member.businessName,
          member.contactName,
          member.email,
          member.membershipId,
          member.businessPhone,
          member.businessAddress?.street,
          member.businessAddress?.city,
          member.businessAddress?.state,
          member.membershipTier
        ].filter(Boolean).join(' ').toLowerCase();

        if (searchableText.includes(searchTerm)) {
          results.push({
            id: `member-${member.membershipId}`,
            type: 'member',
            title: member.businessName || member.contactName,
            subtitle: member.contactName,
            description: `${member.membershipTier} • ${member.businessAddress?.city}, ${member.businessAddress?.state}`,
            path: '/members',
            data: member
          });
        }
      });
    }

    // Search applications
    if (data.applications) {
      data.applications.forEach((app: any) => {
        const searchableText = [
          app.businessName,
          app.contactName,
          app.email,
          app.applicationId,
          app.businessPhone,
          app.requestedTier,
          app.status
        ].filter(Boolean).join(' ').toLowerCase();

        if (searchableText.includes(searchTerm)) {
          results.push({
            id: `application-${app.applicationId}`,
            type: 'application',
            title: app.businessName || app.contactName,
            subtitle: app.contactName,
            description: `Application • ${app.requestedTier} • ${app.status}`,
            path: '/applications',
            data: app
          });
        }
      });
    }

    // Search renewals (if separate from members)
    if (data.renewals) {
      data.renewals.forEach((renewal: any) => {
        const searchableText = [
          renewal.businessName,
          renewal.contactName,
          renewal.membershipId,
          renewal.renewalStatus
        ].filter(Boolean).join(' ').toLowerCase();

        if (searchableText.includes(searchTerm)) {
          results.push({
            id: `renewal-${renewal.membershipId}`,
            type: 'renewal',
            title: renewal.businessName || renewal.contactName,
            subtitle: renewal.contactName,
            description: `Renewal • ${renewal.renewalStatus} • Due: ${renewal.renewalDate}`,
            path: '/renewals',
            data: renewal
          });
        }
      });
    }

    return results.slice(0, 10); // Limit results
  }, [query, data]);

  // Group results by category
  const categories: SearchCategory[] = useMemo(() => {
    const categoryMap = new Map<string, SearchResult[]>();
    
    searchResults.forEach(result => {
      const categoryKey = result.type;
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, []);
      }
      categoryMap.get(categoryKey)!.push(result);
    });

    const categories: SearchCategory[] = [];
    
    if (categoryMap.has('member')) {
      categories.push({
        name: 'Members',
        icon: <UsersIcon className="w-4 h-4" />,
        results: categoryMap.get('member')!
      });
    }
    
    if (categoryMap.has('application')) {
      categories.push({
        name: 'Applications',
        icon: <FileTextIcon className="w-4 h-4" />,
        results: categoryMap.get('application')!
      });
    }
    
    if (categoryMap.has('renewal')) {
      categories.push({
        name: 'Renewals',
        icon: <RefreshCwIcon className="w-4 h-4" />,
        results: categoryMap.get('renewal')!
      });
    }

    return categories;
  }, [searchResults]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return categories.flatMap(category => category.results);
  }, [categories]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < flatResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && flatResults[selectedIndex]) {
          handleResultClick(flatResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.path && onNavigate) {
      onNavigate(result.path);
    }
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(-1);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Search Input */}
      <div className="flex h-8 items-center px-3 py-2.5 relative w-full bg-white rounded-md overflow-hidden border border-solid">
        <div className="inline-flex items-center pl-0 pr-2 py-0 relative flex-[0_0_auto] mt-[-2.00px] mb-[-2.00px]">
          <SearchIcon className="w-4 h-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className="relative flex-1 h-5 mt-[-5.00px] mb-[-3.00px] bg-transparent border-none outline-none font-text-sm-leading-5-normal font-[number:var(--text-sm-leading-5-normal-font-weight)] text-zinc-950 text-[length:var(--text-sm-leading-5-normal-font-size)] tracking-[var(--text-sm-leading-5-normal-letter-spacing)] leading-[var(--text-sm-leading-5-normal-line-height)] placeholder:text-gray-400 placeholder:opacity-50 [font-style:var(--text-sm-leading-5-normal-font-style)]"
        />
        <div className="flex w-5 items-center justify-center gap-2 px-0.5 py-[3px] relative mt-[-3.00px] mb-[-3.00px] bg-[#e5e7eb8c] rounded">
          <div className="relative w-[18px] mt-[-0.50px] ml-[-1.00px] mr-[-1.00px] [font-family:'Inter',Helvetica] font-medium text-gray-400 text-[10px] tracking-[1.00px] leading-3">
            ⌘K
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-y-auto">
          {categories.length > 0 ? (
            <div className="py-2">
              {categories.map((category, categoryIndex) => (
                <div key={category.name}>
                  {/* Category Header */}
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                    {category.icon}
                    <span>{category.name}</span>
                    <span className="ml-auto text-gray-400">
                      {category.results.length}
                    </span>
                  </div>
                  
                  {/* Category Results */}
                  {category.results.map((result, resultIndex) => {
                    const flatIndex = flatResults.indexOf(result);
                    const isSelected = selectedIndex === flatIndex;
                    
                    return (
                      <div
                        key={result.id}
                        className={cn(
                          "flex items-start gap-3 px-3 py-2 cursor-pointer transition-colors",
                          isSelected 
                            ? "bg-indigo-50 border-l-2 border-indigo-500" 
                            : "hover:bg-gray-50"
                        )}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(flatIndex)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {result.title}
                          </div>
                          {result.subtitle && (
                            <div className="text-sm text-gray-600 truncate">
                              {result.subtitle}
                            </div>
                          )}
                          {result.description && (
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {result.description}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-3 py-4 text-center text-sm text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};