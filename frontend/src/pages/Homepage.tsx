import { useTasks } from '@/contexts/TaskContext';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Plus,ListTodo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '@/components/TaskCard';

function Homepage() {
  const { tasks } = useTasks();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Tasks</h2>
              <p className="text-muted-foreground">
                Manage your tasks efficiently and stay organized
              </p>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first task to get started with organizing your work.
              </p>
              <Button onClick={() => navigate('/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Task
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Homepage;