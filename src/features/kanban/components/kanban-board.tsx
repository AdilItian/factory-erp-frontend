'use client';

import { useCallback, useRef } from 'react';
import { Kanban, KanbanBoard as KanbanBoardPrimitive, KanbanOverlay } from '@/components/ui/kanban';
import { cn } from '@/lib/utils';
import { useTaskStore, type Task } from '../utils/store';
import { useBoardPan } from '../hooks/use-board-pan';
import { createRestrictToContainer } from '../utils/restrict-to-container';
import { BoardPanTip } from './board-pan-tip';
import { TaskColumn } from './board-column';
import { TaskCard } from './task-card';

type KanbanColumns = Record<string, Task[]>;

type KanbanBoardProps = {
  columns?: KanbanColumns;
  onColumnsChange?: (columns: KanbanColumns) => void;
  onTaskMoved?: (taskId: string, toColumn: string, fromColumn: string) => void;
  onTaskClick?: (task: Task) => void;
  showPanTip?: boolean;
};

function findTaskColumn(columns: KanbanColumns, taskId: string) {
  for (const [columnId, tasks] of Object.entries(columns)) {
    if (tasks.some((task) => task.id === taskId)) {
      return columnId;
    }
  }
  return null;
}

function getMovedTasks(fromColumns: KanbanColumns, toColumns: KanbanColumns) {
  const moved: Array<{
    taskId: string;
    fromColumn: string;
    toColumn: string;
  }> = [];
  const taskIds = new Set(
    Object.values(fromColumns)
      .flat()
      .map((task) => task.id)
  );

  for (const taskId of taskIds) {
    const fromColumn = findTaskColumn(fromColumns, taskId);
    const toColumn = findTaskColumn(toColumns, taskId);

    if (fromColumn && toColumn && fromColumn !== toColumn) {
      moved.push({ taskId, fromColumn, toColumn });
    }
  }

  return moved;
}

export function KanbanBoard({
  columns: controlledColumns,
  onColumnsChange,
  onTaskMoved,
  onTaskClick,
  showPanTip = true
}: KanbanBoardProps) {
  const store = useTaskStore();
  const columns = controlledColumns ?? store.columns;
  const setColumns = onColumnsChange ?? store.setColumns;
  const columnsRef = useRef(columns);
  const dragStartColumnsRef = useRef<KanbanColumns | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { panRef, isPanning } = useBoardPan();

  columnsRef.current = columns;

  // eslint-disable-next-line react-hooks/exhaustive-deps -- factory function, stable after mount
  const restrictToBoard = useCallback(
    createRestrictToContainer(() => containerRef.current),
    []
  );

  function handleColumnsChange(nextColumns: KanbanColumns) {
    columnsRef.current = nextColumns;
    setColumns(nextColumns);
  }

  function handleDragStart() {
    dragStartColumnsRef.current = columnsRef.current;
  }

  function handleDragEnd() {
    const startColumns = dragStartColumnsRef.current;
    dragStartColumnsRef.current = null;

    if (!startColumns || !onTaskMoved) return;

    for (const move of getMovedTasks(startColumns, columnsRef.current)) {
      onTaskMoved(move.taskId, move.toColumn, move.fromColumn);
    }
  }

  function handleDragCancel() {
    const startColumns = dragStartColumnsRef.current;
    dragStartColumnsRef.current = null;

    if (startColumns) {
      columnsRef.current = startColumns;
      setColumns(startColumns);
    }
  }

  return (
    <div ref={containerRef} className='w-full min-w-0 max-w-full'>
      {showPanTip ? <BoardPanTip /> : null}

      <Kanban
        value={columns}
        onValueChange={handleColumnsChange}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        getItemValue={(item) => item.id}
        modifiers={[restrictToBoard]}
        autoScroll={false}
      >
        <div
          ref={panRef}
          className={cn(
            'w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-2',
            '[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
            isPanning && 'cursor-grabbing select-none'
          )}
        >
          <KanbanBoardPrimitive className='flex w-max min-w-full flex-row items-stretch gap-4'>
            {Object.entries(columns).map(([columnValue, tasks]) => (
              <TaskColumn
                key={columnValue}
                value={columnValue}
                tasks={tasks}
                onTaskClick={onTaskClick}
              />
            ))}
          </KanbanBoardPrimitive>
        </div>

        <KanbanOverlay>
          {({ value, variant }) => {
            if (variant === 'column') {
              const tasks = columns[value] ?? [];
              return <TaskColumn value={value} tasks={tasks} />;
            }

            const task = Object.values(columns)
              .flat()
              .find((item) => item.id === value);

            if (!task) return null;
            return <TaskCard task={task} />;
          }}
        </KanbanOverlay>
      </Kanban>
    </div>
  );
}
