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

// Node category definitions with expanded categories and nodes
const nodeCategories = [
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
        id: 'zapier', 
        label: 'Zapier', 
        icon: 'simple-icons:zapier', 
        color: '#FF4A00', 
        description: 'Connect to Zapier',
        isNew: true 
      },
      { 
        id: 'make', 
        label: 'Make.com', 
        icon: 'simple-icons:make', 
        color: '#0E0F3D', 
        description: 'Connect to Make.com' 
      },
      { 
        id: 'n8n', 
        label: 'n8n', 
        icon: 'simple-icons:n8n', 
        color: '#6A57D5', 
        description: 'Connect to n8n' 
      },
      { 
        id: 'notion', 
        label: 'Notion', 
        icon: 'simple-icons:notion', 
        color: '#000000', 
        description: 'Connect to Notion' 
      },
      { 
        id: 'asana', 
        label: 'Asana', 
        icon: 'simple-icons:asana', 
        color: '#F06A6A', 
        description: 'Connect to Asana' 
      },
      { 
        id: 'trello', 
        label: 'Trello', 
        icon: 'logos:trello', 
        color: '#0079BF', 
        description: 'Connect to Trello' 
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
  const handleAddNode = (node: NodeData) => {
    // Add node at center of viewport
    addNode(node, { x: 250, y: 150 });
  };
  
  // Create a safe wrapper for handling drag start events
  const onDragStartHandler = (node: CustomNodeData) => (event: React.DragEvent<HTMLDivElement>) => {
    // Remove properties we don't want to pass to the node store
    const nodeDataForStore = { ...node };
    
    // Use type assertions with Record instead of any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nodeDataForStore as Record<string, any>).description;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (nodeDataForStore as Record<string, any>).isNew;
    
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
                            <motion.div
                              key={node.id || `node-${Math.random().toString(36).substring(2)}`}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="relative flex items-center p-2 rounded-md border border-border hover:bg-accent/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-grab text-sm group"
                              draggable
                              onDragStart={onDragStartHandler(node)}
                              onClick={() => handleAddNode(node)}
                            >
                              <div 
                                className="h-8 w-8 rounded-md flex items-center justify-center mr-2 transition-all group-hover:scale-110"
                                style={{ 
                                  backgroundColor: `${node.color}20`, 
                                  color: node.color, 
                                  boxShadow: `0 0 0 1px ${node.color}30` 
                                }}
                              >
                                {typeof node.icon === 'string' && node.icon.includes(':') ? (
                                  <Icon icon={node.icon} width={20} height={20} />
                                ) : (
                                  <span>{node.icon}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium flex items-center">
                                  {node.label}
                                </div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {node.description}
                                </div>
                              </div>
                            </motion.div>
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
                          <motion.div
                            key={node.id || `node-${Math.random().toString(36).substring(2)}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative flex items-center p-2 rounded-md border border-border hover:bg-accent/50 hover:border-gray-300 dark:hover:border-gray-600 cursor-grab text-sm group"
                            draggable
                            onDragStart={onDragStartHandler(node)}
                            onClick={() => handleAddNode(node)}
                          >
                            <div 
                              className="h-8 w-8 rounded-md flex items-center justify-center mr-2 transition-all group-hover:scale-110"
                              style={{ 
                                backgroundColor: `${node.color}20`, 
                                color: node.color, 
                                boxShadow: `0 0 0 1px ${node.color}30` 
                              }}
                            >
                              {typeof node.icon === 'string' && node.icon.includes(':') ? (
                                <Icon icon={node.icon} width={20} height={20} />
                              ) : (
                                <span>{node.icon}</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium flex items-center">
                                {node.label}
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {node.description}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute right-1 top-1 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddNode(node);
                              }}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </motion.div>
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