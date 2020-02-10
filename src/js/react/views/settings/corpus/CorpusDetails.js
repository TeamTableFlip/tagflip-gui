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
            activeTab: "documents",
            validated: false,
            corpus: {}
        };
        this.handleChangeChange = this.handleChangeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            corpus: this.props.corpus
        })
    }

    handleChangeChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(this.state)
        let partialState = this.state.corpus;
        partialState[name] = value;

        this.setState({
            corpus: partialState
        });
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            alert("valid")
        }
        this.setState({validated: true})
    }

    isNewCorpus() {
        return this.props.corpus.c_id <= 0;
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Corpus</h2>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Basic Information
                            </Card.Title>

                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name of the corpus"
                                              name="name"
                                              onChange={this.handleChangeChange}
                                              value={this.state.corpus.name || ""}
                                              required={true}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a name.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" placeholder="Description of the corpus"
                                              name="description"
                                              onChange={this.handleChangeChange}
                                              value={this.state.corpus.description || ""}/>
                            </Form.Group>

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

                            <ListGroup>
                                <ListGroup.Item><Form.Check type="checkbox"
                                                            key={1}
                                                            label="CV Annotations"/></ListGroup.Item>
                                <ListGroup.Item><Form.Check type="checkbox"
                                                            key={2}
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

                        </Card.Body>
                    </Card>
                    <div className="mt-3">
                        <Button variant="success" className="mr-1" type="submit">Save</Button>
                        <Button variant="danger">Abort</Button>
                    </div>
                </Form>

                {!this.isNewCorpus() && (<React.Fragment>
                    <hr className="mt-5"/>
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
                                <FileUpload onSelect={(k) => alert(k)} onReject={(k) => alert(k)}
                                            uploadText="Drop archive or single document here..."/>
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
                </React.Fragment>)}

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
        corpus: state.activeEditCorpus
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