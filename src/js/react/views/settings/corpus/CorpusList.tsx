import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faPlus, faTrash} from '@fortawesome/free-solid-svg-icons'
import {RouteComponentProps, withRouter} from "react-router-dom";
import {connect, ConnectedProps} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../../components/FetchPending";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import {RootState} from "../../../../redux/reducers/Reducers";
import Corpus from "../../../../Corpus";
import {CorpusListValue} from "../../../../redux/types";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        corpora: state.corpora,
        //emptyCorpus: state.emptyCorpus,
        selectedCorpus: state.activeCorpus
    };
}

/**
 * Maps action creator functions to component's props.
 * @param dispatch
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps & {
    corpora: CorpusListValue;
};

interface State {
    corpusIdToBeDeleted: number;
}

const initialState = {
    corpusIdToBeDeleted: undefined
};

/**
 * The view for displaying and deleting Corpora.
 */
class CorpusList extends Component<Props, State> {
    /**
     * Create a new CorpusList.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.addNewCorpus = this.addNewCorpus.bind(this);
        this.importNewCorpus = this.importNewCorpus.bind(this);
        this.state = initialState;
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
        this.props.setActiveCorpus(Corpus.create());
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    /**
     * Import a new Corpus by redirecting to the corresponding import view.
     * @returns {*} The number of elements in the history property.
     * @private
     */
    importNewCorpus() {
        this.props.setActiveCorpus(Corpus.create());
        return this.props.history.push(`${this.props.match.path}/import`)
    }

    /**
     * Get the Table to be rendered containing all Corpora.
     * @returns {*} The Table to be rendered.
     * @private
     */
    _renderCorpora() {
        let renderCorpusTableData = () => {
            return this.props.corpora.items.map(corpus => {
                return (
                    <tr key={corpus.corpusId}>
                        <td scope="row">{corpus.corpusId}</td>
                        <td>{corpus.name}</td>
                        <td>
                            <div className="float-right">
                                <Button size="sm" onClick={() => {
                                    this.props.setActiveCorpus(corpus);
                                    return this.props.history.push(`${this.props.match.path}/edit`)
                                }}><FontAwesomeIcon icon={faPen}/></Button>
                                <Button size="sm" variant="danger"
                                        onClick={() => {
                                            this.setState({corpusIdToBeDeleted: corpus.corpusId});
                                        }}
                                ><FontAwesomeIcon icon={faTrash}/></Button>
                                <ConfirmationDialog
                                    acceptVariant="danger"
                                    show={this.state.corpusIdToBeDeleted === corpus.corpusId}
                                    message={"Are you sure you want to delete the Corpus '" + corpus.name + "'?"}
                                    onAccept={() => {
                                        this.props.deleteCorpus(corpus.corpusId);
                                        this.setState({corpusIdToBeDeleted: undefined});
                                        if (this.props.selectedCorpus.values.corpusId === corpus.corpusId) {
                                            this.props.setActiveCorpus(Corpus.create());
                                        }
                                    }}
                                    onCancel={() => {
                                        this.setState({corpusIdToBeDeleted: undefined});
                                    }}
                                    acceptText="Delete"/>
                            </div>
                        </td>
                    </tr>)
            })
        };

        return (
            <div className="table-responsive">
                <FetchPending isPending={this.props.corpora.isFetching}
                              subtle={false}
                              success={this.props.corpora.status === fetchStatusType.success}
                              retryCallback={this.props.fetchCorpora}
                >
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col"/>
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
                            <Col md="auto">
                                <Button size="sm" onClick={this.addNewCorpus}>
                                    <FontAwesomeIcon icon={faPlus}/>Add</Button>
                            </Col>
                            <Col md="auto">
                                <Button size="sm" onClick={this.importNewCorpus}>
                                    <FontAwesomeIcon icon={faPlus}/>Import</Button>
                            </Col>
                        </Row>
                        {this._renderCorpora()}
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default connector(withRouter(CorpusList));
