import React, {Component} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPen, faTrash, faPlus} from '@fortawesome/free-solid-svg-icons'
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../../../redux/actions/ActionCreators';

class CorpusList extends Component {
    constructor(props) {
        super(props);
        this.addNewCorpus = this.addNewCorpus.bind(this)
    }

    componentDidMount() {
        this.props.fetchCorpora();
    }

    addNewCorpus() {
        this.props.setActiveEditCorpus(this.props.emptyCorpus);
        return this.props.history.push(`${this.props.match.path}/edit`)
    }

    _renderCorpora() {
        if (this.props.corpora.length === 0)
            return;
        return this.props.corpora.map(corpus => {
            return <tr key={corpus.c_id}>
                <th scope="row">{corpus.c_id}</th>
                <td>{corpus.name}</td>
                <td>{corpus.num_documents}</td>
                <td>
                    <div className="float-right">
                        <Button size="sm" onClick={() => {
                            this.props.setActiveEditCorpus(corpus);
                            return this.props.history.push(`${this.props.match.path}/edit`)
                        }}><FontAwesomeIcon icon={faPen}/></Button>
                        <Button size="sm" variant="danger"><FontAwesomeIcon icon={faTrash}/></Button>
                    </div>
                </td>
            </tr>
        })
    }

    render() {
        return (
            <React.Fragment>
                <h2>Corpora</h2>
                <Card>
                    <Card.Body>
                        <Row>
                            <Col><Card.Title>Available: {this.props.corpora.length}</Card.Title></Col>
                            <Col><Button className="float-right" size="sm" onClick={this.addNewCorpus}><FontAwesomeIcon icon={faPlus} /> Add</Button></Col>
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
                                    {this._renderCorpora()}
                                </tbody>
                            </table>
                        </div>
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