import type { Meta, StoryObj } from "@storybook/react-vite";
import classNames from "classnames";
import { useState } from "react";

import Body from "#src/components/Body";
import Card from "#src/components/Card";
import Title from "#src/components/Title";

import DragAndDrop from "./DragAndDrop";

type Task = {
  id: string;
  title: string;
  category: string | null;
};

/**
 * The DragAndDrop component provides a flexible and customizable interface
 * for building drag-and-drop interactions.
 * It manages drag state, supports multiple items and drop zones,
 * and allows customization for styling and behavior.
 */
const meta: Meta<typeof DragAndDrop> = {
  component: DragAndDrop,
};

export default meta;

type Story = StoryObj<typeof DragAndDrop>;

export const Primary: Story = {
  name: "DragAndDrop",
  args: { isDnDActive: true },
  render: (args) => {
    const tasks: Task[] = [
      { id: "task-1", title: "Design Homepage", category: null },
      { id: "task-2", title: "Fix Bugs", category: null },
      { id: "task-3", title: "Prepare Presentation", category: null },
    ];

    const categories = [
      { id: "category-1", title: "In Progress" },
      { id: "category-2", title: "Completed" },
    ];

    const [taskList, setTaskList] = useState<Task[]>(tasks);

    const isDropAllowed = (
      draggedId: string | null,
      droppedTargetId: string | null,
    ) => {
      return !!draggedId && !!droppedTargetId;
    };

    const handleDrop =
      (draggedId: string | null, droppedTargetId: string | null) => () => {
        if (!draggedId || !droppedTargetId) return;

        setTaskList((prevState) =>
          prevState.map((task) =>
            task.id === draggedId
              ? { ...task, category: droppedTargetId }
              : task,
          ),
        );
      };

    const onDragStart = (id: string) => () => {
      console.log(`Drag started: ${id}`);
    };

    const onDragEnd = (id: string) => () => {
      console.log(`Drag ended: ${id}`);
    };

    return (
      <DragAndDrop
        isDnDActive={args.isDnDActive}
        isDropAllowed={isDropAllowed}
        onDrop={handleDrop}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        className="flex flex-col gap-lg items-center"
      >
        <Title htmlVariant="h4">Organize Your Tasks</Title>

        <div className="flex flex-wrap gap-md">
          {taskList
            .filter((task) => !task.category)
            .map((task) => (
              <DragAndDrop.Item key={task.id} id={task.id}>
                {({ isDragged }) => (
                  <Card
                    tabIndex={0}
                    actionable={false}
                    padding="default"
                    className={classNames({
                      "opacity-md": isDragged,
                      "cursor-grab": args.isDnDActive,
                    })}
                  >
                    <Body htmlVariant="p">{task.title}</Body>
                  </Card>
                )}
              </DragAndDrop.Item>
            ))}
        </div>

        <div className="flex gap-md">
          {categories.map((category) => (
            <DragAndDrop.DropZone key={category.id} id={category.id}>
              {({ isHovered, isValidDropTarget }) => (
                <Card
                  actionable={false}
                  padding="default"
                  className={classNames(
                    "min-h-[100px] min-w-[200px] border-2",
                    { "bg-terra-green-200": isHovered && isValidDropTarget },
                  )}
                >
                  <Title htmlVariant="h5">{category.title}</Title>
                  <div className="flex flex-col gap-sm mt-md">
                    {taskList
                      .filter((task) => task.category === category.id)
                      .map((task) => (
                        <Card key={task.id} actionable={false} padding="sm">
                          <Body htmlVariant="p">{task.title}</Body>
                        </Card>
                      ))}
                  </div>
                </Card>
              )}
            </DragAndDrop.DropZone>
          ))}
        </div>
      </DragAndDrop>
    );
  },
};

export const AccessibleDragAndDrop: Story = {
  name: "AccessibleDragAndDrop",
  args: { isDnDActive: true },
  render: (args) => {
    const tasks: Task[] = [
      { id: "task-1", title: "Design Homepage", category: null },
      { id: "task-2", title: "Fix Bugs", category: null },
      { id: "task-3", title: "Prepare Presentation", category: null },
    ];

    const categories = [
      { id: "category-1", title: "In Progress" },
      { id: "category-2", title: "Completed" },
    ];

    const [taskList, setTaskList] = useState<Task[]>(tasks);
    const [draggedTask, setDraggedTask] = useState<string | null>(null);

    const isDropAllowed = (
      draggedId: string | null,
      droppedTargetId: string | null,
    ) => {
      return !!draggedId && !!droppedTargetId;
    };

    const handleDrop = (droppedTargetId: string | null) => () => {
      if (!draggedTask || !droppedTargetId) return;

      setTaskList((prevState) =>
        prevState.map((task) =>
          task.id === draggedTask
            ? { ...task, category: droppedTargetId }
            : task,
        ),
      );
      setDraggedTask(null); // Clear dragging state
    };

    const handleKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      taskId: string,
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setDraggedTask(draggedTask === taskId ? null : taskId);
        console.log(`Key pressed: ${event.key}, Dragging: ${taskId}`);
      }
    };

    const handleDropZoneKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
      dropZoneId: string,
    ) => {
      if ((event.key === "Enter" || event.key === " ") && draggedTask) {
        event.preventDefault();
        handleDrop(dropZoneId)();
      }
    };

    return (
      <DragAndDrop
        isDnDActive={args.isDnDActive}
        isDropAllowed={isDropAllowed}
        onDrop={(draggedId, droppedTargetId) => handleDrop(droppedTargetId)}
        className="flex flex-col gap-lg items-center"
      >
        <Title htmlVariant="h4">Accessible Drag and Drop</Title>
        <Body htmlVariant="p" className="text-center">
          Tab over the tasks and select one with space or enter. Then tab to the
          desired drop zone and drop your task with space or enter
        </Body>
        <div
          className="flex flex-wrap gap-md"
          role="listbox"
          aria-label="Tasks"
        >
          {taskList
            .filter((task) => !task.category)
            .map((task) => (
              <DragAndDrop.Item key={task.id} id={task.id}>
                {({ isDragged }) => (
                  <Card
                    role="option"
                    tabIndex={0}
                    actionable={false}
                    padding="default"
                    onKeyDown={(e) => handleKeyDown(e, task.id)}
                    className={classNames({
                      "opacity-": isDragged,
                    })}
                  >
                    <Body htmlVariant="p">{task.title}</Body>
                  </Card>
                )}
              </DragAndDrop.Item>
            ))}
        </div>

        <div className="flex gap-md" role="list" aria-label="Categories">
          {categories.map((category) => (
            <DragAndDrop.DropZone
              key={category.id}
              id={category.id}
              tabIndex={0}
              onKeyDown={(e) => handleDropZoneKeyDown(e, category.id)}
            >
              {({ isHovered, isValidDropTarget }) => (
                <Card
                  role="region"
                  tabIndex={0}
                  actionable={false}
                  padding="default"
                  className={classNames(
                    "min-h-[100px] min-w-[200px] border-2",
                    { "bg-terra-green-200": isHovered && isValidDropTarget },
                  )}
                >
                  <Title htmlVariant="h5">{category.title}</Title>
                  <div className="flex flex-col gap-sm mt-md">
                    {taskList
                      .filter((task) => task.category === category.id)
                      .map((task) => (
                        <Card key={task.id} actionable={false} padding="sm">
                          <Body htmlVariant="p">{task.title}</Body>
                        </Card>
                      ))}
                  </div>
                </Card>
              )}
            </DragAndDrop.DropZone>
          ))}
        </div>
      </DragAndDrop>
    );
  },
};
