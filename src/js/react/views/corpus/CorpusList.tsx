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
import {ActionCreators} from '../../../redux/actions/ActionCreators';
import fetchStatusType from "../../../redux/actions/FetchStatusTypes";
import FetchPending from "../../components/FetchPending/FetchPending";
import ConfirmationDialog from "../../components/Dialog/ConfirmationDialog";
import {RootState} from "../../../redux/reducers/Reducers";
import Corpus from "../../../backend/model/Corpus";
import {CorpusListValue} from "../../../redux/types";
import Form from "react-bootstrap/Form";
import DataTable, {tagFlipTextFilter} from "../../components/Dialog/DataTable";
import Document from "../../../backend/model/Document";
import {OffsetLimitParam, SimpleQueryParam} from "../../../backend/RequestBuilder";

/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        corpora: state.corpora,
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
    corpusToBeDeleted: Corpus;
    corporaToBeDeleted: Corpus[];
}

const initialState = {
    corpusToBeDeleted: undefined,
    corporaToBeDeleted: undefined
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
     * Render the CorpusList view.
     * @returns {*} The component to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <Card className="w-75 border-0">
                    <Card.Body>
                        <Card.Title className="text-center"><h2 className="h4">Corpora - Overview</h2></Card.Title>
                        <FetchPending isPending={this.props.corpora.isFetching}
                                      subtle={true}
                                      success={this.props.corpora.status === fetchStatusType.success}
                                      retryCallback={this.props.fetchCorpora}
                        >
                            <DataTable<Corpus>
                                keyField="corpusId"
                                columns={[{text: 'ID', dataField: 'corpusId', sort: true, filter: tagFlipTextFilter()},
                                    {text: 'Name', dataField: 'name', sort: true, filter: tagFlipTextFilter()}]}
                                totalSize={this.props.corpora.totalCount}
                                data={this.props.corpora.items}
                                multiSelect={true}
                                rowActionComponent={(rowObject: Corpus) =>
                                    (<div className="float-right">
                                        <Button size="sm" onClick={() => {
                                            this.props.setActiveCorpus(rowObject);
                                            return this.props.history.push(`${this.props.match.path}/edit`)
                                        }}><FontAwesomeIcon icon={faPen}/></Button>
                                        <Button size="sm" variant="danger"
                                                onClick={() => this.setState({corpusToBeDeleted: rowObject})}
                                        ><FontAwesomeIcon icon={faTrash}/></Button>
                                    </div>)
                                }
                                tableActionComponent={(selectedObjects: Corpus[]) => (
                                    <>
                                        <Button size="sm" variant="outline-primary" onClick={this.addNewCorpus}>
                                            <FontAwesomeIcon icon={faPlus}/> Add
                                        </Button>
                                        <Button size="sm" variant="outline-danger" className="ml-1"
                                                disabled={selectedObjects.length === 0}
                                                onClick={() => this.setState({corporaToBeDeleted: selectedObjects})}>
                                            <FontAwesomeIcon icon={faTrash}/> Delete
                                        </Button>
                                    </>
                                )}
                                onRequestData={(offset, limit, sortField, sortOrder, searchFilter) => {
                                    let queryParams = OffsetLimitParam.of(offset, limit)
                                    if (sortField)
                                        queryParams.push(SimpleQueryParam.of("sortField", sortField))
                                    if (sortOrder)
                                        queryParams.push(SimpleQueryParam.of("sortOrder", sortOrder))
                                    if (searchFilter && searchFilter.length > 0)
                                        queryParams.push(SimpleQueryParam.of("searchFilter", JSON.stringify(searchFilter)))
                                    this.props.fetchCorpora(queryParams)
                                }}

                            />
                        </FetchPending>
                        <ConfirmationDialog acceptVariant="danger"
                                            show={this.state.corpusToBeDeleted && this.state.corpusToBeDeleted.corpusId > 0}
                                            message={"Are you sure you want to delete the Corpus '" + (this.state.corpusToBeDeleted ? this.state.corpusToBeDeleted.name : "") + "'?"}
                                            acceptText="Delete"
                                            onAccept={() => {
                                                this.props.deleteCorpus(this.state.corpusToBeDeleted.corpusId);
                                                this.setState({corpusToBeDeleted: undefined});
                                                if (this.props.selectedCorpus.values.corpusId === this.state.corpusToBeDeleted.corpusId) {
                                                    this.props.setActiveCorpus(Corpus.create());
                                                }
                                            }}
                                            onCancel={() => {
                                                this.setState({corpusToBeDeleted: undefined});
                                            }}/>
                        <ConfirmationDialog acceptVariant="danger"
                                            show={this.state.corporaToBeDeleted && this.state.corporaToBeDeleted.length > 0}
                                            message={"Are you sure you want to delete selected Corpora'?"}
                                            acceptText="Delete"
                                            onAccept={() => {
                                                this.state.corporaToBeDeleted.map(crop => this.props.deleteCorpus(crop.corpusId));
                                                this.setState({corporaToBeDeleted: undefined});
                                            }}
                                            onCancel={() => {
                                                this.setState({corporaToBeDeleted: undefined});
                                            }}/>
                    </Card.Body>
                </Card>
            </React.Fragment>
        );
    }
}

export default connector(withRouter(CorpusList));
