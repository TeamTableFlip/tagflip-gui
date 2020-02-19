import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faSearch, faTrash, faCheck, faBan} from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import FileUpload from "../../../components/fileUpload/FileUpload";
import Badge from "react-bootstrap/Badge";
import InputGroup from "react-bootstrap/InputGroup";
import ColorPickerBadge from "../../../components/colorPickerBadge/ColorPickerBadge";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import FetchPending from "../../../components/FetchPending";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";

class AnnotationSetDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false,
            createNewAnnotation: false,
            editAnnotation: false,
            deleteEntry: false,
            annotationIdToBeDeleted: undefined
        };
        this._saveAnnotationSet = this._saveAnnotationSet.bind(this);
        this._addNewAnnotation = this._addNewAnnotation.bind(this);
        this._renderAnnotationsTable = this._renderAnnotationsTable.bind(this);
    }

    componentDidMount() {
        // if(!this._isNewAnnotationSet()) {
            this.props.fetchAnnotations();
        // }
    }

    _saveAnnotationSet() {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            this.props.saveAnnotationSet();
        }
        this.setState({validated: true})
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
        this.props.saveAnnotation();
        this.setState({
            createNewAnnotation: false,
            editAnnotation: false
        });
        this.props.fetchAnnotations();
    }

    _renderAnnotationsTable() {
        let renderTableData = () => {
            return this.props.annotationSet.annotations.items.map(annotation => {
                return <tr key={annotation.a_id}>
                    <th scope="row">{annotation.a_id}</th>
                    <td>{annotation.name}</td>
                    <td><Badge className="text-monospace" variant="info" style={{backgroundColor: annotation.color}}>{annotation.color}</Badge></td>
                    <td>
                        <div className="float-right">
                            <Button size="sm" onClick={() => this.props.history.push(`${this.props.match.path}/edit/${annotation.a_id}`)}><FontAwesomeIcon icon={faPen}/></Button>
                            <Button size="sm" variant="danger" onClick={() => {
                                this.setState({
                                    deleteEntry: true,
                                    annotationIdToBeDeleted: annotation.a_id
                                });
                            }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <ConfirmationDialog
                                show={this.state.deleteEntry && this.state.annotationIdToBeDeleted === annotation.a_id}
                                message={"Are you sure you want to delete the Annotation '" + annotation.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteAnnotation(annotation.a_id);
                                    this.setState({
                                        deleteEntry: false,
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        deleteEntry: false,
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                acceptText="Delete" />
                        </div>
                    </td>
                </tr>
            })
        };

        let renderEditAnnotation = () => {
            if(!this.state.createNewAnnotation && !this.state.editAnnotation)
                return;

            return <tr>
                <th scope="row">{this.props.editableAnnotation.data.values.a_id || ""}</th>
                <td>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" placeholder="Name of the Annotation"
                                      onChange={e => {this.props.updateAnnotationField('name', e.target.value)}}
                                      value={this.props.editableAnnotation.data.values.name || ""}/>
                    </InputGroup>
                </td>
                <td><ColorPickerBadge updateColorCallback={color => {this.props.updateAnnotationField('color', color)}} /></td>
                <td>
                    <div className="float-right">
                        <Button size="sm" variant="success" onClick={() => {
                            this._saveAnnotation()
                            // this.props.history.push(`${this.props.match.path}/edit/2`)
                        }}><FontAwesomeIcon icon={faCheck}/></Button>
                        <Button size="sm" variant="warning"><FontAwesomeIcon icon={faBan}/></Button>
                    </div>
                </td>
            </tr>
        };

        return <FetchPending
            isPending={this.props.annotationSet.annotations.isFetching}
            success={this.props.annotationSet.annotations.status === fetchStatusType.success}
            retryCallback={() => {
                this.props.fetchAnnotations();
            }}
        >
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
                    {renderEditAnnotation()}
                    </tbody>
                </table>
            </div>
        </FetchPending>
    }

    _isNewAnnotationSet() {
        return this.props.annotationSet.data.values.s_id <= 0;
    }

    // TODO: reset validate on success

    render() {
        return (
            <React.Fragment>
                <h2>Edit Annotation Set</h2>
                <Form noValidate validated={this.state.validated} onSubmit={this._saveAnnotationSet}>
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
                                    <Button variant="danger">Abort</Button>
                                </div>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
                {/*{ !this._isNewAnnotationSet() &&*/}
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
                {/*}*/}
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
        annotations: state.annotations,
        editableAnnotation: state.editableAnnotation,
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