
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, DollarSign, BookOpen, CheckSquare } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickAddModal = ({ isOpen, onClose, onSuccess }: QuickAddModalProps) => {
  const [activeTab, setActiveTab] = useState<'expense' | 'study' | 'todo'>('expense');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [expenseData, setExpenseData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [studyData, setStudyData] = useState({
    subject: '',
    hours: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [todoData, setTodoData] = useState({
    task: '',
    priority: 'medium',
    due_time: ''
  });

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          category: expenseData.category,
          amount: parseFloat(expenseData.amount),
          description: expenseData.description,
          date: expenseData.date,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Expense Added!",
        description: "Your expense has been recorded successfully.",
      });

      setExpenseData({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          subject: studyData.subject,
          hours: parseFloat(studyData.hours),
          date: studyData.date,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Study Session Added!",
        description: "Your study session has been recorded successfully.",
      });

      setStudyData({ subject: '', hours: '', date: new Date().toISOString().split('T')[0] });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add study session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTodoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('todos')
        .insert({
          task: todoData.task,
          priority: todoData.priority,
          due_time: todoData.due_time,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Task Added!",
        description: "Your task has been added to your todo list.",
      });

      setTodoData({ task: '', priority: 'medium', due_time: '' });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle className="text-xl font-bold">Quick Add</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {/* Tab Navigation */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Button
              variant={activeTab === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('expense')}
              className="text-xs"
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Expense
            </Button>
            <Button
              variant={activeTab === 'study' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('study')}
              className="text-xs"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Study
            </Button>
            <Button
              variant={activeTab === 'todo' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('todo')}
              className="text-xs"
            >
              <CheckSquare className="w-3 h-3 mr-1" />
              Todo
            </Button>
          </div>

          {/* Expense Form */}
          {activeTab === 'expense' && (
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={expenseData.category} onValueChange={(value) => setExpenseData({...expenseData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={expenseData.date}
                  onChange={(e) => setExpenseData({...expenseData, date: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Expense"}
              </Button>
            </form>
          )}

          {/* Study Form */}
          {activeTab === 'study' && (
            <form onSubmit={handleStudySubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter subject"
                  value={studyData.subject}
                  onChange={(e) => setStudyData({...studyData, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  placeholder="0.0"
                  value={studyData.hours}
                  onChange={(e) => setStudyData({...studyData, hours: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={studyData.date}
                  onChange={(e) => setStudyData({...studyData, date: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Study Session"}
              </Button>
            </form>
          )}

          {/* Todo Form */}
          {activeTab === 'todo' && (
            <form onSubmit={handleTodoSubmit} className="space-y-4">
              <div>
                <Label htmlFor="task">Task</Label>
                <Textarea
                  id="task"
                  placeholder="Enter your task"
                  value={todoData.task}
                  onChange={(e) => setTodoData({...todoData, task: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={todoData.priority} onValueChange={(value) => setTodoData({...todoData, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due_time">Due Time (Optional)</Label>
                <Input
                  id="due_time"
                  placeholder="e.g., 2:00 PM"
                  value={todoData.due_time}
                  onChange={(e) => setTodoData({...todoData, due_time: e.target.value})}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Adding..." : "Add Task"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickAddModal;
