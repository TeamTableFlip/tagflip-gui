import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from "react-router-dom";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import connect from "react-redux/es/connect/connect";
import {Spinner} from "react-bootstrap";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import Alert from "react-bootstrap/Alert";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import FetchPending from "../../../components/FetchPending";

class AnnotationSetList extends Component {
    constructor(props) {
        super(props);
        this._addNewAnnotationSet = this._addNewAnnotationSet.bind(this);
        this._renderAnnotationSets = this._renderAnnotationSets.bind(this);
        this.render = this.render.bind(this);
        this.state = {
            deleteEntry: false,
            annotationSetIdToBeDeleted: undefined
        };
    }

    componentDidMount() {
        this.props.fetchAnnotationSets();
    }

    _addNewAnnotationSet() {
        this.props.setEditableAnnotationSet(this.props.emptyAnnotationSet);
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    _renderAnnotationSets() {
        let renderAnnotationSetTableData = () => {
            return this.props.annotationSets.items.map(annotationSet => {
                return <tr key={annotationSet.s_id}>
                    <th scope="row">{annotationSet.s_id}</th>
                    <td>{annotationSet.name}</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm"
                                    onClick={() => {
                                        this.props.setEditableAnnotationSet(annotationSet);
                                        return this.props.history.push(`${this.props.match.path}/edit`)
                                    }}><FontAwesomeIcon
                                icon={faPen}/></Button>
                            <Button size="sm" variant="danger" onClick={() => {
                                this.setState({
                                    deleteEntry: true,
                                    annotationSetIdToBeDeleted: annotationSet.s_id
                                });
                            }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <ConfirmationDialog
                                show={this.state.deleteEntry && this.state.annotationSetIdToBeDeleted === annotationSet.s_id}
                                message={"Are you sure you want to delete the Annotation Set '" + annotationSet.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteAnnotationSet(annotationSet.s_id);
                                    this.setState({
                                        deleteEntry: false,
                                        annotationSetIdToBeDeleted: undefined
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        deleteEntry: false,
                                        annotationSetIdToBeDeleted: undefined
                                    });
                                }}
                                acceptText="Delete" />
                        </div>
                    </td>
                </tr>
            });
        };

        return (
            <div className="table-responsive">
                <FetchPending
                    isPending={this.props.annotationSets.isFetching}
                    success={this.props.annotationSets.status === fetchStatusType.success}
                    retryCallback={() => {
                        this.props.fetchAnnotationSets();
                    }}
                >
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {renderAnnotationSetTableData()}
                        </tbody>
                    </table>
                </FetchPending>
            </div>

        )
    }

    render() {
        return (
            <React.Fragment>
                <h2>Annotation Sets</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: {this.props.annotationSets.length}</Card.Title></Col>
                            <Col><Button className="float-right" size="sm" onClick={this._addNewAnnotationSet}>
                                <FontAwesomeIcon icon={faPlus} /> Add
                            </Button></Col>
                        </Row>
                        {this._renderAnnotationSets()}
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
        annotationSets: state.annotationSets,
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AnnotationSetList));