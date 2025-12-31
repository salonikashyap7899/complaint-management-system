'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Send, 
  Settings, 
  Users, 
  TrendingUp,
  Building2,
  AlertTriangle,
  MessageSquare,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  Workflow
} from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data states
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // Form states
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintDetail, setShowComplaintDetail] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [resolvingComplaint, setResolvingComplaint] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  
  // Auth states
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'complainant' });
  
  // Complaint form
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium'
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      seedDatabase(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user && token) {
      fetchData();
    }
  }, [user, token, activeTab]);

  const seedDatabase = async (authToken) => {
    try {
      await fetch('/api/seed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      setLoading(false);
    } catch (error) {
      console.error('Seed error:', error);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch departments
      const deptRes = await fetch('/api/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const deptData = await deptRes.json();
      setDepartments(deptData.departments || []);

      // Fetch categories
      const catRes = await fetch('/api/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const catData = await catRes.json();
      setCategories(catData.categories || []);

      // Fetch complaints
      const compRes = await fetch('/api/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const compData = await compRes.json();
      setComplaints(compData.complaints || []);

      // Fetch analytics
      const statsRes = await fetch('/api/analytics/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      setStats(statsData.stats || {});

      // Fetch users (admin only)
      if (user.role === 'admin') {
        const usersRes = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        await seedDatabase(data.token);
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setActiveTab('dashboard');
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(complaintForm)
      });

      const data = await res.json();
      
      if (data.success) {
        setShowComplaintForm(false);
        setComplaintForm({ title: '', description: '', categoryId: '', priority: 'medium' });
        fetchData();
        alert('Complaint submitted successfully!');
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Submission failed');
    }
  };

  const handleAssignComplaint = async (complaintId, staffId) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ staffId })
      });

      if (res.ok) {
        fetchData();
        alert('Complaint assigned successfully!');
      }
    } catch (error) {
      console.error('Assign error:', error);
    }
  };

  const handleUpdateStatus = async (complaintId, status, note) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, note })
      });

      if (res.ok) {
        fetchData();
        alert('Status updated successfully!');
      }
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const handleResolveComplaint = async (complaintId, note) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolutionNote: note || resolutionNote })
      });

      if (res.ok) {
        fetchData();
        setShowComplaintDetail(false);
        setResolvingComplaint(null);
        setResolutionNote('');
        alert('Complaint resolved successfully!');
      }
    } catch (error) {
      console.error('Resolve error:', error);
    }
  };

  const getFilteredComplaints = () => {
    if (filterStatus === 'all') return complaints;
    if (filterStatus === 'pending') return complaints.filter(c => c.status === 'pending');
    if (filterStatus === 'assigned') return complaints.filter(c => c.status === 'assigned');
    if (filterStatus === 'in-progress') return complaints.filter(c => c.status === 'in-progress');
    if (filterStatus === 'resolved') return complaints.filter(c => c.status === 'resolved');
    return complaints;
  };

  const getPendingCount = () => {
    return complaints.filter(c => ['pending', 'assigned', 'in-progress'].includes(c.status)).length;
  };

  const getTimeSinceSubmission = (submittedAt) => {
    const now = new Date();
    const submitted = new Date(submittedAt);
    const diffMs = now - submitted;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const handleQuickResolve = async (complaintId, quickNote) => {
    await handleUpdateStatus(complaintId, 'in-progress', 'Quick resolution started');
    setTimeout(() => {
      handleResolveComplaint(complaintId, quickNote);
    }, 500);
  };

  const handleFeedback = async (complaintId, rating, comment) => {
    try {
      const res = await fetch(`/api/complaints/${complaintId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        fetchData();
        alert('Feedback submitted successfully!');
      }
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'pending': 'bg-yellow-500',
      'assigned': 'bg-blue-500',
      'in-progress': 'bg-purple-500',
      'resolved': 'bg-green-500',
      'reopened': 'bg-red-500'
    };
    return variants[status] || 'bg-gray-500';
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      'low': 'bg-green-600',
      'medium': 'bg-yellow-600',
      'high': 'bg-red-600'
    };
    return variants[priority] || 'bg-gray-600';
  };

  // Login/Register Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Complaint Management System</CardTitle>
            <CardDescription className="text-center">
              {authMode === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  required
                />
              </div>
              
              {authMode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={authForm.role}
                    onValueChange={(value) => setAuthForm({ ...authForm, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complainant">Complainant (Student/Employee)</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="hod">HOD (Department Head)</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button type="submit" className="w-full">
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                {authMode === 'login' ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
            </div>
            
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Demo Credentials:</strong><br />
                Admin: admin@college.edu / admin123
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main Application
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">CMS</h1>
              <p className="text-xs text-gray-500">Complaint System</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 space-y-2">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={activeTab === 'complaints' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('complaints')}
          >
            <FileText className="mr-2 h-4 w-4" />
            All Complaints
          </Button>
          
          {(user.role === 'admin' || user.role === 'hod' || user.role === 'staff') && (
            <Button
              variant={activeTab === 'pending' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('pending')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Pending
              {getPendingCount() > 0 && (
                <Badge className="ml-auto bg-red-500">{getPendingCount()}</Badge>
              )}
            </Button>
          )}
          
          {user.role === 'complainant' && (
            <Button
              variant="ghost"
              className="w-full justify-start text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => setShowComplaintForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Complaint
            </Button>
          )}
          
          {(user.role === 'admin' || user.role === 'hod') && (
            <Button
              variant={activeTab === 'manage' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveTab('manage')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Manage
            </Button>
          )}
          
          <Button
            variant={activeTab === 'diagrams' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveTab('diagrams')}
          >
            <Workflow className="mr-2 h-4 w-4" />
            System Diagrams
          </Button>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <p className="text-gray-500">Welcome back, {user.name}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
                    <FileText className="h-4 w-4 text-gray-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pending || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Awaiting action</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.resolved || 0}</div>
                    <p className="text-xs text-gray-500 mt-1">Completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.resolutionRate || 0}%</div>
                    <Progress value={parseFloat(stats.resolutionRate || 0)} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              {user.role === 'admin' && stats.categoryStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Categories</CardTitle>
                      <CardDescription>Complaints by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.categoryStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="_id" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Priority Distribution</CardTitle>
                      <CardDescription>Complaints by priority level</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={stats.priorityStats}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {stats.priorityStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Complaints */}
              {user.role === 'admin' && stats.recentComplaints && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Complaints</CardTitle>
                    <CardDescription>Latest submissions across all departments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.recentComplaints.slice(0, 5).map((complaint) => (
                        <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => {
                          setSelectedComplaint(complaint);
                          setShowComplaintDetail(true);
                        }}>
                          <div className="flex-1">
                            <h4 className="font-medium">{complaint.title}</h4>
                            <p className="text-sm text-gray-500">{complaint.departmentName} • {complaint.complainantName}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityBadge(complaint.priority)}>{complaint.priority}</Badge>
                            <Badge className={getStatusBadge(complaint.status)}>{complaint.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">All Complaints</h2>
                  <p className="text-gray-500">View and manage all complaints</p>
                </div>
                {user.role === 'complainant' && (
                  <Button onClick={() => setShowComplaintForm(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Complaint
                  </Button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('all')}
                  size="sm"
                >
                  All ({complaints.length})
                </Button>
                <Button
                  variant={filterStatus === 'pending' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('pending')}
                  size="sm"
                >
                  Pending ({complaints.filter(c => c.status === 'pending').length})
                </Button>
                <Button
                  variant={filterStatus === 'assigned' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('assigned')}
                  size="sm"
                >
                  Assigned ({complaints.filter(c => c.status === 'assigned').length})
                </Button>
                <Button
                  variant={filterStatus === 'in-progress' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('in-progress')}
                  size="sm"
                >
                  In Progress ({complaints.filter(c => c.status === 'in-progress').length})
                </Button>
                <Button
                  variant={filterStatus === 'resolved' ? 'default' : 'outline'}
                  onClick={() => setFilterStatus('resolved')}
                  size="sm"
                >
                  Resolved ({complaints.filter(c => c.status === 'resolved').length})
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {getFilteredComplaints().map((complaint) => (
                  <Card key={complaint.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    setSelectedComplaint(complaint);
                    setShowComplaintDetail(true);
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{complaint.title}</h3>
                            <Badge className={getPriorityBadge(complaint.priority)}>{complaint.priority}</Badge>
                            <Badge className={getStatusBadge(complaint.status)}>{complaint.status}</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{complaint.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Building2 className="mr-1 h-4 w-4" />
                              {complaint.departmentName}
                            </span>
                            <span className="flex items-center">
                              <FileText className="mr-1 h-4 w-4" />
                              {complaint.categoryName}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-4 w-4" />
                              {new Date(complaint.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {getFilteredComplaints().length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No complaints found</h3>
                      <p className="text-gray-500">There are no complaints matching this filter.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Pending Complaints Tab */}
          {activeTab === 'pending' && (user.role === 'admin' || user.role === 'hod' || user.role === 'staff') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Pending Complaints</h2>
                  <p className="text-gray-500">Complaints requiring action</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {getPendingCount()} Pending
                </Badge>
              </div>

              {/* Priority Sorting */}
              <div className="grid grid-cols-1 gap-4">
                {complaints
                  .filter(c => ['pending', 'assigned', 'in-progress'].includes(c.status))
                  .sort((a, b) => {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  })
                  .map((complaint) => (
                    <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold">{complaint.title}</h3>
                                <Badge className={getPriorityBadge(complaint.priority)}>{complaint.priority}</Badge>
                                <Badge className={getStatusBadge(complaint.status)}>{complaint.status}</Badge>
                              </div>
                              <p className="text-gray-600 mb-3">{complaint.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Building2 className="mr-1 h-4 w-4" />
                                  {complaint.departmentName}
                                </span>
                                <span className="flex items-center">
                                  <FileText className="mr-1 h-4 w-4" />
                                  {complaint.categoryName}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {new Date(complaint.submittedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="border-t pt-4">
                            {/* HOD Actions - Assign to Staff */}
                            {(user.role === 'hod' || user.role === 'admin') && complaint.status === 'pending' && (
                              <div className="flex items-center space-x-2">
                                <Label className="text-sm font-medium">Assign to Staff:</Label>
                                <Select onValueChange={(staffId) => handleAssignComplaint(complaint.id, staffId)}>
                                  <SelectTrigger className="w-64">
                                    <SelectValue placeholder="Select staff member" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {users.filter(u => u.role === 'staff' && u.departmentId === complaint.departmentId).map(staff => (
                                      <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {/* Staff Actions - Start Work */}
                            {(user.role === 'staff' || user.role === 'hod' || user.role === 'admin') && complaint.status === 'assigned' && (
                              <div className="flex space-x-2">
                                <Button 
                                  onClick={() => handleUpdateStatus(complaint.id, 'in-progress', 'Started working on this complaint')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <ArrowRight className="mr-2 h-4 w-4" />
                                  Start Working
                                </Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedComplaint(complaint);
                                    setShowComplaintDetail(true);
                                  }}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}

                            {/* Staff Actions - Resolve */}
                            {(user.role === 'staff' || user.role === 'hod' || user.role === 'admin') && complaint.status === 'in-progress' && (
                              <div className="space-y-3">
                                {resolvingComplaint === complaint.id ? (
                                  <div className="space-y-3">
                                    <Textarea
                                      placeholder="Enter resolution details..."
                                      value={resolutionNote}
                                      onChange={(e) => setResolutionNote(e.target.value)}
                                      rows={3}
                                      className="w-full"
                                    />
                                    <div className="flex space-x-2">
                                      <Button 
                                        onClick={() => handleResolveComplaint(complaint.id, resolutionNote)}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={!resolutionNote}
                                      >
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Confirm Resolution
                                      </Button>
                                      <Button 
                                        variant="outline"
                                        onClick={() => {
                                          setResolvingComplaint(null);
                                          setResolutionNote('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={() => setResolvingComplaint(complaint.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Resolve Complaint
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedComplaint(complaint);
                                        setShowComplaintDetail(true);
                                      }}
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                {getPendingCount() === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No pending complaints!</h3>
                      <p className="text-gray-500">All complaints have been resolved.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* System Diagrams Tab */}
          {activeTab === 'diagrams' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">System Diagrams</h2>
                <p className="text-gray-500">Interactive system architecture and workflow diagrams</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowDiagram('architecture')}>
                  <CardHeader>
                    <CardTitle>System Architecture</CardTitle>
                    <CardDescription>Three-tier architecture diagram</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <p className="font-semibold">Presentation Layer</p>
                          <p className="text-sm text-gray-500">React + Next.js Frontend</p>
                        </div>
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-blue-600 rotate-90" />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <p className="font-semibold">Application Layer</p>
                          <p className="text-sm text-gray-500">Next.js API Routes</p>
                        </div>
                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-blue-600 rotate-90" />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <p className="font-semibold">Data Layer</p>
                          <p className="text-sm text-gray-500">MongoDB Database</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowDiagram('workflow')}>
                  <CardHeader>
                    <CardTitle>Complaint Workflow</CardTitle>
                    <CardDescription>End-to-end complaint resolution process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-yellow-500 rounded-full p-2">
                            <Send className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">1. Submit</p>
                            <p className="text-sm text-gray-500">Complainant submits issue</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-500 rounded-full p-2">
                            <Users className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">2. Auto-Assign</p>
                            <p className="text-sm text-gray-500">Routed to HOD</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-purple-500 rounded-full p-2">
                            <Settings className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">3. Delegate</p>
                            <p className="text-sm text-gray-500">HOD assigns to Staff</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-500 rounded-full p-2">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">4. Resolve</p>
                            <p className="text-sm text-gray-500">Staff resolves issue</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-orange-500 rounded-full p-2">
                            <Star className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">5. Feedback</p>
                            <p className="text-sm text-gray-500">Complainant rates resolution</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>User Roles & Permissions</CardTitle>
                    <CardDescription>Role-based access control</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-red-500 pl-4">
                        <p className="font-semibold">Admin</p>
                        <p className="text-sm text-gray-500">Full system access, user & department management</p>
                      </div>
                      <div className="border-l-4 border-purple-500 pl-4">
                        <p className="font-semibold">HOD (Department Head)</p>
                        <p className="text-sm text-gray-500">Department complaints, staff assignment, analytics</p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <p className="font-semibold">Staff</p>
                        <p className="text-sm text-gray-500">Assigned complaints, status updates, resolution</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4">
                        <p className="font-semibold">Complainant</p>
                        <p className="text-sm text-gray-500">Submit complaints, track status, provide feedback</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>Data Flow Diagram</CardTitle>
                    <CardDescription>Information flow across system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <p className="text-sm font-medium">Users</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <Building2 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                          <p className="text-sm font-medium">Departments</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <p className="text-sm font-medium">Complaints</p>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <div className="inline-block bg-white px-6 py-3 rounded-lg shadow-sm">
                          <MessageSquare className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                          <p className="text-sm font-medium">Notifications</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Manage Tab (Admin/HOD) */}
          {activeTab === 'manage' && (user.role === 'admin' || user.role === 'hod') && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Management</h2>
                <p className="text-gray-500">Manage departments, categories, and users</p>
              </div>

              <Tabs defaultValue="departments" className="w-full">
                <TabsList>
                  <TabsTrigger value="departments">Departments</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  {user.role === 'admin' && <TabsTrigger value="users">Users</TabsTrigger>}
                </TabsList>

                <TabsContent value="departments" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Departments</CardTitle>
                      <CardDescription>Manage organizational departments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {departments.map((dept) => (
                          <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <h4 className="font-medium">{dept.name}</h4>
                              <p className="text-sm text-gray-500">{dept.description}</p>
                            </div>
                            <Badge variant="outline">{dept.id}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Categories</CardTitle>
                      <CardDescription>Manage complaint categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {categories.map((cat) => {
                          const dept = departments.find(d => d.id === cat.departmentId);
                          return (
                            <div key={cat.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{cat.name}</h4>
                                <p className="text-sm text-gray-500">{dept?.name || 'Unknown Department'}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {user.role === 'admin' && (
                  <TabsContent value="users" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage system users</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {users.map((u) => (
                            <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{u.name}</h4>
                                <p className="text-sm text-gray-500">{u.email}</p>
                              </div>
                              <Badge className="capitalize">{u.role}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* New Complaint Dialog */}
      <Dialog open={showComplaintForm} onOpenChange={setShowComplaintForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit New Complaint</DialogTitle>
            <DialogDescription>Fill in the details of your complaint</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={complaintForm.title}
                onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about your complaint"
                rows={4}
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={complaintForm.categoryId}
                  onValueChange={(value) => setComplaintForm({ ...complaintForm, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const dept = departments.find(d => d.id === cat.departmentId);
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({dept?.name})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={complaintForm.priority}
                  onValueChange={(value) => setComplaintForm({ ...complaintForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowComplaintForm(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Complaint
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Complaint Detail Dialog */}
      <Dialog open={showComplaintDetail} onOpenChange={setShowComplaintDetail}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedComplaint.title}</span>
                  <div className="flex space-x-2">
                    <Badge className={getPriorityBadge(selectedComplaint.priority)}>
                      {selectedComplaint.priority}
                    </Badge>
                    <Badge className={getStatusBadge(selectedComplaint.status)}>
                      {selectedComplaint.status}
                    </Badge>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedComplaint.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{selectedComplaint.departmentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedComplaint.categoryName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted By</p>
                    <p className="font-medium">{selectedComplaint.complainantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted On</p>
                    <p className="font-medium">{new Date(selectedComplaint.submittedAt).toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedComplaint.resolutionNote && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2 text-green-600">Resolution</h4>
                      <p className="text-gray-600">{selectedComplaint.resolutionNote}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Resolved on {new Date(selectedComplaint.resolvedAt).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Actions based on role */}
                {(user.role === 'hod' || user.role === 'admin') && selectedComplaint.status === 'pending' && (
                  <div className="space-y-2">
                    <Label>Assign to Staff</Label>
                    <div className="flex space-x-2">
                      <Select onValueChange={(staffId) => handleAssignComplaint(selectedComplaint.id, staffId)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.filter(u => u.role === 'staff' && u.departmentId === selectedComplaint.departmentId).map(staff => (
                            <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {(user.role === 'staff' || user.role === 'hod' || user.role === 'admin') && 
                 (selectedComplaint.status === 'assigned' || selectedComplaint.status === 'in-progress') && (
                  <div className="space-y-4">
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Actions</h4>
                      {selectedComplaint.status === 'assigned' && (
                        <div className="space-y-3">
                          <Button 
                            onClick={() => {
                              handleUpdateStatus(selectedComplaint.id, 'in-progress', 'Started working on this complaint');
                              setShowComplaintDetail(false);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Start Working on This Complaint
                          </Button>
                        </div>
                      )}
                      {selectedComplaint.status === 'in-progress' && (
                        <div className="space-y-3">
                          <Label>Resolution Details</Label>
                          <Textarea
                            placeholder="Describe how the complaint was resolved..."
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                            rows={4}
                          />
                          <Button 
                            onClick={() => handleResolveComplaint(selectedComplaint.id, resolutionNote)}
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={!resolutionNote}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {user.role === 'complainant' && selectedComplaint.status === 'resolved' && !selectedComplaint.feedbackRating && (
                  <div className="space-y-4">
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-2">Provide Feedback</h4>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const comment = prompt('Any additional comments?');
                              handleFeedback(selectedComplaint.id, rating, comment || '');
                            }}
                          >
                            <Star className="h-4 w-4" /> {rating}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedComplaint.feedbackRating && (
                  <div>
                    <h4 className="font-semibold mb-2">Feedback</h4>
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < selectedComplaint.feedbackRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    {selectedComplaint.feedbackComment && (
                      <p className="text-gray-600 mt-2">{selectedComplaint.feedbackComment}</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
