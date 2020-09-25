import React, {FunctionComponent, useEffect, useState} from "react";
import {DragDropContext, DropResult} from 'react-beautiful-dnd';
import {Column} from "./Column";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import AnnotationTask from "../../../../backend/model/AnnotationTask";
import AnnotationTaskState from "../../../../backend/model/AnnotationTaskState";
import FetchPending from "../../../components/FetchPending/FetchPending";

const connector = connect(
    (state: RootState) => ({
        annotationTasks: state.annotationTasks,
        annotationTaskStates: state.annotationTaskStates,
    }),
    (dispatch) => (bindActionCreators(ActionCreators, dispatch)));

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {}

export interface ColumnState {
    [name: string]: { title: string, taskIds: any[], state: AnnotationTaskState }
}

export interface TaskState {
    [id: string]: AnnotationTask
}


// const initialTasks = {
//     "task-0": {annotationTaskId: 0, name: "This is Task 0"},
//     "task-1": {annotationTaskId: 1, name: "Another Task 1"},
//     "task-2": {annotationTaskId: 2, name: "Task 2"},
//     "task-3": {annotationTaskId: 3, name: "Yet another Task 3"}
// }
// const initialColumns: ColumnState = {
//     "column-open": {title: "Open", taskIds: ["task-0", "task-1", "task-2",]},
//     "column-review": {title: "In Review", taskIds: []},
//     "column-closed": {title: "Closed", taskIds: ["task-3"]}
// }

const AnnotationTaskBoardDndArea: FunctionComponent<Props> = (props) => {
    const [tasks, setTasks] = useState<TaskState>();
    const [columns, setColumns] = useState<ColumnState>()


    const initializeColumns = () => {
        let columnState: ColumnState = {};
        let taskState: TaskState = {};

        let tasksByState = new Map<number, AnnotationTask[]>();
        for (const annotationTask of props.annotationTasks.items) {
            if (!tasksByState.has(annotationTask.annotationTaskStateId)) {
                tasksByState.set(annotationTask.annotationTaskStateId, [])
            }
            tasksByState.get(annotationTask.annotationTaskStateId).push(annotationTask as AnnotationTask);
            Object.assign(taskState, {[annotationTask.annotationTaskId.toString()]: annotationTask})
        }

        for (let key of tasksByState.keys()) {
            tasksByState.set(key, tasksByState.get(key).sort((l, r) => l.priority - r.priority));
        }

        for (const annotationTaskState of props.annotationTaskStates.items) {
            let taskIds = tasksByState.has(annotationTaskState.annotationTaskStateId) ? tasksByState.get(annotationTaskState.annotationTaskStateId).map(annotationTask => annotationTask.annotationTaskId.toString()) : []
            Object.assign(columnState, {
                [annotationTaskState.annotationTaskStateId.toString()]: {
                    title: annotationTaskState.name,
                    taskIds: taskIds,
                    state: annotationTaskState
                }
            })
        }

        setTasks(taskState)
        setColumns(columnState);
    }

    useEffect(() => {
        props.fetchAnnotationTasks()
        props.fetchAnnotationTaskStates();
    }, [])

    useEffect(initializeColumns, [props.annotationTaskStates, props.annotationTasks])


    const onDragEnd = (result: DropResult) => {
        const {destination, source, draggableId} = result;
        if (!destination)
            return;

        let isInteralMove = false;
        if (destination.droppableId === source.droppableId) {
            if (destination.index === source.index)
                return;
            isInteralMove = true;
        }

        let sourceColumn = columns[source.droppableId];
        let targetColumn = columns[destination.droppableId];


        // remove element from source column
        const newSourceTaskIds = Array.from(sourceColumn.taskIds);
        newSourceTaskIds.splice(source.index, 1);
        const newSourceColumn = {
            ...sourceColumn,
            taskIds: newSourceTaskIds
        }

        if (isInteralMove) {
            targetColumn = newSourceColumn
        }

        const newTargetTaskIds = Array.from(targetColumn.taskIds);
        newTargetTaskIds.splice(destination.index, 0, draggableId);

        const newTargetColumn = {
            ...targetColumn,
            taskIds: newTargetTaskIds
        }
        if (isInteralMove) {
            setColumns({
                ...columns,
                [destination.droppableId]: newTargetColumn
            })
        }

        setColumns({
            ...columns,
            [source.droppableId]: newSourceColumn,
            [destination.droppableId]: newTargetColumn
        })

        // update entities
        let changedAnnotationTask: AnnotationTask = AnnotationTask.create(tasks[draggableId]);
        changedAnnotationTask.priority = destination.index;
        changedAnnotationTask.annotationTaskStateId = columns[destination.droppableId].state.annotationTaskStateId

        props.saveAnnotationTask(changedAnnotationTask)
    }
    if (!columns)
        return null;
    return (

        <FetchPending isPending={props.annotationTasks.isFetching} subtle={false}>
            <DragDropContext onDragEnd={onDragEnd}>
                {
                    props.annotationTaskStates.items.map((annotationTaskState: AnnotationTaskState) => {
                            if(!annotationTaskState.visible)
                                return null;
                            const column = columns[annotationTaskState.annotationTaskStateId.toString()];
                            if (!column)
                                return null;
                            return (<Column id={annotationTaskState.annotationTaskStateId.toString()}
                                            key={annotationTaskState.annotationTaskStateId.toString()}
                                            title={column.title}
                                            color={annotationTaskState.color}
                                            tasks={column.taskIds.map(taskId => tasks[taskId])}
                            />)
                        }
                    )
                }
            </DragDropContext>
        </FetchPending>
    )
}

export default connector(AnnotationTaskBoardDndArea);
