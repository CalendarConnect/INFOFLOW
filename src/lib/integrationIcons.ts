// List of all integration icons available in the public directory
export const INTEGRATION_ICONS = [
  { id: 'shopify', name: 'Shopify', path: '/shopify.svg' },
  { id: 'stripe', name: 'Stripe', path: '/stripe-trigger.svg' },
  { id: 'linkedin', name: 'LinkedIn', path: '/linkedin.svg' },
  { id: 'facebook', name: 'Facebook', path: '/facebook-trigger.svg' },
  { id: 'twitter', name: 'Twitter', path: '/twitter.svg' },
  { id: 'instagram', name: 'Instagram', path: '/instagram.svg' },
  { id: 'discord', name: 'Discord', path: '/discord.svg' },
  { id: 'slack', name: 'Slack', path: '/slack.svg' },
  { id: 'telegram', name: 'Telegram', path: '/telegram.svg' },
  { id: 'github', name: 'GitHub', path: '/github.svg' },
  { id: 'google-ads', name: 'Google Ads', path: '/google-ads.svg' },
  { id: 'google-analytics', name: 'Google Analytics', path: '/google-analytics.svg' },
  { id: 'hubspot', name: 'HubSpot', path: '/hubspot.svg' },
  { id: 'zoom', name: 'Zoom', path: '/zoom.svg' },
  { id: 'asana', name: 'Asana', path: '/asana.svg' },
  { id: 'trello', name: 'Trello', path: '/trello.svg' },
  { id: 'notion', name: 'Notion', path: '/notion.svg' },
  { id: 'clickup', name: 'ClickUp', path: '/clickup.svg' },
  { id: 'gmail', name: 'Gmail', path: '/gmail.svg' },
  { id: 'outlook', name: 'Outlook', path: '/microsoft-outlook.svg' },
  { id: 'teams', name: 'Microsoft Teams', path: '/microsoft-teams.svg' },
  { id: 'salesforce', name: 'Salesforce', path: '/salesforce.svg' },
  { id: 'woocommerce', name: 'WooCommerce', path: '/woocommerce-trigger.svg' },
  { id: 'wordpress', name: 'WordPress', path: '/wordpress.svg' },
  { id: 'pipedrive', name: 'Pipedrive', path: '/pipedrive.svg' },
  { id: 'calendly', name: 'Calendly', path: '/calendly-trigger.svg' },
  { id: 'paypal', name: 'PayPal', path: '/paypal.svg' },
  { id: 'zendesk', name: 'Zendesk', path: '/zendesk.svg' },
  { id: 'mailgun', name: 'Mailgun', path: '/mailgun.svg' },
  { id: 'intercom', name: 'Intercom', path: '/intercom.svg' },
  { id: 'whatsapp', name: 'WhatsApp', path: '/whatsapp-business-cloud.svg' },
  { id: 'zoho-crm', name: 'Zoho CRM', path: '/zoho-crm.svg' },
  { id: 'activecampaign', name: 'ActiveCampaign', path: '/activecampaign.svg' },
  { id: 'webflow', name: 'Webflow', path: '/webflow-trigger.svg' },
  { id: 'surveymonkey', name: 'SurveyMonkey', path: '/surveymonkey-trigger.svg' },
  { id: 'chargebee', name: 'Chargebee', path: '/chargebee-trigger.png' },
  { id: 'magento', name: 'Magento', path: '/magento-2.svg' },
  { id: 'highlevel', name: 'HighLevel', path: '/highlevel.svg' },
  { id: 'cal', name: 'Cal.com', path: '/cal-trigger.svg' },
  // AI models
  { id: 'openai', name: 'OpenAI', path: '/embeddings-openai.svg' },
  { id: 'ollama', name: 'Ollama', path: '/embeddings-ollama.svg' },
  { id: 'anthropic', name: 'Anthropic', path: '/anthropic-chat-model.svg' },
  { id: 'deepseek', name: 'DeepSeek', path: '/deepseek-chat-model.svg' },
  { id: 'gemini', name: 'Google Gemini', path: '/google_ai_studio_gemini_e157b42786.png' },
  { id: 'jasper', name: 'Jasper', path: '/jasper_46804eed54.png' },
];

// Categories for integration icons
export const INTEGRATION_CATEGORIES = {
  'CRM & Marketing': ['hubspot', 'salesforce', 'pipedrive', 'zoho-crm', 'activecampaign', 'intercom', 'mailgun'],
  'E-commerce': ['shopify', 'woocommerce', 'magento', 'stripe', 'paypal', 'chargebee'],
  'Social Media': ['facebook', 'twitter', 'linkedin', 'instagram', 'discord', 'slack', 'telegram', 'whatsapp'],
  'Productivity': ['asana', 'trello', 'notion', 'clickup', 'gmail', 'outlook', 'teams', 'zoom', 'calendly', 'cal'],
  'Website': ['wordpress', 'webflow', 'surveymonkey', 'google-analytics', 'google-ads'],
  'AI & ML': ['openai', 'anthropic', 'ollama', 'deepseek', 'gemini', 'jasper'],
};

// Get all integration icon IDs
export const getAllIntegrationIconIds = (): string[] => {
  return INTEGRATION_ICONS.map(icon => icon.id);
};

// Get path for a specific integration icon
export const getIntegrationIconPath = (id: string): string | undefined => {
  const icon = INTEGRATION_ICONS.find(icon => icon.id === id);
  return icon?.path;
};

// Search integration icons by name
export const searchIntegrationIcons = (query: string): string[] => {
  if (!query) return getAllIntegrationIconIds();
  
  const lowerQuery = query.toLowerCase();
  return INTEGRATION_ICONS
    .filter(icon => icon.name.toLowerCase().includes(lowerQuery))
    .map(icon => icon.id);
};

// Get integration icons by category
export const getIntegrationIconsByCategory = (category: string): string[] => {
  if (!category || !(category in INTEGRATION_CATEGORIES)) {
    return getAllIntegrationIconIds();
  }
  
  return INTEGRATION_CATEGORIES[category as keyof typeof INTEGRATION_CATEGORIES] || [];
}; 