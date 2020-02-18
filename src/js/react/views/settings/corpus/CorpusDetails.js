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
import {Spinner} from "react-bootstrap";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import Alert from "react-bootstrap/Alert";
import FetchPending from "../../../components/FetchPending";

const initialState = {
    activeTab: "documents",
    validated: false,
    corpus: undefined,
    annotationSets: [],
    selectedAnnotationSetIds: new Set()
};

class CorpusDetails extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.props.fetchAnnotationSets();
        this.props.reloadCorpus();
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validated: false})
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validated: true})
        } else {
            this.props.saveCorpus()
        }
    }

    isNewCorpus() {
        return this.props.corpus.data.values.c_id <= 0;
    }

    renderAnnotationSetSelection() {
        const selectedAnnotationSetIds = new Set(this.props.corpus.annotationSets.items.map(annotationSet => annotationSet.s_id));
        let renderAnnotationSetList = () => {
            return this.props.annotationSets.items.map(annotationSet => {
                return (
                    <ListGroup.Item key={annotationSet.s_id}>
                        <Form.Check type="checkbox"
                                    checked={selectedAnnotationSetIds.has(annotationSet.s_id)}
                                    onChange={() => this.props.toggleCorpusAnnotationSet(annotationSet)}
                                    label={annotationSet.name}/>
                    </ListGroup.Item>
                )
            })
        };

        return (
            <FetchPending
                isPending={this.props.annotationSets.isFetching || this.props.corpus.annotationSets.isFetching}
                success={this.props.annotationSets.status === fetchStatusType.success && this.props.corpus.annotationSets.status === fetchStatusType.success}
                retryCallback={() => {
                    this.props.fetchAnnotationSets();
                    this.props.fetchCorpusAnnotationSets(this.props.corpus.data.c_id);
                }}
            >
                <ListGroup>
                    {renderAnnotationSetList()}
                </ListGroup>
            </FetchPending>
        )
    }

    render() {
        return (
            <React.Fragment>
                <h2>Edit Corpus ({!this.isNewCorpus() ? ("ID: " + this.props.corpus.data.values.c_id) : "New"})</h2>
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Basic Information
                            </Card.Title>
                            <FetchPending
                                isPending={this.props.corpus.data.isFetching}
                                success={this.props.corpus.data.status === fetchStatusType.success}
                                retryCallback={this.props.reloadCorpus}
                            >
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the corpus"
                                                  name="name"
                                                  onChange={(e) => this.props.updateCorpusField('name', e.target.value.trim())}
                                                  value={this.props.corpus.data.values.name || ""}
                                                  required={true}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                < Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the corpus"
                                                  name="description"
                                                  onChange={(e) => this.props.updateCorpusField('description', e.target.value.trim())}
                                                  value={this.props.corpus.data.values.description || ""}/>
                                </Form.Group>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                    <div className="mt-3">
                        <Button variant="success" className="mr-1" type="submit">Save</Button>
                    </div>

                </Form>
                {!this.isNewCorpus() && (
                    <React.Fragment>
                        <hr className="mt-5"/>
                        <h3 className="mt-5">Annotation Sets</h3>
                        <Card className="mt-3">
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>
                                            Selection
                                        </Card.Title>
                                    </Col>
                                    <Col></Col>
                                </Row>

                                {this.renderAnnotationSetSelection()}

                            </Card.Body>
                        </Card>
                    </React.Fragment>
                )}

                {!this.isNewCorpus() && (
                    <React.Fragment>
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
        corpus: state.editableCorpus,
        annotationSets: state.annotationSets,
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