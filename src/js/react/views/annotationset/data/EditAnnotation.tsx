import React, {FunctionComponent, useEffect, useState} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck, faPen, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";
import ColorPickerBadge from "../../../components/ColorPickerBadge/ColorPickerBadge";
import Annotation from "../../../../backend/model/Annotation";
import ConfirmationDialog from "../../../components/Dialog/ConfirmationDialog";
import FormErrorMessage from "../../../components/FormErrorMessage/FormErrorMessage";
import {ErrorMessage} from "@hookform/error-message";
import {useForm, Controller, useFormContext} from "react-hook-form";
import {FormGroup} from "react-bootstrap";
import chroma from "chroma-js";

const style = {
    annotation: {
        firstCol: {
            width: "10%"
        },
        secondCol: {
            width: "40%"
        },
        thirdCol: {
            width: "30%"
        },
        fourthCol: {
            width: "20%"
        }
    }
};

type Props = {
    annotations: Annotation[]
    onSave: (a: Annotation) => any,
    onDelete: (a: Annotation) => any,
    nestedForm?: boolean
};

type AnnotationForm = {
    name: string,
    color: string
}

export const EditAnnotation: FunctionComponent<Props> = (props) => {
    let methods = useForm<AnnotationForm>();
    const {register, handleSubmit, reset, errors, control} = methods

    const [editableAnnotation, setEditableAnnotation] = useState(undefined)
    const [deletableAnnotation, setDeletableAnnotation] = useState(undefined)

    const addNewAnnotation = () => {
        let annotation = Annotation.create()
        setEditableAnnotation(annotation);
        reset(annotation)
    }

    const isNewAnnotation = () => (editableAnnotation.annotationId <= 0)

    const onSubmit = (data : AnnotationForm) => {
        let annotation = Annotation.create({
            annotationId: editableAnnotation.annotationId,
            name: data.name,
            color: data.color
        } as Annotation)

        props.onSave(annotation)
        setEditableAnnotation(undefined)
        reset(Annotation.create())
    }

    const onClickEditAnnotation = (annotation: Annotation) => {
        setEditableAnnotation(annotation)
        reset(annotation)
    }

    const renderAnnotationsTable = () => {
        const renderEditableRow = () => (
            <tr key={editableAnnotation.annotationId || 0}>
                <th scope="row" style={style.annotation.firstCol}>
                    {editableAnnotation.annotationId || ""}
                </th>
                <td style={style.annotation.secondCol}>
                    <FormGroup className="mb-3">
                        <Form.Control type="text"
                                      placeholder="Name of the Annotation..."
                                      name="name"
                                      ref={register({required: true})}
                        />
                        <ErrorMessage errors={errors} name="name"
                                      message="A name is required."
                                      as={FormErrorMessage}/>
                    </FormGroup>
                </td>
                <td style={style.annotation.thirdCol}>
                    <Controller
                        id="colorPicker"
                        name="color"
                        control={control}
                        defaultValue="#000000"
                        render={({onChange, onBlur, value}) => (
                            <ColorPickerBadge updateColorCallback={onChange} color={value}/>
                        )}
                    />
                </td>
                <td style={style.annotation.fourthCol}>
                    <div className="float-right">
                        <Button size="sm"  id="editButton" className="d-none">
                            <FontAwesomeIcon icon={faPen}/>
                        </Button>
                        <Button size="sm" variant="danger" className="d-none">
                            <FontAwesomeIcon icon={faTrash}/>
                        </Button>
                        <Button size="sm" variant="success" type={props.nestedForm ? "button": "submit"} id="saveButton">
                            <FontAwesomeIcon icon={faCheck}/>
                        </Button>
                        <Button size="sm" variant="warning" onClick={() => setEditableAnnotation(undefined)}>
                            <FontAwesomeIcon icon={faBan}/>
                        </Button>
                    </div>
                </td>
            </tr>
        )

        const renderTableRows = () => {
            return props.annotations.map(annotation => {
                if(annotation === editableAnnotation)
                    return renderEditableRow();

                return <tr key={annotation.annotationId}>
                    <th scope="row" style={style.annotation.firstCol}>{annotation.annotationId}</th>
                    <td style={style.annotation.secondCol}>{annotation.name}</td>
                    <td style={style.annotation.thirdCol}>
                        <Badge className="text-monospace"
                               variant="info"
                               style={{
                                   backgroundColor: annotation.color,
                                   color: chroma(annotation.color).luminance() < 0.35 ? '#fff' : '#000'
                               }}>{annotation.color}
                        </Badge>
                    </td>
                    <td style={style.annotation.fourthCol}>
                        <div className="float-right">
                            <Button size="sm" onClick={() => onClickEditAnnotation(annotation)} id="editButton">
                                <FontAwesomeIcon icon={faPen}/>
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => setDeletableAnnotation(annotation)}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <Button size="sm" variant="success" type="submit" id="saveButton" className="d-none">
                                <FontAwesomeIcon icon={faCheck}/>
                            </Button>
                            <Button size="sm" variant="warning" onClick={() => setEditableAnnotation(undefined)} className="d-none">
                                <FontAwesomeIcon icon={faBan}/>
                            </Button>
                            <ConfirmationDialog
                                show={deletableAnnotation === annotation}
                                message={"Are you sure you want to delete the Annotation '" + annotation.name + "'?"}
                                onAccept={() => {
                                    props.onDelete(annotation);
                                    setDeletableAnnotation(undefined)
                                }}
                                onCancel={() => {
                                    setDeletableAnnotation(undefined)
                                }}
                                acceptText="Delete"
                                acceptVariant="danger"/>
                        </div>
                    </td>
                </tr>
            })
        };

        const table = (
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Color</th>
                        <th scope="col"/>
                    </tr>
                    </thead>
                    <tbody>
                    {renderTableRows()}
                    {editableAnnotation && isNewAnnotation() && renderEditableRow()}
                    </tbody>
                </table>
            </div>
        )

        if(props.nestedForm)
            return table;
        return (
            <Form onSubmit={handleSubmit(onSubmit)}>
                {table}
            </Form>
        )
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Row>
                        <Col>
                            <Card.Title>
                                Annotations
                            </Card.Title>
                        </Col>
                        <Col>
                            <Button size="sm" className="float-right" variant="outline-primary"
                                    onClick={addNewAnnotation}>
                                <FontAwesomeIcon icon={faPlus}/> Add
                            </Button>
                        </Col>
                    </Row>
                    {renderAnnotationsTable()}
                </Card.Body>
            </Card>
        </React.Fragment>
    );
}

export default EditAnnotation;
