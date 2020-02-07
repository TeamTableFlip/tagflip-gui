import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import FileUpload from "../../../components/fileUpload/FileUpload";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';

class CorpusDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "documents"
        }
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Corpus</h2>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>
                            Basic Information
                        </Card.Title>
                        <Card.Text>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the corpus"
                                                  value={this.props.corpus.name}/>
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the corpus"
                                                  value={this.props.corpus.description}/>
                                </Form.Group>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card className="mt-3">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title>
                                    Annotation Sets
                                </Card.Title>
                            </Col>
                            <Col></Col>
                        </Row>
                        <Card.Text>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <ListGroup>
                                        <ListGroup.Item><Form.Check type="checkbox"
                                                                    label="CV Annotations"/></ListGroup.Item>
                                        <ListGroup.Item><Form.Check type="checkbox"
                                                                    label="Linguistic Annotations"/></ListGroup.Item>
                                    </ListGroup>
                                    <Pagination className="mt-1 d-flex justify-content-center">
                                        <Pagination.First/>
                                        <Pagination.Prev/>
                                        <Pagination.Item>{1}</Pagination.Item>
                                        <Pagination.Ellipsis/>

                                        <Pagination.Item>{10}</Pagination.Item>
                                        <Pagination.Item>{11}</Pagination.Item>
                                        <Pagination.Item active>{12}</Pagination.Item>
                                        <Pagination.Item>{13}</Pagination.Item>
                                        <Pagination.Item disabled>{14}</Pagination.Item>

                                        <Pagination.Ellipsis/>
                                        <Pagination.Item>{20}</Pagination.Item>
                                        <Pagination.Next/>
                                        <Pagination.Last/>
                                    </Pagination>
                                </Form.Group>
                            </Form>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <div className="mt-3">
                    <Button variant="success" className="mr-1">Save</Button>
                    <Button variant="danger">Abort</Button>
                </div>

                <hr className="mt-5" />
                <h3 className="mt-5">Documents</h3>
                <Card className="mt-3">
                    <Card.Body>
                        <Card.Title>Upload</Card.Title>
                            <OverlayTrigger
                                placement='right'
                                overlay={
                                    <Tooltip>
                                        Tooltip on lol.
                                    </Tooltip>
                                }
                            >
                            <FileUpload onSelect={(k) => alert(k)} onReject={(k) => alert(k)} uploadText="Drop archive or single document here..." />
                        </OverlayTrigger>
                    </Card.Body>
                    <Card.Body>
                        <Card.Title>Available: 2 <span className="float-right text-secondary font-weight-light">Updated: 2020-01-01 12:12:23</span></Card.Title>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Curriculum Vitaes</td>
                                    <td>
                                        <div className="float-right">
                                            <Button size="sm"><FontAwesomeIcon icon={faSearch}/></Button>
                                            <Button size="sm" variant="danger"><FontAwesomeIcon
                                                icon={faTrash}/></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jobs</td>
                                    <td>
                                        <div className="float-right">
                                            <Button size="sm"><FontAwesomeIcon icon={faSearch}/></Button>
                                            <Button size="sm" variant="danger"><FontAwesomeIcon
                                                icon={faTrash}/></Button>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <Pagination className="mt-1 d-flex justify-content-center">
                                <Pagination.First/>
                                <Pagination.Prev/>
                                <Pagination.Item>{1}</Pagination.Item>
                                <Pagination.Ellipsis/>

                                <Pagination.Item>{10}</Pagination.Item>
                                <Pagination.Item>{11}</Pagination.Item>
                                <Pagination.Item active>{12}</Pagination.Item>
                                <Pagination.Item>{13}</Pagination.Item>
                                <Pagination.Item disabled>{14}</Pagination.Item>

                                <Pagination.Ellipsis/>
                                <Pagination.Item>{20}</Pagination.Item>
                                <Pagination.Next/>
                                <Pagination.Last/>
                            </Pagination>
                        </div>
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
        corpus: state.corpus
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CorpusDetails);