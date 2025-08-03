import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditTask() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, updateTask } = useTasks();
  const { toast } = useToast();
  
  const [title, settitle] = useState('');
  const [body, setbody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const task = id ? getTask(id) : undefined;

  useEffect(() => {
    if (task) {
      settitle(task.title);
      setbody(task.body);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
            <Button onClick={() => navigate('/home')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tasks
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task name',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the task
      await updateTask(task.id, {
        title: title.trim(),
        body: body.trim(),
      });
      
      toast({
        title: 'Success',
        description: 'Task updated successfully!',
      });
      
      // Navigate to the home page (not login page)
      setTimeout(() => {
        window.location.replace('/home');
      }, 1000); // Small delay to show the success message
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
      console.error('Error updating task:', error);
      setIsSubmitting(false); // Only reset if there's an error
    }
    // Don't reset isSubmitting on success to prevent UI flash
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/home')} // Navigate to home instead
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Task</h1>
              <p className="text-muted-foreground">Update your task information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Task Details
              </CardTitle>
              <CardDescription>
                Modify the information below to update your task
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Task Name *</Label>
                  <Input
                    id="name"
                    value={title}
                    onChange={(e) => settitle(e.target.value)}
                    placeholder="Enter task name..."
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={body}
                    onChange={(e) => setbody(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full min-h-[120px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/home')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}