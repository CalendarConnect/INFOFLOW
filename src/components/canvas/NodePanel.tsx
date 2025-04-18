'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Bot, 
  Database, 
  MessageSquare, 
  Search, 
  X,
  FileText,
  Zap,
  ShoppingCart,
  Calendar,
  Image as ImageIcon,
  Globe,
  Layers,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { NodeData, useNodeStore } from '@/store/nodeStore';
import { Icon } from '@iconify/react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { IntegrationIcon } from '@/components/ui/integration-icon';
import { INTEGRATION_ICONS } from '@/lib/integrationIcons';

// Node category definitions with expanded categories and nodes
const nodeCategories = [
  {
    id: 'text',
    label: 'Text & Content',
    icon: <FileText size={16} />,
    nodes: [
      { 
        id: 'header-h1', 
        label: 'Heading 1', 
        icon: 'lucide:heading-1', 
        color: '#3b82f6', 
        description: 'Large header text',
        isNew: true,
        headerLevel: 'h1'
      },
      { 
        id: 'header-h2', 
        label: 'Heading 2', 
        icon: 'lucide:heading-2', 
        color: '#8b5cf6', 
        description: 'Medium header text',
        isNew: true,
        headerLevel: 'h2'
      },
      { 
        id: 'header-h3', 
        label: 'Heading 3', 
        icon: 'lucide:heading-3', 
        color: '#ec4899', 
        description: 'Small header text',
        isNew: true,
        headerLevel: 'h3'
      },
      { 
        id: 'paragraph', 
        label: 'Paragraph', 
        icon: 'lucide:text', 
        color: '#10b981', 
        description: 'Regular paragraph text' 
      },
      { 
        id: 'rich-text', 
        label: 'Rich Text', 
        icon: 'lucide:text-cursor-input', 
        color: '#f97316', 
        description: 'Formatted rich text block' 
      },
    ]
  },
  {
    id: 'triggers',
    label: 'Triggers',
    icon: <Zap size={16} />,
    nodes: [
      { 
        id: 'webhook', 
        label: 'Webhook', 
        icon: 'lucide:webhook', 
        color: '#0ea5e9', 
        description: 'Trigger on HTTP request',
        isNew: true
      },
      { 
        id: 'schedule', 
        label: 'Schedule', 
        icon: 'lucide:calendar-clock', 
        color: '#8b5cf6', 
        description: 'Trigger on schedule' 
      },
      { 
        id: 'form', 
        label: 'Form Submission', 
        icon: 'lucide:clipboard-list', 
        color: '#f97316', 
        description: 'Trigger on form submit' 
      },
      { 
        id: 'email-trigger', 
        label: 'Email Received', 
        icon: 'lucide:mail-plus', 
        color: '#ef4444', 
        description: 'Trigger on email receipt' 
      },
    ]
  },
  {
    id: 'communication',
    label: 'Communication',
    icon: <MessageSquare size={16} />,
    nodes: [
      { 
        id: 'whatsapp', 
        label: 'WhatsApp', 
        icon: 'logos:whatsapp',
        color: '#25D366', 
        description: 'Send WhatsApp messages' 
      },
      { 
        id: 'email', 
        label: 'Email', 
        icon: 'lucide:mail', 
        color: '#DB4437', 
        description: 'Send emails' 
      },
      { 
        id: 'sms', 
        label: 'SMS', 
        icon: 'lucide:message-square-text', 
        color: '#3498db', 
        description: 'Send SMS messages' 
      },
      { 
        id: 'slack', 
        label: 'Slack', 
        icon: 'logos:slack-icon', 
        color: '#4A154B', 
        description: 'Send Slack messages',
        isNew: true
      },
      { 
        id: 'teams', 
        label: 'Microsoft Teams', 
        icon: 'logos:microsoft-teams', 
        color: '#6264A7', 
        description: 'Send Teams messages',
        isNew: true
      },
      { 
        id: 'telegram', 
        label: 'Telegram', 
        icon: 'logos:telegram', 
        color: '#0088cc', 
        description: 'Send Telegram messages' 
      },
    ]
  },
  {
    id: 'ai',
    label: 'AI Services',
    icon: <Bot size={16} />,
    nodes: [
      { 
        id: 'chatgpt', 
        label: 'ChatGPT', 
        icon: 'simple-icons:openai', 
        color: '#10a37f', 
        description: 'Use OpenAI ChatGPT' 
      },
      { 
        id: 'claude', 
        label: 'Claude', 
        icon: 'simple-icons:anthropic', 
        color: '#7b2cbf', 
        description: 'Use Anthropic Claude' 
      },
      { 
        id: 'llama', 
        label: 'Llama', 
        icon: 'logos:meta', 
        color: '#f97316', 
        description: 'Use Meta Llama' 
      },
      { 
        id: 'huggingface', 
        label: 'Hugging Face', 
        icon: 'simple-icons:huggingface', 
        color: '#FFD21E', 
        description: 'Use HF models',
        isNew: true
      },
      { 
        id: 'image-gen', 
        label: 'Image Generation', 
        icon: 'lucide:image-plus', 
        color: '#ec4899', 
        description: 'Generate images with AI',
        isNew: true
      },
      { 
        id: 'speech-to-text', 
        label: 'Speech to Text', 
        icon: 'lucide:mic', 
        color: '#06b6d4', 
        description: 'Convert speech to text' 
      },
    ]
  },
  {
    id: 'data',
    label: 'Data & Storage',
    icon: <Database size={16} />,
    nodes: [
      { 
        id: 'database', 
        label: 'Database', 
        icon: 'lucide:database', 
        color: '#3b82f6', 
        description: 'Connect to a database' 
      },
      { 
        id: 'file', 
        label: 'File Storage', 
        icon: 'lucide:folder', 
        color: '#f59e0b', 
        description: 'Store files' 
      },
      { 
        id: 'api', 
        label: 'API Request', 
        icon: 'lucide:link', 
        color: '#8b5cf6', 
        description: 'Make API requests' 
      },
      { 
        id: 'sheets', 
        label: 'Google Sheets', 
        icon: 'logos:google-sheets', 
        color: '#0F9D58', 
        description: 'Connect to Google Sheets',
        isNew: true
      },
      { 
        id: 'airtable', 
        label: 'Airtable', 
        icon: 'simple-icons:airtable', 
        color: '#18BFFF', 
        description: 'Connect to Airtable' 
      },
      { 
        id: 'firebase', 
        label: 'Firebase', 
        icon: 'logos:firebase', 
        color: '#FFCA28', 
        description: 'Connect to Firebase' 
      },
    ]
  },
  {
    id: 'logic',
    label: 'Logic & Flow',
    icon: <Activity size={16} />,
    nodes: [
      { 
        id: 'condition', 
        label: 'Condition', 
        icon: 'lucide:git-branch', 
        color: '#ec4899', 
        description: 'Branch based on conditions' 
      },
      { 
        id: 'loop', 
        label: 'Loop', 
        icon: 'lucide:repeat', 
        color: '#14b8a6', 
        description: 'Loop through items' 
      },
      { 
        id: 'timer', 
        label: 'Timer', 
        icon: 'lucide:timer', 
        color: '#f43f5e', 
        description: 'Wait for a specified time' 
      },
      { 
        id: 'switch', 
        label: 'Switch', 
        icon: 'lucide:git-merge', 
        color: '#6366f1', 
        description: 'Multiple condition branches',
        isNew: true
      },
      { 
        id: 'filter', 
        label: 'Filter', 
        icon: 'lucide:filter', 
        color: '#0ea5e9', 
        description: 'Filter data items' 
      },
      { 
        id: 'aggregator', 
        label: 'Aggregator', 
        icon: 'lucide:combine', 
        color: '#10b981', 
        description: 'Combine multiple operations' 
      },
    ]
  },
  {
    id: 'crm',
    label: 'CRM & Marketing',
    icon: <ShoppingCart size={16} />,
    nodes: [
      { 
        id: 'hubspot', 
        label: 'HubSpot', 
        icon: 'simple-icons:hubspot', 
        color: '#FF7A59', 
        description: 'Connect to HubSpot',
        isNew: true
      },
      { 
        id: 'salesforce', 
        label: 'Salesforce', 
        icon: 'logos:salesforce', 
        color: '#00A1E0', 
        description: 'Connect to Salesforce' 
      },
      { 
        id: 'mailchimp', 
        label: 'Mailchimp', 
        icon: 'simple-icons:mailchimp', 
        color: '#FFE01B', 
        description: 'Connect to Mailchimp' 
      },
      { 
        id: 'intercom', 
        label: 'Intercom', 
        icon: 'simple-icons:intercom', 
        color: '#6AFDEF', 
        description: 'Connect to Intercom' 
      },
      { 
        id: 'stripe', 
        label: 'Stripe', 
        icon: 'logos:stripe', 
        color: '#635BFF', 
        description: 'Process payments with Stripe' 
      },
      { 
        id: 'zendesk', 
        label: 'Zendesk', 
        icon: 'simple-icons:zendesk', 
        color: '#03363D', 
        description: 'Connect to Zendesk' 
      },
    ]
  },
  {
    id: 'calendar',
    label: 'Calendar & Events',
    icon: <Calendar size={16} />,
    nodes: [
      { 
        id: 'google-calendar', 
        label: 'Google Calendar', 
        icon: 'logos:google-calendar', 
        color: '#4285F4', 
        description: 'Connect to Google Calendar',
        isNew: true 
      },
      { 
        id: 'outlook-calendar', 
        label: 'Outlook Calendar', 
        icon: 'logos:microsoft-icon', 
        color: '#0078D4', 
        description: 'Connect to Outlook Calendar' 
      },
      { 
        id: 'meeting', 
        label: 'Meeting Scheduler', 
        icon: 'lucide:calendar-plus', 
        color: '#8b5cf6', 
        description: 'Schedule meetings' 
      },
      { 
        id: 'reminder', 
        label: 'Reminder', 
        icon: 'lucide:bell', 
        color: '#f97316', 
        description: 'Set reminders' 
      },
    ]
  },
  {
    id: 'media',
    label: 'Media & Content',
    icon: <ImageIcon size={16} />,
    nodes: [
      { 
        id: 'image-processor', 
        label: 'Image Processor', 
        icon: 'lucide:image', 
        color: '#ec4899', 
        description: 'Process images',
        isNew: true 
      },
      { 
        id: 'video-editor', 
        label: 'Video Editor', 
        icon: 'lucide:video', 
        color: '#f43f5e', 
        description: 'Edit videos' 
      },
      { 
        id: 'pdf-generator', 
        label: 'PDF Generator', 
        icon: 'lucide:file-text', 
        color: '#ef4444', 
        description: 'Generate PDF documents' 
      },
      { 
        id: 'qr-code', 
        label: 'QR Code', 
        icon: 'lucide:qr-code', 
        color: '#6366f1', 
        description: 'Generate QR codes' 
      },
    ]
  },
  {
    id: 'web',
    label: 'Web & Services',
    icon: <Globe size={16} />,
    nodes: [
      { 
        id: 'web-scraper', 
        label: 'Web Scraper', 
        icon: 'lucide:scissors', 
        color: '#0ea5e9', 
        description: 'Extract data from websites',
        isNew: true 
      },
      { 
        id: 'oauth', 
        label: 'OAuth', 
        icon: 'lucide:key', 
        color: '#10b981', 
        description: 'Handle OAuth authentication' 
      },
      { 
        id: 'http-request', 
        label: 'HTTP Request', 
        icon: 'lucide:globe', 
        color: '#8b5cf6', 
        description: 'Make HTTP requests' 
      },
      { 
        id: 'webhook-response', 
        label: 'Webhook Response', 
        icon: 'lucide:webhook', 
        color: '#f97316', 
        description: 'Send webhook responses' 
      },
    ]
  },
  {
    id: 'integrations',
    label: 'Popular Integrations',
    icon: <Layers size={16} />,
    featured: true,
    nodes: [
      { 
        id: 'shopify', 
        label: 'Shopify', 
        icon: 'shopify', 
        color: '#96BF47', 
        description: 'Connect to Shopify',
        isNew: true 
      },
      { 
        id: 'stripe', 
        label: 'Stripe', 
        icon: 'stripe', 
        color: '#635BFF', 
        description: 'Process payments with Stripe' 
      },
      { 
        id: 'github', 
        label: 'GitHub', 
        icon: 'github', 
        color: '#181717', 
        description: 'Connect to GitHub',
        isNew: true 
      },
      { 
        id: 'instagram', 
        label: 'Instagram', 
        icon: 'instagram', 
        color: '#E4405F', 
        description: 'Connect to Instagram',
        isNew: true
      },
      { 
        id: 'slack-integration', 
        label: 'Slack', 
        icon: 'slack', 
        color: '#4A154B', 
        description: 'Connect to Slack workspace' 
      },
      { 
        id: 'notion-integration', 
        label: 'Notion', 
        icon: 'notion', 
        color: '#000000', 
        description: 'Connect to Notion workspace' 
      },
      { 
        id: 'hubspot-integration', 
        label: 'HubSpot', 
        icon: 'hubspot', 
        color: '#FF7A59', 
        description: 'Connect to HubSpot CRM',
        isNew: true
      },
      { 
        id: 'google-analytics-integration', 
        label: 'Google Analytics', 
        icon: 'google-analytics', 
        color: '#E37400', 
        description: 'Connect to Google Analytics' 
      },
    ]
  },
  {
    id: 'social-media',
    label: 'Social Media',
    icon: <MessageSquare size={16} />,
    nodes: [
      { 
        id: 'twitter-integration', 
        label: 'Twitter/X', 
        icon: 'twitter', 
        color: '#1DA1F2', 
        description: 'Connect to Twitter/X' 
      },
      { 
        id: 'facebook-integration', 
        label: 'Facebook', 
        icon: 'facebook', 
        color: '#1877F2', 
        description: 'Connect to Facebook' 
      },
      { 
        id: 'linkedin-integration', 
        label: 'LinkedIn', 
        icon: 'linkedin', 
        color: '#0A66C2', 
        description: 'Connect to LinkedIn' 
      },
      { 
        id: 'discord-integration', 
        label: 'Discord', 
        icon: 'discord', 
        color: '#5865F2', 
        description: 'Connect to Discord' 
      },
      { 
        id: 'telegram-integration', 
        label: 'Telegram', 
        icon: 'telegram', 
        color: '#26A5E4', 
        description: 'Connect to Telegram' 
      },
      { 
        id: 'whatsapp-integration', 
        label: 'WhatsApp', 
        icon: 'whatsapp', 
        color: '#25D366', 
        description: 'Connect to WhatsApp' 
      },
    ]
  },
];

interface NodePanelProps {
  className?: string;
}

// Define a custom type for our node that includes id, description and isNew properties
interface CustomNodeData extends NodeData {
  id?: string;
  description: string;
  isNew?: boolean;
  headerLevel?: 'h1' | 'h2' | 'h3';
}

// Add custom CSS to ensure scrolling works on all browsers
const scrollStyles = `
  .node-library-scroll {
    height: 100%;
    overflow-y: auto;
    -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
    scrollbar-width: none;  /* Hide scrollbar for Firefox */
  }
  
  .node-library-scroll::-webkit-scrollbar {
    display: none;  /* Hide scrollbar for Chrome, Safari and Opera */
  }
`;

// Add this function before the NodePanel component
const isIntegrationIcon = (icon: string): boolean => {
  return !icon.includes(':') && INTEGRATION_ICONS.some(i => i.id === icon);
};

// Helper function to render the correct icon type
const renderIcon = (icon: string | undefined, size = 16, color?: string) => {
  if (!icon) return null;
  
  // Check if it's an integration icon (doesn't have a prefix like 'lucide:')
  if (isIntegrationIcon(icon)) {
    return <IntegrationIcon iconId={icon} size={size} />;
  }
  
  // Regular Iconify icon
  if (icon.includes(':')) {
    return <Icon icon={icon} style={{ fontSize: size, color }} />;
  }
  
  // Plain text icon
  return <span style={{ fontSize: size, color }}>{icon}</span>;
};

interface NodeItemProps {
  node: CustomNodeData;
  onClick: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

const NodeItem = ({ node, onClick, onDragStart, isDragging }: NodeItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 rounded-md cursor-grab transition-colors",
        "bg-card border border-border hover:border-primary/50 hover:bg-accent",
        isDragging && "border-primary bg-primary/5",
      )}
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
    >
      <div 
        className="flex-shrink-0 w-9 h-9 rounded-md flex items-center justify-center" 
        style={{ backgroundColor: `${node.color}15` }}
      >
        {renderIcon(node.icon, 20, node.color)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-medium text-sm truncate">{node.label}</div>
          {node.isNew && (
            <div className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full">New</div>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">{node.description}</div>
      </div>
    </div>
  );
};

export function NodePanel({ className }: NodePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const { addNode } = useNodeStore();
  const [activeTab, setActiveTab] = useState<string>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Filter nodes based on search query and active tab
  const filteredCategories = nodeCategories
    .filter(category => activeTab === 'all' || (activeTab === 'featured' && category.featured))
    .map(category => ({
      ...category,
      nodes: category.nodes.filter(node => 
        (searchQuery === '' || 
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }))
    .filter(category => category.nodes.length > 0);
  
  // Focus search input on keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Get recent and new nodes
  const featuredCategories = [
    {
      id: 'new',
      label: 'New Nodes',
      icon: <Zap size={16} color="#f97316" />,
      nodes: nodeCategories.flatMap(category => 
        category.nodes.filter(node => node.isNew as boolean)
      )
    },
    {
      id: 'popular',
      label: 'Popular Nodes',
      icon: <Zap size={16} color="#3b82f6" />,
      nodes: [
        nodeCategories.find(c => c.id === 'communication')?.nodes.find(n => n.id === 'whatsapp'),
        nodeCategories.find(c => c.id === 'ai')?.nodes.find(n => n.id === 'chatgpt'),
        nodeCategories.find(c => c.id === 'data')?.nodes.find(n => n.id === 'api'),
        nodeCategories.find(c => c.id === 'logic')?.nodes.find(n => n.id === 'condition'),
        nodeCategories.find(c => c.id === 'crm')?.nodes.find(n => n.id === 'hubspot'),
        nodeCategories.find(c => c.id === 'integrations')?.nodes.find(n => n.id === 'make'),
      ].filter(Boolean) as CustomNodeData[]
    }
  ];
  
  // Handle adding a node (click)
  const handleAddNode = (node: CustomNodeData) => {
    // Check if this is a header node
    if (node.id?.startsWith('header-')) {
      const headerLevel = node.headerLevel || 'h1';
      const headerData = {
        text: node.label || 'New Header',
        level: headerLevel,
        fontSize: headerLevel === 'h1' ? 28 : headerLevel === 'h2' ? 22 : 18,
        fontWeight: 'semibold' as 'semibold',
        fontFamily: 'sans' as 'sans',
        color: '#ffffff',
        alignment: 'left' as 'left',
        width: 320,
      };
      
      const { addHeaderNode } = useNodeStore.getState();
      addHeaderNode(headerData, { x: 250, y: 150 });
      return;
    }
    
    // For regular nodes
    addNode(node, { x: 250, y: 150 });
  };
  
  // Create a safe wrapper for handling drag start events
  const onDragStartHandler = (node: CustomNodeData) => (event: React.DragEvent<HTMLDivElement>) => {
    // Special handling for header nodes
    if (node.id?.startsWith('header-')) {
      const headerLevel = node.headerLevel || 'h1';
      const headerData = {
        type: 'header',
        text: node.label || 'New Header',
        level: headerLevel,
        fontSize: headerLevel === 'h1' ? 28 : headerLevel === 'h2' ? 22 : 18,
        fontWeight: 'semibold' as 'semibold',
        fontFamily: 'sans' as 'sans',
        color: '#ffffff',
        alignment: 'left' as 'left',
        width: 320,
      };
      
      event.dataTransfer.setData('application/reactflow', JSON.stringify(headerData));
      event.dataTransfer.effectAllowed = 'move';
      return;
    }
    
    // Regular node handling
    // Remove properties we don't want to pass to the node store
    const nodeDataForStore = { ...node };
    
    // Use type assertions with Record instead of any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nodeDataForStore as Record<string, any>).description;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nodeDataForStore as Record<string, any>).isNew;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nodeDataForStore as Record<string, any>).headerLevel;
    
    // Set the drag data
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeDataForStore));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <div className={cn("w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg border border-border shadow-sm", className)}>
      {/* Add the custom styles */}
      <style jsx>{scrollStyles}</style>
      
      <div className="p-3 border-b border-border flex-shrink-0">
        <h3 className="font-medium mb-2 flex items-center">
          <span>Node Library</span>
          <span className="text-xs ml-2 text-muted-foreground">
            ({nodeCategories.reduce((acc, category) => acc + category.nodes.length, 0)} nodes)
          </span>
        </h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            placeholder="Search nodes... (Ctrl+F)"
            className="pl-8 transition-all border-gray-200 dark:border-gray-700 focus-visible:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100%-64px)]">
        <div className="px-3 border-b border-border flex-shrink-0">
          <TabsList className="w-full justify-start bg-transparent h-9 p-0">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 rounded-md px-3 py-1 h-7"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-700 rounded-md px-3 py-1 h-7"
            >
              Featured
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="node-library-scroll flex-grow p-1" ref={scrollAreaRef}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (searchQuery ? '-search' : '')}
              initial={{ opacity: 0.8, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.8, y: 5 }}
              transition={{ duration: 0.15 }}
            >
              {searchQuery && filteredCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                  <FileText size={40} className="mb-2 opacity-20" />
                  <p>No nodes found matching &quot;{searchQuery}&quot;</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            
              {/* Featured sections for Popular and New nodes */}
              {!searchQuery && activeTab === 'all' && (
                <Accordion
                  type="multiple"
                  value={expandedCategories}
                  onValueChange={setExpandedCategories}
                  className="pb-2"
                >
                  {featuredCategories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border-b">
                      <AccordionTrigger className="py-2 px-2 hover:no-underline group">
                        <div className="flex items-center gap-2">
                          <div className="text-muted-foreground group-hover:text-foreground">
                            {category.icon}
                          </div>
                          <span>{category.label}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({category.nodes.length})
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="transition-all">
                        <div className="grid grid-cols-1 gap-1.5 p-1">
                          {category.nodes.map((node: CustomNodeData) => (
                            <NodeItem
                              key={node.id || `node-${Math.random().toString(36).substring(2)}`}
                              node={node}
                              onClick={() => handleAddNode(node)}
                              onDragStart={onDragStartHandler(node)}
                              isDragging={false}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
              
              {/* Main categories */}
              <Accordion
                type="multiple"
                value={expandedCategories}
                onValueChange={setExpandedCategories}
                className={cn(
                  "pb-4",
                  (!searchQuery && activeTab === 'all') ? "mt-2" : "mt-0"
                )}
              >
                {filteredCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id} className="border-b">
                    <AccordionTrigger className="py-2 px-2 hover:no-underline group">
                      <div className="flex items-center gap-2">
                        <div className="text-muted-foreground group-hover:text-foreground">
                          {category.icon}
                        </div>
                        <span>{category.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({category.nodes.length})
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="transition-all">
                      <div className="grid grid-cols-1 gap-1.5 p-1">
                        {category.nodes.map((node: CustomNodeData) => (
                          <NodeItem
                            key={node.id || `node-${Math.random().toString(36).substring(2)}`}
                            node={node}
                            onClick={() => handleAddNode(node)}
                            onDragStart={onDragStartHandler(node)}
                            isDragging={false}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
} 