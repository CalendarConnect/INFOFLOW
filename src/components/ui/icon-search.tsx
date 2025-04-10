'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { Input } from './input';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

// Popular icon collections with friendly names
const POPULAR_COLLECTIONS = [
  { id: 'lucide', name: 'Lucide' },
  { id: 'tabler', name: 'Tabler' },
  { id: 'mdi', name: 'Material Design' },
  { id: 'fa6-solid', name: 'Font Awesome' },
  { id: 'carbon', name: 'Carbon' },
  { id: 'material-symbols', name: 'Material Symbols' },
  { id: 'ph', name: 'Phosphor' },
  { id: 'fluent', name: 'Fluent' },
  { id: 'bi', name: 'Bootstrap' },
  { id: 'clarity', name: 'Clarity' },
  { id: 'heroicons', name: 'Heroicons' },
  { id: 'jam', name: 'Jam' },
  { id: 'octicon', name: 'Octicons' },
  { id: 'bx', name: 'Box Icons' },
  { id: 'simple-icons', name: 'Simple Icons' },
  { id: 'logos', name: 'Logos' },
];

// Common categories of icons
const ICON_CATEGORIES = {
  'User Interface': ['home', 'search', 'settings', 'menu', 'arrow', 'check', 'close', 'plus', 'minus', 'edit', 'trash', 'bookmark', 'star', 'heart', 'bell', 'calendar', 'clock', 'user', 'lock', 'shield', 'eye', 'image', 'camera', 'microphone', 'speaker', 'volume', 'play', 'pause', 'stop', 'skip', 'rewind', 'shuffle', 'repeat'],
  'Communication': ['mail', 'chat', 'message', 'phone', 'video', 'share', 'send', 'reply', 'forward', 'notification', 'alert', 'info', 'warning', 'error', 'success', 'help', 'support', 'conversation', 'comment', 'feedback', 'discussion', 'bubble', 'contact', 'email', 'letter', 'envelope'],
  'Social': ['twitter', 'facebook', 'linkedin', 'instagram', 'github', 'youtube', 'google', 'apple', 'microsoft', 'amazon', 'pinterest', 'snapchat', 'whatsapp', 'telegram', 'discord', 'slack', 'tiktok', 'twitch', 'reddit', 'medium', 'behance', 'dribbble', 'figma'],
  'Devices': ['laptop', 'mobile', 'tablet', 'desktop', 'server', 'printer', 'keyboard', 'mouse', 'monitor', 'tv', 'phone', 'smart-watch', 'headphones', 'camera', 'gamepad', 'router', 'cpu', 'memory', 'battery', 'bluetooth', 'wifi', 'usb', 'chip'],
  'Files': ['file', 'folder', 'document', 'image', 'video', 'music', 'pdf', 'zip', 'csv', 'excel', 'word', 'powerpoint', 'code', 'json', 'xml', 'html', 'css', 'js', 'download', 'upload', 'archive', 'attachment', 'clipboard'],
  'Weather': ['sun', 'moon', 'cloud', 'rain', 'snow', 'wind', 'storm', 'thunder', 'lightning', 'rainbow', 'temperature', 'thermometer', 'humidity', 'fog', 'hurricane', 'umbrella', 'snowflake', 'sunshine', 'cloud-sun', 'cloud-moon', 'meteor', 'tornado'],
  'Automation': ['robot', 'api', 'code', 'database', 'server', 'cloud', 'function', 'webhook', 'workflow', 'process', 'integration', 'connection', 'flow', 'pipeline', 'trigger', 'action', 'automation', 'bot', 'scheduler', 'cron', 'task', 'sync', 'update'],
  'Business': ['chart', 'graph', 'analytics', 'dashboard', 'presentation', 'calculator', 'briefcase', 'money', 'credit-card', 'wallet', 'bank', 'building', 'store', 'shop', 'cart', 'bag', 'tag', 'receipt', 'invoice', 'contract', 'signature', 'certificate', 'award', 'trophy'],
  'Logos': ['android', 'apple', 'windows', 'linux', 'aws', 'azure', 'google-cloud', 'docker', 'kubernetes', 'github', 'gitlab', 'bitbucket', 'npm', 'node', 'react', 'vue', 'angular', 'svelte', 'next', 'nuxt', 'tailwind', 'bootstrap', 'sass', 'typescript', 'javascript', 'python', 'java', 'go', 'rust', 'c', 'php', 'mysql', 'postgresql', 'mongodb', 'redis', 'graphql', 'firebase', 'stripe', 'paypal', 'visa', 'mastercard', 'amex'],
};

// Most popular icons to show initially
const POPULAR_ICONS = [
  'lucide:home',
  'lucide:settings',
  'lucide:user',
  'lucide:mail',
  'lucide:search',
  'lucide:bell',
  'lucide:check',
  'lucide:x',
  'lucide:plus',
  'lucide:minus',
  'lucide:chevron-down',
  'lucide:chevron-right',
  'lucide:menu',
  'lucide:edit',
  'lucide:trash',
  'mdi:account',
  'mdi:cog',
  'mdi:home',
  'tabler:home',
  'tabler:user',
  'fa6-solid:home',
  'fa6-solid:user',
  'material-symbols:home',
  'material-symbols:settings',
  'logos:github',
  'logos:twitter',
  'simple-icons:react',
  'simple-icons:next-dot-js',
];

export interface IconPickerProps {
  onSelect: (icon: string) => void;
  value?: string;
  className?: string;
}

export function IconPicker({ onSelect, value, className }: IconPickerProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [recentIcons, setRecentIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load recent icons from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentIcons');
    if (saved) {
      try {
        setRecentIcons(JSON.parse(saved).slice(0, 12));
      } catch (e) {
        console.error('Failed to parse recent icons', e);
      }
    }
  }, []);

  // Save icon to recent icons
  const addToRecentIcons = (icon: string) => {
    const updated = [icon, ...recentIcons.filter(i => i !== icon)].slice(0, 12);
    setRecentIcons(updated);
    localStorage.setItem('recentIcons', JSON.stringify(updated));
  };

  // Handle icon search with debounce
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    searchDebounceRef.current = setTimeout(() => {
      // This is a simplified search. In a real implementation,
      // you'd probably want to use the Iconify API or a comprehensive local index
      const searchTerms = query.toLowerCase().split(' ');
      
      let results: string[] = [];
      
      // Search in the current collection or all collections if none selected
      POPULAR_COLLECTIONS.forEach(collection => {
        if (selectedCollection && collection.id !== selectedCollection) return;
        
        // For each category
        Object.entries(ICON_CATEGORIES).forEach(([category, keywords]) => {
          if (selectedCategory && category !== selectedCategory) return;
          
          // Filter icons that match all search terms
          const matchingIcons = keywords.filter(icon => 
            searchTerms.every(term => icon.toLowerCase().includes(term))
          );
          
          // Add collection prefix to icons
          results = [...results, ...matchingIcons.map(icon => `${collection.id}:${icon}`)];
        });
      });
      
      setSearchResults(results.slice(0, 48)); // Limit to reasonable number
      setIsLoading(false);
    }, 300);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [query, selectedCategory, selectedCollection]);

  // Handle icon selection
  const handleSelectIcon = (iconName: string) => {
    onSelect(iconName);
    addToRecentIcons(iconName);
  };

  // Get display icons based on current state
  const getDisplayIcons = () => {
    if (query.length > 0) {
      return searchResults;
    }
    
    if (selectedCategory) {
      return ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES].map(icon => 
        `${selectedCollection || 'lucide'}:${icon}`
      );
    }
    
    if (recentIcons.length > 0) {
      return recentIcons;
    }
    
    return POPULAR_ICONS;
  };

  const displayIcons = getDisplayIcons();

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search icons..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-1">
          <Button 
            variant={!selectedCollection ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCollection('')}
            className="text-xs h-7"
          >
            All
          </Button>
          {POPULAR_COLLECTIONS.slice(0, 6).map(collection => (
            <Button
              key={collection.id}
              variant={selectedCollection === collection.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCollection(collection.id)}
              className="text-xs h-7"
            >
              {collection.name}
            </Button>
          ))}
        </div>
        
        {query.length === 0 && (
          <div className="flex flex-wrap gap-1">
            {Object.keys(ICON_CATEGORIES).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className="text-xs h-7"
              >
                {category}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <div className="border rounded-md h-[200px] overflow-hidden">
        <ScrollArea className="h-full p-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {displayIcons.length > 0 ? (
                <div className="grid grid-cols-6 gap-3">
                  {displayIcons.map((iconName) => (
                    <IconButton
                      key={iconName}
                      iconName={iconName}
                      onClick={() => handleSelectIcon(iconName)}
                      isSelected={value === iconName}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="text-muted-foreground mb-2">No icons found</div>
                  {query.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      Try a different search term or collection
                    </div>
                  )}
                </div>
              )}
              
              {query.length === 0 && !selectedCategory && recentIcons.length > 0 && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Recently Used</div>
                  <div className="grid grid-cols-6 gap-3">
                    {recentIcons.map((iconName) => (
                      <IconButton
                        key={iconName}
                        iconName={iconName}
                        onClick={() => handleSelectIcon(iconName)}
                        isSelected={value === iconName}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {value ? (
          <span>Selected: <code className="bg-muted px-1 py-0.5 rounded">{value}</code></span>
        ) : (
          <span>Click an icon to select it</span>
        )}
      </div>
    </div>
  );
}

interface IconButtonProps {
  iconName: string;
  onClick: () => void;
  isSelected: boolean;
}

function IconButton({ iconName, onClick, isSelected }: IconButtonProps) {
  const [error, setError] = useState(false);
  
  if (error) {
    return null;
  }
  
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "h-10 w-10 p-0 flex items-center justify-center",
        isSelected && "ring-2 ring-primary ring-offset-1"
      )}
      title={iconName}
    >
      <Icon 
        icon={iconName} 
        className="h-5 w-5" 
        onError={() => setError(true)}
      />
    </Button>
  );
} 