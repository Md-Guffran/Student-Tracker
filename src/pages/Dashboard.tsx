import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, BookOpen, CheckCircle, TrendingUp, Plus, Calendar, Target, Coffee, LogOut } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import QuickAddModal from '@/components/QuickAddModal';

const Dashboard = () => {
  const [currentTime] = useState(new Date());
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [studySessions, setStudySessions] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const userName = user?.user_metadata?.full_name?.split(' ')[0] || "Student";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [expensesResult, studyResult, todosResult] = await Promise.all([
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('study_sessions').select('*').order('created_at', { ascending: false }),
        supabase.from('todos').select('*').order('created_at', { ascending: false })
      ]);

      if (expensesResult.data) setExpenses(expensesResult.data);
      if (studyResult.data) setStudySessions(studyResult.data);
      if (todosResult.data) setTodos(todosResult.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTodoStatus = async (todoId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    try {
      const { error } = await supabase
        .from('todos')
        .update({ status: newStatus })
        .eq('id', todoId);

      if (error) throw error;

      setTodos(todos.map(todo => 
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      ));

      toast({
        title: "Task Updated",
        description: `Task marked as ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  // Calculate data for charts
  const expenseData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += parseFloat(expense.amount);
    } else {
      acc.push({
        name: expense.category,
        value: parseFloat(expense.amount),
        color: getColorForCategory(expense.category)
      });
    }
    return acc;
  }, []);

  const weeklyStudyData = getWeeklyStudyData(studySessions);

  const totalExpenses = expenseData.reduce((sum, item) => sum + item.value, 0);
  const totalStudyHours = studySessions.reduce((sum, session) => sum + parseFloat(session.hours), 0);
  const completedTodos = todos.filter(todo => todo.status === 'completed').length;
  const totalTodos = todos.length;

  function getColorForCategory(category: string) {
    const colors = {
      'Food': '#3B82F6',
      'Transport': '#10B981',
      'Books': '#F59E0B',
      'Entertainment': '#EF4444',
      'Miscellaneous': '#8B5CF6'
    };
    return colors[category] || '#6B7280';
  }

  function getWeeklyStudyData(sessions: any[]) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekData = days.map(day => ({ day, hours: 0 }));
    
    sessions.forEach(session => {
      const date = new Date(session.date);
      const dayIndex = (date.getDay() + 6) % 7; // Convert to Mon=0, Tue=1, etc.
      weekData[dayIndex].hours += parseFloat(session.hours);
    });
    
    return weekData;
  }

  const motivationalQuotes = [
    'The only way to do great work is to love what you do. – Steve Jobs',
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
    "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
    "Don't wish it were easier, wish you were better. – Jim Rohn",
    "The expert in anything was once a beginner. – Helen Hayes",
    "Patience, persistence and perspiration make an unbeatable combination for success. – Napoleon Hill",
    "You are capable of more than you know. – Unknown",
    "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
    "Strive for progress, not perfection. – Unknown",
    "It always seems impossible until it's done. – Nelson Mandela",
    "The mind is everything. What you think you become. – Buddha",
    "Hard work beats talent when talent doesn't work hard. – Tim Notke",
    "Your time is limited, don't waste it living someone else's life. – Steve Jobs",
    "Failure is the opportunity to begin again more intelligently. – Henry Ford",
    "The best way to predict the future is to create it. – Peter Drucker",
    "Setting goals is the first step in turning the invisible into the visible. – Tony Robbins",
    "The only limit to our realization of tomorrow will be our doubts of today. – Franklin D. Roosevelt",
    "Do not wait to strike till the iron is hot; but make it hot by striking. – William Butler Yeats",
    "Genius is one percent inspiration and ninety-nine percent perspiration. – Thomas Edison",
    "The only place where success comes before work is in the dictionary. – Vidal Sassoon",
    "Go confidently in the direction of your dreams! Live the life you've imagined. – Henry David Thoreau",
    "You don't have to be great to start, but you have to start to be great. – Zig Ziglar",
    "Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time. – Thomas A. Edison",
    "The roots of education are bitter, but the fruit is sweet. – Aristotle",
    "Push yourself, because no one else is going to do it for you. – Unknown",
    "Success is the sum of small efforts, repeated day in and day out. – Robert Collier",
    "Don't stop when you're tired. Stop when you're done. – Unknown",
    "The difference between ordinary and extraordinary is that little extra. – Jimmy Johnson",
    "Study while others are sleeping; work while others are loitering; prepare while others are playing; and dream while others are wishing. – William Arthur Ward",
    "You miss 100% of the shots you don't take. – Wayne Gretzky",
    "It does not matter how slowly you go as long as you do not stop. – Confucius",
    "Great things never come from comfort zones. – Unknown",
    "To accomplish great things, we must not only act, but also dream; not only plan, but also believe. – Anatole France",
    "The future depends on what you do today. – Mahatma Gandhi",
    "If you are not willing to learn, no one can help you. If you are determined to learn, no one can stop you. – Unknown",
    "The expert was once a beginner who kept going. – Unknown",
    "Focus on being productive instead of busy. – Tim Ferriss",
    "Challenges are what make life interesting and overcoming them is what makes life meaningful. – Joshua J. Marine",
    "Motivation is what gets you started. Habit is what keeps you going. – Jim Ryun",
    "Learn from yesterday, live for today, hope for tomorrow. – Albert Einstein",
    "Success is walking from failure to failure with no loss of enthusiasm. – Winston Churchill",
    "The best way to gain self-confidence is to do what you are afraid to do. – Unknown",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. – Christian D. Larson",
    "It's not about perfect. It's about effort. And when you bring that effort every single day, that's where transformation happens. – Jillian Michaels",
    "Your education is a dress rehearsal for a life that is yours to lead. – Nora Ephron",
    "Work hard in silence, let your success be your noise. – Frank Ocean",
    "The journey of a thousand miles begins with a single step. – Lao Tzu",
    "Stay curious. Keep learning. Keep growing. – Unknown"
  ];

  const todaysQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editExpenseData, setEditExpenseData] = useState<any>({});
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoData, setEditTodoData] = useState<any>({});
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editSessionData, setEditSessionData] = useState<any>({});

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
      if (error) throw error;
      setExpenses(expenses.filter(exp => exp.id !== expenseId));
      toast({ title: "Deleted", description: "Expense deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete expense.", variant: "destructive" });
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpenseId(expense.id);
    setEditExpenseData({ ...expense });
  };

  const handleSaveExpense = async () => {
    try {
      const { error } = await supabase.from('expenses').update(editExpenseData).eq('id', editingExpenseId);
      if (error) throw error;
      setExpenses(expenses.map(exp => exp.id === editingExpenseId ? { ...editExpenseData } : exp));
      setEditingExpenseId(null);
      toast({ title: "Updated", description: "Expense updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update expense.", variant: "destructive" });
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', todoId);
      if (error) throw error;
      setTodos(todos.filter(todo => todo.id !== todoId));
      toast({ title: "Deleted", description: "Task deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete task.", variant: "destructive" });
    }
  };

  const handleEditTodo = (todo: any) => {
    setEditingTodoId(todo.id);
    setEditTodoData({ ...todo });
  };

  const handleSaveTodo = async () => {
    try {
      const { error } = await supabase.from('todos').update(editTodoData).eq('id', editingTodoId);
      if (error) throw error;
      setTodos(todos.map(todo => todo.id === editingTodoId ? { ...editTodoData } : todo));
      setEditingTodoId(null);
      toast({ title: "Updated", description: "Task updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update task.", variant: "destructive" });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase.from('study_sessions').delete().eq('id', sessionId);
      if (error) throw error;
      setStudySessions(studySessions.filter(session => session.id !== sessionId));
      toast({ title: "Deleted", description: "Study session deleted." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete study session.", variant: "destructive" });
    }
  };

  const handleEditSession = (session: any) => {
    setEditingSessionId(session.id);
    setEditSessionData({ ...session });
  };

  const handleSaveSession = async () => {
    try {
      const { error } = await supabase.from('study_sessions').update(editSessionData).eq('id', editingSessionId);
      if (error) throw error;
      setStudySessions(studySessions.map(session => session.id === editingSessionId ? { ...editSessionData } : session));
      setEditingSessionId(null);
      toast({ title: "Updated", description: "Study session updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update study session.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Student Tracker
                </h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => setIsQuickAddOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {getGreeting()}, {userName}! 👋
                </h2>
                <p className="text-blue-100 mb-4">
                  {formatDate(currentTime)}
                </p>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-2">
                    <Coffee className="w-5 h-5" />
                    <span className="font-medium">Daily Motivation</span>
                  </div>
                  <p className="text-sm italic">"{todaysQuote}"</p>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-16 h-16" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total spent</p>
              <Progress value={Math.min((totalExpenses / 2000) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalStudyHours.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground">Total logged</p>
              <Progress value={Math.min((totalStudyHours / 40) * 100, 100)} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{completedTodos}/{totalTodos}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <Progress value={totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Task completion</p>
              <Progress value={totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expense Breakdown */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <span>Expense Breakdown</span>
              </CardTitle>
              <CardDescription>Your spending categories</CardDescription>
            </CardHeader>
            <CardContent>
              {expenseData.length > 0 ? (
                <>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {expenseData.map((item, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}: ₹{item.value.toFixed(2)}</span>
                      </Badge>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p>No expenses recorded yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsQuickAddOpen(true)}
                    >
                      Add your first expense
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Study Hours */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Weekly Study Hours</span>
              </CardTitle>
              <CardDescription>Your study pattern this week</CardDescription>
            </CardHeader>
            <CardContent>
              {studySessions.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyStudyData}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} hours`, 'Study Time']} />
                      <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <p>No study sessions recorded yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsQuickAddOpen(true)}
                    >
                      Log your first study session
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Your latest spending activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.slice(0, 4).map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        {editingExpenseId === expense.id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={editExpenseData.description}
                              onChange={e => setEditExpenseData({ ...editExpenseData, description: e.target.value })}
                              placeholder="Description"
                            />
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              type="number"
                              value={editExpenseData.amount}
                              onChange={e => setEditExpenseData({ ...editExpenseData, amount: e.target.value })}
                              placeholder="Amount"
                            />
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" onClick={handleSaveExpense}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingExpenseId(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">{expense.description || expense.category}</p>
                            <p className="text-sm text-gray-600">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-red-600">-₹{parseFloat(expense.amount).toFixed(2)}</span>
                      {editingExpenseId !== expense.id && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEditExpense(expense)}>Adjust</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteExpense(expense.id)}>Delete</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {expenses.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No expenses recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Your todo list</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todos.slice(0, 4).map((todo) => (
                  <div key={todo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleTodoStatus(todo.id, todo.status)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          todo.status === 'completed' ? 'bg-green-100' : 'bg-orange-100'
                        }`}
                      >
                        <CheckCircle className={`w-5 h-5 ${
                          todo.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      </button>
                      <div>
                        {editingTodoId === todo.id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={editTodoData.task}
                              onChange={e => setEditTodoData({ ...editTodoData, task: e.target.value })}
                              placeholder="Task"
                            />
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={editTodoData.due_time}
                              onChange={e => setEditTodoData({ ...editTodoData, due_time: e.target.value })}
                              placeholder="Due Time"
                            />
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" onClick={handleSaveTodo}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingTodoId(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className={`font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                              {todo.task}
                            </p>
                            <p className="text-sm text-gray-600">
                              {todo.due_time && `Due: ${todo.due_time}`}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        todo.priority === 'high' ? 'destructive' : 
                        todo.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {todo.priority}
                      </Badge>
                      {editingTodoId !== todo.id && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEditTodo(todo)}>Adjust</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteTodo(todo.id)}>Delete</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {todos.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No tasks created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Study Sessions List */}
        <div className="mt-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Recent Study Sessions</CardTitle>
              <CardDescription>Your latest study activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studySessions.slice(0, 4).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        {editingSessionId === session.id ? (
                          <div className="flex flex-col gap-1">
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              value={editSessionData.subject}
                              onChange={e => setEditSessionData({ ...editSessionData, subject: e.target.value })}
                              placeholder="Subject"
                            />
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              type="number"
                              value={editSessionData.hours}
                              onChange={e => setEditSessionData({ ...editSessionData, hours: e.target.value })}
                              placeholder="Hours"
                            />
                            <input
                              className="border rounded px-2 py-1 text-sm"
                              type="date"
                              value={editSessionData.date ? editSessionData.date.slice(0, 10) : ""}
                              onChange={e => setEditSessionData({ ...editSessionData, date: e.target.value })}
                              placeholder="Date"
                            />
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" onClick={handleSaveSession}>Save</Button>
                              <Button size="sm" variant="outline" onClick={() => setEditingSessionId(null)}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">{session.subject || "Study Session"}</p>
                            <p className="text-sm text-gray-600">
                              {parseFloat(session.hours).toFixed(1)}h • {session.date ? new Date(session.date).toLocaleDateString() : ""}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingSessionId !== session.id && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleEditSession(session)}>Adjust</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteSession(session.id)}>Delete</Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {studySessions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No study sessions recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <QuickAddModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={fetchAllData}
      />
    </div>
  );
};

export default Dashboard;
