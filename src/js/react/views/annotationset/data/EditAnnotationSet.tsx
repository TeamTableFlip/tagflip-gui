import React, {FunctionComponent, useEffect, useState} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCog} from '@fortawesome/free-solid-svg-icons'
import {RootState} from "../../../../redux/reducers/Reducers";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import FormSideInfo from "../../../components/FormSideInfo";
import EditAnnotation from "./EditAnnotation";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import Tab from "react-bootstrap/Tab";
import AnnotationSetSettings from "./AnnotationSetSettings";

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
const EditAnnotationSet: FunctionComponent<Props> = (props) => {
    const [activeTab, setActiveTab] = useState("annotations")

    const isNewAnnotationSet = () => {
        return props.annotationSet.values.annotationSetId <= 0
    }

    useEffect(() => {
        props.fetchActiveAnnotationSetAnnotations();
    }, [])

    return (
        <div className="d-block w-100 h-100">
            <h2 className="h4">
                {`${props.annotationSet.values.name} (ID: ${props.annotationSet.values.annotationSetId})`}
            </h2>
            <p className="text-secondary font-weight-light">
                {`${props.annotationSet.values.description ? props.annotationSet.values.description : "No Description"}`}
            </p>
            <Tabs id="annotation-tabs"
                  activeKey={activeTab}
                  onSelect={setActiveTab}
            >
                <Tab eventKey="annotations" title="Annotations" className="p-3">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <EditAnnotation
                                    onSave={(annotation) => props.saveActiveAnnotationSetAnnotation(annotation)}
                                    annotations={props.annotationSet.annotations.items}
                                    onDelete={(annotation) => props.deleteActiveAnnotationSetAnnotation(annotation.annotationId)}/>
                            </Col>
                            <Col xs lg="3" className="mt-5">
                                <FormSideInfo
                                    text="An Annotation Set consits of Annotations which can be managed here."/>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
                <Tab eventKey="settings" title={<><FontAwesomeIcon icon={faCog}/> Settings</>} className="p-3">
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <AnnotationSetSettings />
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some Basic Information about the Annotation Set. Your Annotation Set requires at least a name."/>
                            </Col>
                        </Row>
                    </Container>
                </Tab>
            </Tabs>

        </div>
    )
}

export default connector(EditAnnotationSet);
