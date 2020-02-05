import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'

class CorporaList extends Component {

    render() {
        return (
            <React.Fragment>
                <h2>Corpora</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: 2</Card.Title></Col>
                            <Col><Button className="float-right" size="sm"><FontAwesomeIcon icon={faPlus} /> Add</Button></Col>
                        </Row>

                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col"># Documents</th>
                                    <th scope="col"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Curriculum Vitaes</td>
                                    <td>4654</td>
                                    <td>
                                        <Button size="sm"><FontAwesomeIcon icon={faPen}/></Button>
                                        <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jobs</td>
                                    <td>1234</td>
                                    <td>
                                        <Button size="sm"><FontAwesomeIcon icon={faPen}/></Button>
                                        <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default CorporaList;