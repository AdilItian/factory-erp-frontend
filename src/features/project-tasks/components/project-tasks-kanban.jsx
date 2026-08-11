'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { KanbanBoard } from '@/features/kanban/components/kanban-board';
import { getApiErrorMessage } from '@/lib/get-api-error-message';
import { useUpdateTaskMutation } from '../api/mutations';
import {
  useMyTasksSuspenseQuery,
  useProjectTasksSuspenseQuery
} from '../api/queries';
import { getTaskId } from '../utils/normalize-task';
import { groupApiTasksToKanbanColumns } from '../utils/map-tasks-to-kanban';
import { TaskDetailsSheet } from './task-details-sheet';

const BOARD_FILTERS = { page: 1, limit: 100 };

function TasksKanbanBoard({ tasks }) {
  const [columns, setColumns] = useState(() =>
    groupApiTasksToKanbanColumns(tasks)
  );
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selectedTaskId = selectedTask ? getTaskId(selectedTask) : null;

  useEffect(() => {
    setColumns(groupApiTasksToKanbanColumns(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!selectedTaskId) return;

    const nextTask = tasks.find((task) => getTaskId(task) === selectedTaskId);

    if (!nextTask) {
      setDetailsOpen(false);
      setSelectedTask(null);
      return;
    }

    setSelectedTask(nextTask);
  }, [tasks, selectedTaskId]);

  const { mutate: updateTask } = useUpdateTaskMutation({
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Failed to update task status'));
      setColumns(groupApiTasksToKanbanColumns(tasks));
    }
  });

  function handleTaskMoved(taskId, toColumn) {
    updateTask({
      taskId,
      payload: { status: toColumn }
    });
  }

  function handleTaskClick(kanbanTask) {
    const task = tasks.find((item) => getTaskId(item) === kanbanTask.id);
    if (!task) return;

    setSelectedTask(task);
    setDetailsOpen(true);
  }

  return (
    <>
      <KanbanBoard
        columns={columns}
        onColumnsChange={setColumns}
        onTaskMoved={handleTaskMoved}
        onTaskClick={handleTaskClick}
      />
      {detailsOpen && selectedTask ? (
        <TaskDetailsSheet
          task={selectedTask}
          open={detailsOpen}
          onOpenChange={(open) => {
            setDetailsOpen(open);
            if (!open) setSelectedTask(null);
          }}
        />
      ) : null}
    </>
  );
}

export function ProjectTasksKanban({ projectId }) {
  const { data } = useProjectTasksSuspenseQuery(projectId, BOARD_FILTERS);
  return <TasksKanbanBoard tasks={data?.tasks ?? []} />;
}

export function MyTasksKanban() {
  const { data } = useMyTasksSuspenseQuery(BOARD_FILTERS);
  return <TasksKanbanBoard tasks={data?.tasks ?? []} />;
}
