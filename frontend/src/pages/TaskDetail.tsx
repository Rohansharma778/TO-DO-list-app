import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/contexts/TaskContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, updateTask, deleteTask } = useTasks();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get task directly from context tasks array - this will auto-update when context changes
  const task = id ? tasks.find(t => t.id === id) : undefined;

  // Debug logging
  console.log('🔍 TaskDetail Debug:', {
    taskId: id,
    totalTasks: tasks.length,
    taskTitle: task?.title,
    taskCompleted: task?.completed,
    allTaskIds: tasks.map(t => ({ id: t.id, completed: t.completed }))
  });

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

  const handleToggleComplete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      console.log('🔄 Toggling task completion:', { 
        taskId: task.id, 
        currentStatus: task.completed,
        newStatus: !task.completed,
        taskTitle: task.title
      });

      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      
      console.log('✅ Task updated successfully:', {
        id: updatedTask.id,
        title: updatedTask.title,
        completed: updatedTask.completed
      });
      
      toast({
        title: 'Success',
        description: task.completed 
          ? 'Task marked as pending' 
          : 'Task completed! Great job on completing the task.',
      });
    } catch (error) {
      console.error('❌ Error toggling task completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
      navigate('/home');
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task. Please try again.',
        variant: 'destructive',
      });
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/home')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Task Details</h1>
              <p className="text-muted-foreground">View and manage your task</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Task Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{task.title}</CardTitle>
                    <Badge 
                      variant={task.completed ? "default" : "secondary"}
                      className={task.completed ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {task.body || 'No description provided'}
                  </p>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(task.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Actions
                </CardTitle>
                <CardDescription>
                  Manage this task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleToggleComplete}
                  disabled={isUpdating}
                  className={`w-full ${
                    task.completed 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {task.completed ? 'Marking as Pending...' : 'Marking Complete...'}
                    </>
                  ) : (
                    <>
                      {task.completed ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Mark as Pending
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigate(`/edit/${task.id}`)}
                  className="w-full"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Task
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full"
                >
                  {isDeleting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Task
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}