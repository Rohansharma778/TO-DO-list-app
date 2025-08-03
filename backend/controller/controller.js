import Task from '../model/task.js'

export const SignUp = (req, res) => {
  res.redirect('http://localhost:8080/');
};

export const Edit = async (req, res) => {
  console.log('✏️ EDIT TASK - Starting');

  try {
    const taskId = req.params.id;
    const { title, body, status, completed } = req.body;
    const userId = req.session.user?._id || req.user?._id;

    console.log('📋 Edit data:', { taskId, title, body, status, completed, userId });

    // Validate
    if (!taskId) {
      console.log('❌ No task ID provided');
      return res.status(400).json({ message: 'Task ID is required' });
    }

    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Prepare update data - only include fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (body !== undefined) updateData.body = body;
    if (status !== undefined) updateData.status = status;
    if (completed !== undefined) updateData.completed = completed;

    console.log('🔄 Update data:', updateData);

    // Find and update task (only if it belongs to the user)
    console.log('🔍 Finding task to update...');
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      console.log('❌ Task not found or not authorized');
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    console.log('✅ Task updated successfully:', updatedTask._id);

    // Send response
    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask  // ← Change 'updatedTask' to 'task'
    });


  } catch (error) {
    console.error('❌ Edit task error:', error.message);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

export const removetask = async (req, res) => {
  console.log('🗑️ DELETE TASK - Starting');

  try {
    const taskId = req.params.id;
    const userId = req.session.user?._id || req.user?._id;

    console.log('📋 Delete data:', { taskId, userId });

    // Validate
    if (!taskId) {
      console.log('❌ No task ID provided');
      return res.status(400).json({ message: 'Task ID is required' });
    }

    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Find and delete task (only if it belongs to the user)
    console.log('🔍 Finding task to delete...');
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      user: userId
    });

    if (!deletedTask) {
      console.log('❌ Task not found or not authorized');
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    console.log('✅ Task deleted successfully:', deletedTask._id);

    // Send response
    res.status(200).json({
      message: 'Task deleted successfully',
      deletedTask: deletedTask
    });

  } catch (error) {
    console.error('❌ Delete task error:', error.message);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

export const taskDetail = (req, res) => {
  const id = req.params.id;
  res.redirect(`http://localhost:8080/task/${id}`);
};

export const Home = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

export const Add = async (req, res) => {
  console.log('➕ ADD TASK - Starting');

  try {
    // Extract data
    const { title, body, status } = req.body;
    const userId = req.session.user?._id || req.user?._id;

    console.log('📋 Data received:', { title, body, status, userId });

    // Validate
    if (!title) {
      console.log('❌ No title provided');
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Create and save task
    console.log('📝 Creating task...');
    const task = new Task({
      title: title.trim(),
      body: body || status || 'No description provided',
      user: userId,
      status: status || 'Uncompleted'
    });

    const savedTask = await task.save();
    console.log('✅ Task saved with ID:', savedTask._id);

    // Send response
    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask  // ← Change 'savedTask' to 'task'
    });

  } catch (error) {
    console.error('❌ Add task error:', error.message);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

// Add this to your backend routes
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.session.user?._id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Return the current user data from session
    const currentUser = req.session.user || req.user;
    
    res.status(200).json(currentUser);
  } catch (error) {
    console.error('❌ Get current user error:', error.message);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};