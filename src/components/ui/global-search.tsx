import * as React from "react";
import { useState, useMemo, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { SearchIcon, UsersIcon, CreditCardIcon, RefreshCwIcon, FileTextIcon, PlusIcon, LayoutDashboardIcon, BarChart3Icon, SendIcon, BellIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Input } from "./input";

interface SearchResult {
  id: string;
  type: 'member' | 'application' | 'renewal' | 'business' | 'action' | 'navigation';
  title: string;
  subtitle: string;
  description?: string;
  path?: string;
  action?: () => void;
  data?: any;
}

interface QuickAction {
  id: string;
  type: 'action' | 'navigation';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
  shortcut?: string;
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

export interface GlobalSearchRef {
  focus: () => void;
}

export const GlobalSearch = forwardRef<GlobalSearchRef, GlobalSearchProps>(({ 
  data = {}, 
  onNavigate,
  className 
}, ref) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  // Expose focus method to parent
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setIsOpen(true);
    }
  }), []);

  // Quick actions and navigation items
  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'add-member',
      type: 'action',
      title: 'Add Member',
      subtitle: 'Create a new pharmacy member',
      icon: <PlusIcon className="w-4 h-4" />,
      path: '/members',
      shortcut: '⌘N'
    },
    {
      id: 'send-invoice',
      type: 'action', 
      title: 'Send Invoice',
      subtitle: 'Send an invoice to selected members',
      icon: <SendIcon className="w-4 h-4" />,
      action: () => console.log('Send invoice'),
      shortcut: '⌘I'
    },
    {
      id: 'dashboard',
      type: 'navigation',
      title: 'Dashboard',
      subtitle: 'View membership overview and metrics',
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      path: '/dashboard'
    },
    {
      id: 'members',
      type: 'navigation', 
      title: 'Members',
      subtitle: 'Manage pharmacy members and applications',
      icon: <UsersIcon className="w-4 h-4" />,
      path: '/members'
    },
    {
      id: 'renewals',
      type: 'navigation',
      title: 'Renewals',
      subtitle: 'Track and manage membership renewals',
      icon: <RefreshCwIcon className="w-4 h-4" />,
      path: '/renewals'
    },
    {
      id: 'marketing',
      type: 'navigation',
      title: 'Marketing',
      subtitle: 'Marketing campaigns and analytics',
      icon: <BarChart3Icon className="w-4 h-4" />,
      path: '/marketing'
    }
  ], []);

  // Get recent members for suggestions
  const recentMembers = useMemo(() => {
    if (!data.members) return [];
    return data.members.slice(0, 3).map(member => ({
      id: `recent-${member.membershipId}`,
      type: 'member' as const,
      title: member.businessName || member.contactName,
      subtitle: member.contactName,
      path: '/members',
      data: member
    }));
  }, [data.members]);

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
            path: '/renewals',
            data: renewal
          });
        }
      });
    }

    return results.slice(0, 10); // Limit results
  }, [query, data]);

  // Default suggestions when no query
  const defaultSuggestions = useMemo(() => {
    const suggestions: SearchCategory[] = [];

    // Quick Actions
    suggestions.push({
      name: 'Quick Actions',
      icon: <PlusIcon className="w-4 h-4" />,
      results: quickActions.filter(action => action.type === 'action').map(action => ({
        id: action.id,
        type: action.type,
        title: action.title,
        subtitle: action.subtitle,
        path: action.path,
        action: action.action,
        data: action
      }))
    });

    // Navigation
    suggestions.push({
      name: 'Go to',
      icon: <LayoutDashboardIcon className="w-4 h-4" />,
      results: quickActions.filter(action => action.type === 'navigation').map(action => ({
        id: action.id,
        type: action.type,
        title: action.title,
        subtitle: action.subtitle,
        path: action.path,
        data: action
      }))
    });

    // Recent Members (if available)
    if (recentMembers.length > 0) {
      suggestions.push({
        name: 'Recent Members',
        icon: <UsersIcon className="w-4 h-4" />,
        results: recentMembers
      });
    }

    return suggestions;
  }, [quickActions, recentMembers]);

  // Group results by category
  const categories: SearchCategory[] = useMemo(() => {
    // If no query, show default suggestions
    if (!query.trim()) {
      return defaultSuggestions;
    }

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
  }, [searchResults, defaultSuggestions, query]);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    return categories.flatMap(category => category.results);
  }, [categories]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [flatResults]);

  // Scroll selected item into view
  const scrollSelectedIntoView = (index: number) => {
    if (!scrollableRef.current || index < 0) return;
    
    const selectedElement = scrollableRef.current.querySelector(`[data-index="${index}"]`) as HTMLElement;
    if (selectedElement) {
      selectedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = selectedIndex < flatResults.length - 1 ? selectedIndex + 1 : selectedIndex;
        setSelectedIndex(nextIndex);
        scrollSelectedIntoView(nextIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = selectedIndex > 0 ? selectedIndex - 1 : -1;
        setSelectedIndex(prevIndex);
        if (prevIndex >= 0) {
          scrollSelectedIntoView(prevIndex);
        }
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
    if (result.action) {
      result.action();
    } else if (result.path && onNavigate) {
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
          onFocus={() => setIsOpen(true)}
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
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-md shadow-xl z-50 max-h-[600px] overflow-hidden flex flex-col">

          {/* Scrollable Content */}
          <div ref={scrollableRef} className="flex-1 overflow-y-auto">
            {categories.length > 0 ? (
              <div className="py-2">
                {categories.map((category, categoryIndex) => (
                  <div key={category.name} className={categoryIndex > 0 ? "mt-4" : ""}>
                    {/* Category Header */}
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {category.name}
                    </div>
                    
                    {/* Category Results */}
                    {category.results.map((result, resultIndex) => {
                      const flatIndex = flatResults.indexOf(result);
                      const isSelected = selectedIndex === flatIndex;
                      
                      return (
                        <div
                          key={result.id}
                          data-index={flatIndex}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors mx-2 rounded-md",
                            isSelected 
                              ? "bg-gray-100" 
                              : "hover:bg-gray-100"
                          )}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(flatIndex)}
                        >
                          {/* Icon for actions and navigation */}
                          {result.data && (result.type === 'action' || result.type === 'navigation') && (
                            <div className="flex-shrink-0 text-gray-500">
                              {(result.data as QuickAction).icon}
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            {result.type === 'member' ? (
                              <div className="flex items-center gap-2 truncate">
                                <span className="font-medium text-sm text-gray-900 truncate">
                                  {result.title}
                                </span>
                                <span className="text-gray-300 text-xs">•</span>
                                <span className="text-sm text-gray-500 truncate">
                                  {result.subtitle}
                                </span>
                                <span className="text-gray-300 text-xs">•</span>
                                <span className="text-sm text-gray-500 truncate">
                                  {(() => {
                                    const tier = result.data?.membershipTier;
                                    if (!tier) return '';
                                    switch (tier) {
                                      case 'pharmacy': return 'Pharmacy';
                                      case 'staff_pharmacist': return 'Staff Pharmacist';
                                      case 'sustaining': return 'Sustaining';
                                      case 'retired': return 'Retired';
                                      case 'student': return 'Student';
                                      case 'ltc_division': return 'LTC Division';
                                      case 'corporate': return 'Corporate';
                                      default: return tier.charAt(0).toUpperCase() + tier.slice(1);
                                    }
                                  })()}
                                </span>
                              </div>
                            ) : (
                              <div className="font-medium text-sm text-gray-900 truncate">
                                {result.title}
                              </div>
                            )}
                          </div>

                          {/* Keyboard shortcut */}
                          {result.data && (result.data as QuickAction).shortcut && (
                            <div className="flex-shrink-0">
                              <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded font-mono">
                                {(result.data as QuickAction).shortcut}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No results found for "{query}"
              </div>
            ) : null}
          </div>

          {/* Keyboard Navigation Hints */}
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-50 border border-gray-200 rounded text-[10px] font-mono">↑</span>
                <span className="inline-flex items-center justify-center w-5 h-5 bg-gray-50 border border-gray-200 rounded text-[10px] font-mono">↓</span>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-6 h-5 bg-gray-50 border border-gray-200 rounded text-[10px] font-mono">↵</span>
                <span>Select</span>
              </div>
            </div>
            <div className="text-gray-400">
              Not what you're looking for? Try the{" "}
              <span className="text-blue-500 hover:text-blue-600 cursor-pointer">Help Center</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

GlobalSearch.displayName = "GlobalSearch";