import { Task } from '@/contexts/TaskContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const navigate = useNavigate();
  

  // Safe date formatting
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'No date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'No date';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={() => navigate(`/task/${task.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">{task.title}</CardTitle>
          <div className="flex items-center gap-2">
            {task.completed ? (
              <Badge variant="default" className="bg-task-complete text-white">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-task-pending text-background">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2 mb-3">
          {task.body || 'No description provided'}
        </CardDescription>
        <p className="text-xs text-muted-foreground">
          Created: {formatDate(task.createdAt)}
        </p>
      </CardContent>
    </Card>
  );
}