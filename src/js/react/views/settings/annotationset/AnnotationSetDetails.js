import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrash, faCheck, faBan} from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";
import InputGroup from "react-bootstrap/InputGroup";
import ColorPickerBadge from "../../../components/colorPickerBadge/ColorPickerBadge";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import FetchPending from "../../../components/FetchPending";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";

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

class AnnotationSetDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validatedBasicInfo: false,
            validatedAnnotation: false,
            createNewAnnotation: false,
            editAnnotation: false,
            annotationIdToBeDeleted: undefined,
        };
        this._saveAnnotationSet = this._saveAnnotationSet.bind(this);
        this._addNewAnnotation = this._addNewAnnotation.bind(this);
        this._renderAnnotationsTable = this._renderAnnotationsTable.bind(this);
        this._saveAnnotation = this._saveAnnotation.bind(this);
        this._abortEditAnnotationSet = this._abortEditAnnotationSet.bind(this);
    }

    componentDidMount() {
        this.props.fetchAnnotations();
    }

    _saveAnnotationSet(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validatedBasicInfo: false})
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validatedBasicInfo: true});
        } else {
            this.props.saveAnnotationSet();
        }
    }

    _addNewAnnotation() {
        this.setState({
            createNewAnnotation: true,
            editAnnotation: false
        });
        let newAnnotation = this.props.emptyAnnotation;
        newAnnotation.s_id = this.props.annotationSet.data.values.s_id;
        this.props.setEditableAnnotation(newAnnotation);
    }

    _saveAnnotation() {
        let annotation = this.props.annotationSet.annotations.editableAnnotation.values;
        if(annotation.name && annotation.name.length > 0) {
            this.setState({
                validatedAnnotation: false,
                createNewAnnotation: false,
                editAnnotation: false,
                isChangeRequest: true
            });
            this.props.saveAnnotation();
        }
        else {
            this.setState({
                validatedAnnotation: true
            });
        }
    }

    _onClickEditAnnotation(annotation) {
        this.props.setEditableAnnotation(annotation);
        this.setState({
            editAnnotation: true,
            createNewAnnotation: false
        });
    }

    _renderAnnotationsTable() {
        let renderEditAnnotation = () => {
            return <tr key={this.props.annotationSet.annotations.editableAnnotation.values.a_id || 0}>
                <th scope="row" style={style.annotation.firstCol}>{this.props.annotationSet.annotations.editableAnnotation.values.a_id || ""}</th>
                <td style={style.annotation.secondCol}>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" placeholder="Name of the Annotation" required={true}
                                      onChange={e => {this.props.updateAnnotationField('name', e.target.value)}}
                                      value={this.props.annotationSet.annotations.editableAnnotation.values.name || ""}/>
                        <Form.Control.Feedback type="invalid">
                            Please choose a name.
                        </Form.Control.Feedback>
                    </InputGroup>
                </td>
                <td style={style.annotation.thirdCol}>
                    <ColorPickerBadge
                        updateColorCallback={color => {this.props.updateAnnotationField('color', color)}}
                        color={!this._isNewAnnotation() ? this.props.annotationSet.annotations.editableAnnotation.values.color : undefined}
                    />
                </td>
                <td style={style.annotation.fourthCol}>
                    <div className="float-right">
                        <Button size="sm" variant="success" onClick={e => this._saveAnnotation()}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </Button>
                        <Button size="sm" variant="warning" onClick={e => {
                            this.setState({
                                createNewAnnotation: false,
                                editAnnotation: false
                            })
                        }}>
                            <FontAwesomeIcon icon={faBan}/>
                        </Button>
                    </div>
                </td>
            </tr>
        };

        let renderTableData = () => {
            return this.props.annotationSet.annotations.items.map(annotation => {
                if(this.state.editAnnotation && annotation.a_id === this.props.annotationSet.annotations.editableAnnotation.values.a_id) {
                    return renderEditAnnotation();
                }

                return <tr key={annotation.a_id}>
                        <th scope="row" style={style.annotation.firstCol}>{annotation.a_id}</th>
                        <td style={style.annotation.secondCol}>{annotation.name}</td>
                        <td style={style.annotation.thirdCol}><Badge className="text-monospace" variant="info" style={{backgroundColor: annotation.color}}>{annotation.color}</Badge></td>
                        <td style={style.annotation.fourthCol}>
                        <div className="float-right">
                            <Button size="sm" onClick={e => this._onClickEditAnnotation(annotation)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </Button>
                            <Button size="sm" variant="danger" onClick={e => {
                                this.setState({
                                    annotationIdToBeDeleted: annotation.a_id
                                });
                            }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <ConfirmationDialog
                                show={this.state.annotationIdToBeDeleted === annotation.a_id}
                                message={"Are you sure you want to delete the Annotation '" + annotation.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteAnnotation(annotation.a_id);
                                    this.setState({
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                acceptText="Delete"
                                acceptVariant="danger" />
                        </div>
                    </td>
                </tr>
            })
        };

        return <FetchPending
            isPending={this.props.annotationSet.annotations.isFetching}
            success={this.props.annotationSet.annotations.status === fetchStatusType.success}
            retryCallback={() => {
                this.props.fetchAnnotations();
            }}
        >
            <Form noValidate validated={this.state.validatedAnnotation}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Color</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableData()}
                        {this.state.createNewAnnotation && renderEditAnnotation()}
                        </tbody>
                    </table>
                </div>
            </Form>
        </FetchPending>
    }

    _isNewAnnotationSet() {
        return this.props.annotationSet.data.values.s_id <= 0;
    }

    _isNewAnnotation() {
        return this.props.annotationSet.annotations.editableAnnotation.values.a_id <= 0;
    }

    _abortEditAnnotationSet() {
        this.setState({
            validatedBasicInfo: false
        });
        this.props.reloadAnnotationSet();
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Annotation Set ({!this._isNewAnnotationSet() ? ("ID: " + this.props.annotationSet.data.values.s_id) : "New"})</h2>
                <Form noValidate validated={this.state.validatedBasicInfo} onSubmit={this._saveAnnotationSet}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Basic Information
                            </Card.Title>
                            <FetchPending
                                isPending={this.props.annotationSet.data.isFetching}
                                success={this.props.annotationSet.data.status === fetchStatusType.success}
                                retryCallback={this.props.reloadAnnotationSet}
                            >
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the Annotation Set"
                                                  value={this.props.annotationSet.data.values.name || ''}
                                                  onChange={e => {this.props.updateAnnotationSetField('name', e.target.value)}}
                                                  name='name' required={true} />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the Annotation Set"
                                                  name='description'
                                                  onChange={e => {this.props.updateAnnotationSetField('description', e.target.value)}}
                                                  value={this.props.annotationSet.data.values.description || ''} />
                                </Form.Group>
                                <div className="mt-3">
                                    <Button variant="success" className="mr-1" type="submit">Save</Button>
                                    { !this._isNewAnnotationSet() &&
                                        <Button variant="danger"
                                                onClick={e => this._abortEditAnnotationSet()}>Abort</Button>
                                    }
                                </div>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
                { !this._isNewAnnotationSet() &&
                    <Card className="mt-3">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Card.Title>
                                        Annotations
                                    </Card.Title>
                                </Col>
                                <Col><Button size="sm" className="float-right" onClick={this._addNewAnnotation}>
                                    <FontAwesomeIcon icon={faPlus}/> Add</Button>
                                </Col>
                            </Row>
                            {this._renderAnnotationsTable()}
                        </Card.Body>
                    </Card>
                }
            </React.Fragment>
        );
    }
}


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state) {
    return {
        annotationSet: state.editableAnnotationSet,
        emptyAnnotation: state.emptyAnnotation
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationSetDetails);