import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faPlus, faTrash, faCheck, faBan} from "@fortawesome/free-solid-svg-icons";
import Badge from "react-bootstrap/Badge";
import InputGroup from "react-bootstrap/InputGroup";
import ColorPickerBadge from "../../../components/colorPickerBadge/ColorPickerBadge";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {RouteComponentProps} from "react-router-dom";
import FetchPending from "../../../components/FetchPending";
import fetchStatusType from "../../../../redux/actions/FetchStatusTypes";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import Annotation from "../../../../backend/model/Annotation";
import AnnotationSet from "../../../../backend/model/AnnotationSet";

const style = {
    annotation: {
        firstCol: {
            width: "10%"
        },
        secondCol: {
            width: "40%"
        },
        thirdCol: {
            width: "30%"
        },
        fourthCol: {
            width: "20%"
        }
    }
};


/**
 * Maps redux state to component's props.
 * @param state The redux state (reducers).
 */
function mapStateToProps(state: RootState) {
    return {
        annotationSet: state.activeAnnotationSet,
        editableAnnotationValues: state.activeAnnotationSet.annotations.editableAnnotation.values
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

const initialState = {
    validatedBasicInfo: false,
    validatedAnnotation: false,
    createNewAnnotation: false,
    editAnnotation: false,
    annotationIdToBeDeleted: undefined,
    isChangeRequest: false
};

type State = typeof initialState

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    annotationSet: AnnotationSet
};

/**
 * The view for creating and updating single AnnotationSets with their list of Annotations.
 */
class AnnotationSetDetails extends Component<Props, State> {
    /**
     * Create a new AnnotationSetDetails component.
     * @param props The properties of the component.
     */
    constructor(props) {
        super(props);
        this.state = initialState;
        this._saveAnnotationSet = this._saveAnnotationSet.bind(this);
        this.addNewAnnotation = this.addNewAnnotation.bind(this);
        this._renderAnnotationsTable = this._renderAnnotationsTable.bind(this);
        this._saveAnnotation = this._saveAnnotation.bind(this);
        this._abortEditAnnotationSet = this._abortEditAnnotationSet.bind(this);
    }

    /**
     * React lifecycle method. Fetches the Annotations of the selected AnnotationSet.
     */
    componentDidMount() {
        this.props.fetchActiveAnnotationSetAnnotations();
    }

    /**
     * Persist the AnnotationSet, with checking for validation of the inputs.
     * @param event The Form-event which contains the fields to be validated before persisting.
     * @private
     */
    _saveAnnotationSet(event) {
        const form = event.currentTarget;
        event.preventDefault();
        this.setState({validatedBasicInfo: false});
        if (form.checkValidity() === false) {
            event.stopPropagation();
            this.setState({validatedBasicInfo: true});
        } else {
            this.props.saveActiveAnnotationSet();
        }
    }

    /**
     * Create a new Annotation, which can be edited and persisted later on.
     * @private
     */
    addNewAnnotation() {
        this.setState({
            createNewAnnotation: true,
            editAnnotation: false
        });
        let newAnnotation = Annotation.create();
        newAnnotation.annotationSetId = this.props.annotationSet.values.annotationSetId;
        this.props.setActiveAnnotationSetEditableAnnotation(newAnnotation);
    }

    /**
     * Persist the selected/new Annotation after validating its information.
     * @private
     */
    _saveAnnotation() {
        let annotation = this.props.editableAnnotationValues;
        if (annotation.name && annotation.name.length > 0) {
            this.setState({
                validatedAnnotation: false,
                createNewAnnotation: false,
                editAnnotation: false,
                isChangeRequest: true
            });
            this.props.saveActiveAnnotationSetAnnotation(this.props.editableAnnotationValues);
        } else {
            this.setState({
                validatedAnnotation: true
            });
        }
    }

    /**
     * Handle selecting an Annotation for editing.
     * @param annotation The Annotation to be selected for editing.
     * @private
     */
    _onClickEditAnnotation(annotation) {
        this.props.setActiveAnnotationSetEditableAnnotation(annotation);
        this.setState({
            editAnnotation: true,
            createNewAnnotation: false
        });
    }

    /**
     * Get the Table to be rendered for viewing, editing and creating Annotations.
     * @returns {*} The table to be rendered.
     * @private
     */
    _renderAnnotationsTable() {
        let renderEditAnnotation = () => {
            return <tr key={this.props.editableAnnotationValues.annotationId || 0}>
                <th scope="row"
                    style={style.annotation.firstCol}>{this.props.editableAnnotationValues.annotationId || ""}</th>
                <td style={style.annotation.secondCol}>
                    <InputGroup className="mb-3">
                        <Form.Control type="text" placeholder="Name of the Annotation" required={true}
                                      onChange={e => {
                                          this.props.updateActiveAnnotationSetEditableAnnotationField('name', e.target.value)
                                      }}
                                      value={this.props.editableAnnotationValues.name}/>
                        <Form.Control.Feedback type="invalid">
                            Please choose a name.
                        </Form.Control.Feedback>
                    </InputGroup>
                </td>
                <td style={style.annotation.thirdCol}>
                    <ColorPickerBadge
                        updateColorCallback={color => {
                            this.props.updateActiveAnnotationSetEditableAnnotationField('color', color)
                        }}
                        color={this.props.editableAnnotationValues.color}
                    />
                </td>
                <td style={style.annotation.fourthCol}>
                    <div className="float-right">
                        <Button size="sm" variant="success" onClick={e => this._saveAnnotation()}>
                            <FontAwesomeIcon icon={faCheck}/>
                        </Button>
                        <Button size="sm" variant="warning" onClick={e => {
                            this.setState({
                                createNewAnnotation: false,
                                editAnnotation: false
                            })
                        }}>
                            <FontAwesomeIcon icon={faBan}/>
                        </Button>
                    </div>
                </td>
            </tr>
        };

        let renderTableData = () => {
            return this.props.annotationSet.annotations.items.map(annotation => {
                if (this.state.editAnnotation && annotation.annotationId === this.props.editableAnnotationValues.annotationId) {
                    return renderEditAnnotation();
                }

                return <tr key={annotation.annotationId}>
                    <th scope="row" style={style.annotation.firstCol}>{annotation.annotationId}</th>
                    <td style={style.annotation.secondCol}>{annotation.name}</td>
                    <td style={style.annotation.thirdCol}><Badge className="text-monospace" variant="info"
                                                                 style={{backgroundColor: annotation.color}}>{annotation.color}</Badge>
                    </td>
                    <td style={style.annotation.fourthCol}>
                        <div className="float-right">
                            <Button size="sm" onClick={e => this._onClickEditAnnotation(annotation)}>
                                <FontAwesomeIcon icon={faPen}/>
                            </Button>
                            <Button size="sm" variant="danger" onClick={e => {
                                this.setState({
                                    annotationIdToBeDeleted: annotation.annotationId
                                });
                            }}>
                                <FontAwesomeIcon icon={faTrash}/>
                            </Button>
                            <ConfirmationDialog
                                show={this.state.annotationIdToBeDeleted === annotation.annotationId}
                                message={"Are you sure you want to delete the Annotation '" + annotation.name + "'?"}
                                onAccept={() => {
                                    this.props.deleteActiveAnnotationSetAnnotation(annotation.annotationId);
                                    this.setState({
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                onCancel={() => {
                                    this.setState({
                                        annotationIdToBeDeleted: undefined
                                    });
                                }}
                                acceptText="Delete"
                                acceptVariant="danger"/>
                        </div>
                    </td>
                </tr>
            })
        };

        return <FetchPending
            isPending={this.props.annotationSet.annotations.isFetching}
            success={this.props.annotationSet.annotations.status === fetchStatusType.success
                        && this.props.annotationSet.annotations.editableAnnotation.status === fetchStatusType.success}
            noSuccessMessage={(this.props.annotationSet.annotations.error && this.props.annotationSet.annotations.error.message) ||
            this.props.annotationSet.annotations.editableAnnotation.error && this.props.annotationSet.annotations.editableAnnotation.error.message
            }
        >
            <Form noValidate validated={this.state.validatedAnnotation}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Color</th>
                            <th scope="col"/>
                        </tr>
                        </thead>
                        <tbody>
                        {renderTableData()}
                        {this.state.createNewAnnotation && renderEditAnnotation()}
                        </tbody>
                    </table>
                </div>
            </Form>
        </FetchPending>
    }

    /**
     * Determine whether the selected AnnotationSet is new or not.
     * @returns {boolean} True if the AnnotationSet is new, otherwise false.
     * @private
     */
    _isNewAnnotationSet() {
        if (!this.props.annotationSet.values)
            return false;
        let id = this.props.annotationSet.values.annotationSetId
        return !id || id <= 0;
    }

    /**
     * Determine whether the selected Annotation is new or not.
     * @returns {boolean} True if the Annotation is new, otherwise false.
     * @private
     */
    _isNewAnnotation() {
        return this.props.editableAnnotationValues.annotationId <= 0;
    }

    /**
     * Handle the abortion of editing the AnnotationSet, by reloading it.
     * @private
     */
    _abortEditAnnotationSet() {
        this.setState({
            validatedBasicInfo: false
        });
        this.props.fetchActiveAnnotationSet();
    }

    /**
     * Render the AnnotationSetDetails view.
     * @returns {*} The view to be rendered.
     */
    render() {
        return (
            <React.Fragment>
                <h2>Edit Annotation Set
                    ({!this._isNewAnnotationSet() ? ("ID: " + this.props.annotationSet.values.annotationSetId) : "New"})</h2>
                <Form noValidate validated={this.state.validatedBasicInfo} onSubmit={this._saveAnnotationSet}>
                    <Card className="mt-3">
                        <Card.Body>
                            <Card.Title>
                                Basic Information
                            </Card.Title>
                            <FetchPending
                                isPending={this.props.annotationSet.isFetching}
                                success={this.props.annotationSet.status === fetchStatusType.success}
                                noSuccessMessage={this.props.annotationSet.error && this.props.annotationSet.error.message}
                            >
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name of the Annotation Set"
                                                  value={this.props.annotationSet.values.name || ''}
                                                  onChange={e => {
                                                      this.props.updateActiveAnnotationSetField('name', e.target.value)
                                                  }}
                                                  name='name' required={true}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control as="textarea" placeholder="Description of the Annotation Set"
                                                  name='description'
                                                  onChange={e => {
                                                      this.props.updateActiveAnnotationSetField('description', e.target.value)
                                                  }}
                                                  value={this.props.annotationSet.values.description || ''}/>
                                </Form.Group>
                                <div className="mt-3">
                                    <Button variant="success" className="mr-1" type="submit">Save</Button>
                                    {!this._isNewAnnotationSet() &&
                                    <Button variant="danger"
                                            onClick={e => this._abortEditAnnotationSet()}>Abort</Button>
                                    }
                                </div>
                            </FetchPending>
                        </Card.Body>
                    </Card>
                </Form>
                {!this._isNewAnnotationSet() &&
                <Card className="mt-3">
                    <Card.Body>
                        <Row>
                            <Col>
                                <Card.Title>
                                    Annotations
                                </Card.Title>
                            </Col>
                            <Col><Button size="sm" className="float-right" onClick={this.addNewAnnotation}>
                                <FontAwesomeIcon icon={faPlus}/> Add</Button>
                            </Col>
                        </Row>
                        {this._renderAnnotationsTable()}
                    </Card.Body>
                </Card>
                }
            </React.Fragment>
        );
    }
}

export default connector(AnnotationSetDetails);
