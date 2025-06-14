import { useState, useMemo } from "react";
import { Layout } from "../components/layout/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  SearchIcon,
  PlusIcon,
  MoreVerticalIcon,
  EyeIcon,
  EditIcon,
  SendIcon,
  CopyIcon,
  Trash2Icon,
  MailIcon,
  UsersIcon,
  CalendarIcon,
  TrendingUpIcon,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'renewal' | 'welcome' | 'churn' | 'event' | 'general';
  status: 'draft' | 'active' | 'archived';
  lastModified: string;
  sentCount: number;
  openRate: number;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Membership Renewal Reminder',
    subject: 'Your NCPA Membership is Due for Renewal',
    content: 'Dear {member_name},\n\nYour NCPA membership expires on {renewal_date}. Please renew to continue enjoying member benefits.',
    type: 'renewal',
    status: 'active',
    lastModified: '2024-01-15',
    sentCount: 450,
    openRate: 78.5,
  },
  {
    id: '2',
    name: 'Welcome New Members',
    subject: 'Welcome to NCPA!',
    content: 'Welcome {member_name}!\n\nThank you for joining NCPA. Here\'s everything you need to get started.',
    type: 'welcome',
    status: 'active',
    lastModified: '2024-01-10',
    sentCount: 125,
    openRate: 85.2,
  },
  {
    id: '3',
    name: 'Win-Back Campaign',
    subject: 'We Miss You - Special Offer Inside',
    content: 'Hi {member_name},\n\nWe noticed you haven\'t renewed your membership. Here\'s a special offer to welcome you back.',
    type: 'churn',
    status: 'draft',
    lastModified: '2024-01-12',
    sentCount: 0,
    openRate: 0,
  },
  {
    id: '4',
    name: 'Annual Conference Invitation',
    subject: 'Join Us at the NCPA Annual Conference',
    content: 'Dear {member_name},\n\nYou\'re invited to attend our annual conference featuring industry leaders and networking opportunities.',
    type: 'event',
    status: 'active',
    lastModified: '2024-01-08',
    sentCount: 1200,
    openRate: 72.3,
  },
];

const getTypeColor = (type: EmailTemplate['type']) => {
  return 'bg-white border border-gray-100 text-gray-800';
};

const getStatusColor = (status: EmailTemplate['status']) => {
  return 'bg-white border border-gray-100 text-gray-800';
};

export const Marketing = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");

  const filteredTemplates = useMemo(() => {
    return mockTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || template.type === selectedType;
      const matchesStatus = selectedStatus === "all" || template.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchTerm, selectedType, selectedStatus]);

  const handleCreateTemplate = () => {
    setIsCreating(true);
    setSelectedTemplate({
      id: '',
      name: '',
      subject: '',
      content: '',
      type: 'general',
      status: 'draft',
      lastModified: new Date().toISOString().split('T')[0],
      sentCount: 0,
      openRate: 0,
    });
  };

  const tabs = [
    { id: "templates", label: "Email Templates", count: mockTemplates.length },
    { id: "campaigns", label: "Campaigns", count: 8 },
  ];

  return (
    <Layout activeNav="Marketing">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl leading-8 font-normal text-gray-900">Marketing</h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="inline-flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-lg leading-7 transition-colors duration-200
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-gray-800'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`
                    ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium transition-colors duration-200
                    ${
                      activeTab === tab.id
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-900 group-hover:bg-gray-200'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Templates Tab Content */}
        {activeTab === "templates" && (
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="renewal">Renewal</SelectItem>
                    <SelectItem value="welcome">Welcome</SelectItem>
                    <SelectItem value="churn">Win-Back</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer border-0" style={{ boxShadow: '0 0 2px 0 #afb2ce8f, 0 1px 4px 0 #0404341a' }} onClick={() => setSelectedTemplate(template)}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-medium text-gray-900 mb-2">
                          {template.name}
                        </CardTitle>
                        <div className="flex gap-2 mb-2">
                          <Badge className={getTypeColor(template.type)}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(template.status)}>
                            {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Template
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit Template
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CopyIcon className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <SendIcon className="h-4 w-4 mr-2" />
                            Send Test
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2Icon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Subject: {template.subject}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {template.content.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Sent: {template.sentCount.toLocaleString()}</span>
                      <span>Open Rate: {template.openRate}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Modified: {new Date(template.lastModified).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Campaigns Tab Content */}
        {activeTab === "campaigns" && (
          <div className="text-center py-12">
            <MailIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Campaigns</h3>
            <p className="text-gray-600 mb-6">Create and manage your email marketing campaigns</p>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        )}


        {/* Template Detail Side Tray */}
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              className="flex-1 bg-black/50 transition-opacity duration-300 ease-out animate-in fade-in-0"
              onClick={() => {
                setSelectedTemplate(null);
                setIsCreating(false);
              }}
            />
            
            {/* Side Tray */}
            <div className="w-96 h-full bg-white border-l border-gray-200 shadow-2xl overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-0 data-[state=open]:slide-in-from-right-0">
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-gray-500">
                    {isCreating ? 'Create Template' : 'Email Template'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(null);
                      setIsCreating(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 -mt-1 -mr-2"
                  >
                    ×
                  </Button>
                </div>

                {/* Template Name */}
                <div>
                  <h1 className="text-3xl font-normal text-gray-900">
                    {isCreating ? 'New Email Template' : selectedTemplate.name}
                  </h1>
                </div>

                {/* Action Buttons */}
                {!isCreating && (
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="secondary" size="sm">
                      <EditIcon className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="secondary" size="sm">
                      <SendIcon className="h-4 w-4 mr-2" />
                      Send Test
                    </Button>
                    <Button variant="secondary" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2Icon className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}

                {/* Template Type */}
                {!isCreating && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Type</h4>
                    <p className="text-gray-900">
                      {selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)}
                    </p>
                  </div>
                )}

                {/* Template Status */}
                {!isCreating && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Status</h4>
                    <p className="text-gray-900">
                      {selectedTemplate.status.charAt(0).toUpperCase() + selectedTemplate.status.slice(1)}
                    </p>
                  </div>
                )}

                {/* Subject Line */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Subject Line</h4>
                  <p className="text-gray-900 break-words overflow-wrap-anywhere">{selectedTemplate.subject}</p>
                </div>

                {/* Email Content */}
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-1">Email Content</h4>
                  <p className="text-gray-900 break-words whitespace-pre-wrap">{selectedTemplate.content}</p>
                </div>

                {/* Performance */}
                {!isCreating && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Total Sent</h4>
                      <p className="text-gray-900">{selectedTemplate.sentCount.toLocaleString()}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Open Rate</h4>
                      <p className="text-gray-900">{selectedTemplate.openRate}%</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-1">Last Modified</h4>
                      <p className="text-gray-900">{new Date(selectedTemplate.lastModified).toLocaleDateString()}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};