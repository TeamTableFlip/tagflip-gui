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
import {Spinner} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";

class CorpusList extends Component {
    constructor(props) {
        super(props);
        this.addNewCorpus = this.addNewCorpus.bind(this)
    }

    componentDidMount() {
        this.props.fetchCorpora();
    }

    addNewCorpus() {
        this.props.setSelectedCorpus(this.props.emptyCorpus);
        return this.props.history.push(`${this.props.match.path}/edit`)
    }


    _renderCorpora() {
        if (this.props.corpora.isFetching) {
            return (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" variant="primary"/>
                </div>
            )
        }
        let renderCorpusTableData = () => {
            return this.props.corpora.items.map(corpus => {
                return <tr key={corpus.c_id}>
                    <th scope="row">{corpus.c_id}</th>
                    <td>{corpus.name}</td>
                    <td>TODO</td>
                    <td>
                        <div className="float-right">
                            <Button size="sm" onClick={() => {
                                this.props.setSelectedCorpus(corpus);
                                return this.props.history.push(`${this.props.match.path}/edit`)
                            }}><FontAwesomeIcon icon={faPen}/></Button>
                            <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                        </div>
                    </td>
                </tr>
            })
        };

        return (
            <div className="table-responsive">
                {
                    (this.props.corpora.status === fetchStatusType.error) && (
                        <Alert variant="warning">
                            <p>Could not fetch data from server.</p>
                            <Button onClick={() => this.props.fetchCorpora()} variant="primary">Try again</Button>
                        </Alert>
                    )
                }
                {
                    (this.props.corpora.status === fetchStatusType.success) && (
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
                    )
                }
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                <h2>Corpora</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: {this.props.corpora.length}</Card.Title></Col>
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
        emptyCorpus: state.emptyCorpus
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