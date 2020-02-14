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

class AnnotationSetDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "documents",
            annotationSet: this.props.emptyAnnotationSet,
            annotations: [],
            validated: false
        };
        this._saveAnnotationSet = this._saveAnnotationSet.bind(this);
        this._resetAnnotationSet = this._resetAnnotationSet.bind(this);
        this._addNewAnnotation = this._addNewAnnotation.bind(this);
        this._handleAnnotationSetChange = this._handleAnnotationSetChange.bind(this);
    }

    componentDidMount() {
        this.setState({
            annotationSet: Object.assign({}, this.props.selectedAnnotationSet)
        });
    }

    _saveAnnotationSet() {
        this.props.saveAnnotationSet(this.state.annotationSet)
            .then(result => {
                console.log(result)
            })
            .catch(err => {
                console.log(err)
            })
    }

    _resetAnnotationSet() {
        this.setState({
            annotationSet: Object.assign({}, this.props.emptyAnnotationSet, this.props.selectedAnnotationSet)
        });
    }

    _addNewAnnotation() {

    }

    _handleAnnotationSetChange(event) {
        let annotationSet = this.state.annotationSet;
        annotationSet[event.target.name] = event.target.value;
        this.setState({
            annotationSet: annotationSet
        });
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Annotation Set</h2>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>
                            Basic Information
                        </Card.Title>
                        <Card.Text>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the Annotation Set"
                                                  value={this.state.annotationSet.name}
                                                  name='name'
                                                  onChange={this._handleAnnotationSetChange} />
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the Annotation Set"
                                                  name='description'
                                                  value={this.state.annotationSet.description}
                                                  onChange={this._handleAnnotationSetChange} />
                                </Form.Group>
                            </Form>
                        </Card.Text>
                        <div className="mt-3">
                            <Button variant="success" className="mr-1" onClick={this._saveAnnotationSet}>Save</Button>
                            <Button variant="danger" onClick={this._resetAnnotationSet}>Abort</Button>
                        </div>
                    </Card.Body>
                </Card>
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
        selectedAnnotationSet: state.selectedAnnotationSet,
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