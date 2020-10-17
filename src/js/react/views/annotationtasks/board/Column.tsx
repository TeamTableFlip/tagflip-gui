import React, {FunctionComponent} from "react";
import {Droppable} from 'react-beautiful-dnd';
import {Card} from "react-bootstrap";
import Task from "./Task";
import * as chroma from "chroma-js";
import {byGroup} from "@codemirror/next/view/dist/cursor";

interface Props {
    id: string
    color?: string
    title: string
    tasks: any[]
}

export const Column: FunctionComponent<Props> = (props) => {

    return (
        <Card className="h-100">
            <Card.Header style={{
                borderColor: props.color ? props.color : undefined
            }}>
                {props.title}
            </Card.Header>
            <Card.Body className={`p-0 w-100 h-100`}>
                <Droppable droppableId={props.id}>
                    {
                        (provided, snapshot) => (
                            <div
                                className={`w-100 h-100 column`}
                                style={{
                                    backgroundColor: props.color && snapshot.isDraggingOver ? chroma.hex(props.color).brighten(1.8).desaturate(1.2).hex() : undefined,
                                    transition: "0.7s"
                                }}
                                ref={provided.innerRef}
                                {...provided.droppableProps}>
                                {
                                    props.tasks.map((task, index) =>
                                        <Task key={task.annotationTaskId}
                                              task={task}
                                              index={index}/>
                                    )
                                }
                                {provided.placeholder}
                            </div>

                        )
                    }
                </Droppable>
            </Card.Body>

        </Card>
    )
}
