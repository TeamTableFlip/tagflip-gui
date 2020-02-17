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

class AnnotationSetDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validated: false
        };
        this._saveAnnotationSet = this._saveAnnotationSet.bind(this);
        this._addNewAnnotation = this._addNewAnnotation.bind(this);
    }

    componentDidMount() {
        this.props.reloadAnnotationSet();
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

    }

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
                                <Card.Text>
                                    <Form>
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
                                    </Form>
                                </Card.Text>
                                <div className="mt-3">
                                    <Button variant="success" className="mr-1" type="submit">Save</Button>
                                    <Button variant="danger">Abort</Button>
                                </div>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
                <Card className="mt-3">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title>
                                    Annotations
                                </Card.Title>
                            </Col>
                            <Col><Button size="sm" className="float-right"><FontAwesomeIcon icon={faPlus} /> Add</Button></Col>
                        </Row>
                        <Card.Text>
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
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Language</td>
                                        <td><Badge variant="info" style={{backgroundColor: "#2887df"}}>#2887df</Badge></td>
                                        <td>
                                            <div className="float-right">
                                                <Button size="sm" onClick={() => this.props.history.push(`${match.path}/edit/1`)}><FontAwesomeIcon icon={faPen}/></Button>
                                                <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jobs</td>
                                        <td><Badge variant="info" style={{backgroundColor: "#26BE53"}}>#26BE53</Badge></td>
                                        <td>
                                            <div className="float-right">
                                                <Button size="sm" onClick={() => this.props.history.push(`${match.path}/edit/2`)}><FontAwesomeIcon icon={faPen}/></Button>
                                                <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>
                                            <InputGroup className="mb-3">
                                                <Form.Control type="text" placeholder="Name of the Annotation"
                                                              value=""/>
                                            </InputGroup>
                                        </td>
                                        <td><ColorPickerBadge /></td>
                                        <td>
                                            <div className="float-right">
                                                <Button size="sm" variant="success" onClick={() => this.props.history.push(`${match.path}/edit/2`)}><FontAwesomeIcon icon={faCheck}/></Button>
                                                <Button size="sm" variant="warning"><FontAwesomeIcon icon={faBan}/></Button>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
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
        emptyAnnotationSet: state.emptyAnnotationSet
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