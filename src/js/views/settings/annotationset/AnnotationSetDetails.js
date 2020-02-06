import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSearch, faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-bootstrap/Pagination";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropzone from 'react-dropzone'

class AnnotationSetDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: "documents"
        }
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Annotation Set</h2>

                <Tabs defaultActiveKey={this.state.activeTab} activeKey={this.state.activeTab} onSelect={(k) => this.setState({activeTab: k})}>
                    <Tab eventKey="information" title="Information">
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Text>
                                    <Form>
                                        <Form.Group controlId="formName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Name of the Annotation Set" value="Languages"/>
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
                                            Annotations
                                        </Card.Title>
                                    </Col>
                                    <Col><Button className="float-right" size="sm"><FontAwesomeIcon icon={faPlus}/> Add</Button></Col>
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
                                                <Pagination.First />
                                                <Pagination.Prev />
                                                <Pagination.Item>{1}</Pagination.Item>
                                                <Pagination.Ellipsis />

                                                <Pagination.Item>{10}</Pagination.Item>
                                                <Pagination.Item>{11}</Pagination.Item>
                                                <Pagination.Item active>{12}</Pagination.Item>
                                                <Pagination.Item>{13}</Pagination.Item>
                                                <Pagination.Item disabled>{14}</Pagination.Item>

                                                <Pagination.Ellipsis />
                                                <Pagination.Item>{20}</Pagination.Item>
                                                <Pagination.Next />
                                                <Pagination.Last />
                                            </Pagination>
                                        </Form.Group>
                                    </Form>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <div className="mt-3">
                            <Button variant="success" className="mr-1">Save</Button>
                            <Button variant="danger" >Abort</Button>
                        </div>
                    </Tab>
                    <Tab eventKey="documents" title="Documents">
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title>Upload</Card.Title>
                                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
                                    {({getRootProps, getInputProps}) => (
                                        <section className="dropzone d-flex justify-content-center align-items-center">
                                                <p>Drop document archive or single file here...</p>
                                        </section>
                                    )}
                                </Dropzone>
                            </Card.Body>
                        </Card>
                        <Card className="mt-3">
                            <Card.Body>
                                <Card.Title>Available: 2 <span className="float-right">Last updated: 2020-01-01 12:12:23</span></Card.Title>
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
                                                <Button size="sm"><FontAwesomeIcon icon={faSearch}/></Button>
                                                <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Jobs</td>
                                            <td>
                                                <Button size="sm"><FontAwesomeIcon icon={faSearch}/></Button>
                                                <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <Pagination className="mt-1 d-flex justify-content-center">
                                        <Pagination.First />
                                        <Pagination.Prev />
                                        <Pagination.Item>{1}</Pagination.Item>
                                        <Pagination.Ellipsis />

                                        <Pagination.Item>{10}</Pagination.Item>
                                        <Pagination.Item>{11}</Pagination.Item>
                                        <Pagination.Item active>{12}</Pagination.Item>
                                        <Pagination.Item>{13}</Pagination.Item>
                                        <Pagination.Item disabled>{14}</Pagination.Item>

                                        <Pagination.Ellipsis />
                                        <Pagination.Item>{20}</Pagination.Item>
                                        <Pagination.Next />
                                        <Pagination.Last />
                                    </Pagination>
                                </div>
                            </Card.Body>
                        </Card>

                    </Tab>

                </Tabs>


            </React.Fragment>
        );
    }
}

export default AnnotationSetDetails;