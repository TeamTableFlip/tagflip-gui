import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";

/**
 * The view for displaying and deleting Corpora.
 */
class CorpusList extends Component {
    /**
     * Create a new CorpusList.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.addNewCorpus = this.addNewCorpus.bind(this);
        this.state = {
            corpusIdToBeDeleted: undefined
        };
    }

    /**
     * React lifecycle method. Fetches all corpora.
     */
    componentDidMount() {
        this.props.fetchCorpora();
    }

    /**
     * Add a new Corpus by redirecting to the corresponding edit view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    addNewCorpus() {
        this.props.setEditableCorpus(this.props.emptyCorpus);
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    /**
     * Get the Table to be rendered containing all Corpora.
     * @returns {*} The Table to be rendered.
     * @private
     */
    _renderCorpora() {
        let renderCorpusTableData = () => {
            return this.props.corpora.items.map(corpus => {
                return <tr key={corpus.c_id}>
                    <td scope="row">{corpus.c_id}</td>
                    <td>{corpus.name}</td>
                    <td>{corpus.num_documents}</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm" onClick={() => {
                                this.props.setEditableCorpus(corpus);
                                return this.props.history.push(`${this.props.match.path}/edit`)
                            }}><FontAwesomeIcon icon={faPen}/></Button>
                            <Button size="sm" variant="danger"
                                    onClick={() => {
                                        this.setState({ corpusIdToBeDeleted: corpus.c_id });
                                    }}
                            ><FontAwesomeIcon icon={faTrash}/></Button>
                            <ConfirmationDialog
                                acceptVariant="danger"
                                show={this.state.corpusIdToBeDeleted === corpus.c_id}
                                message={"Are you sure you want to delete the Corpus '" + corpus.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteCorpus(corpus.c_id);
                                    this.setState({ corpusIdToBeDeleted: undefined });
                                    if(this.props.selectedCorpus.values.c_id === corpus.c_id) {
                                        this.props.setEditableCorpus(this.props.emptyCorpus);
                                    }
                                }}
                                onCancel={() => {
                                    this.setState({ corpusIdToBeDeleted: undefined });
                                }}
                                acceptText="Delete" />
                        </div>
                    </td>
                </tr>
            })
        };

        return (
            <div className="table-responsive">
                <FetchPending isPending={this.props.corpora.isFetching}
                              success={this.props.corpora.status === fetchStatusType.success}
                              retryCallback={this.props.fetchCorpora}
                >
                        <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Name</th>
                                <th scope="col"># Documents</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderCorpusTableData()}
                            </tbody>
                        </table>
                </FetchPending>
            </div>
        )
    }

    /**
     * Render the CorpusList view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <h2>Corpora</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: {this.props.corpora.items.length}</Card.Title></Col>
                            <Col><Button className="float-right" size="sm" onClick={this.addNewCorpus}><FontAwesomeIcon
                                icon={faPlus}/> Add</Button></Col>
                        </Row>
                        {this._renderCorpora()}
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
        corpora: state.corpora,
        emptyCorpus: state.emptyCorpus,
        selectedCorpus: state.editableCorpus
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CorpusList));