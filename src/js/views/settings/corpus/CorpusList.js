import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from "react-router-dom";

class CorpusList extends Component {

    render() {
        const { match } = this.props
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
                                        <div className="float-right">
                                            <Button size="sm" onClick={() => this.props.history.push(`${match.path}/edit/1`)}><FontAwesomeIcon icon={faPen}/></Button>
                                            <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jobs</td>
                                    <td>1234</td>
                                    <td>
                                        <div className="float-right">
                                            <Button size="sm" onClick={() => this.props.history.push(`${match.path}/edit/2`)}><FontAwesomeIcon icon={faPen}/></Button>
                                            <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                                        </div>
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

export default withRouter(CorpusList);