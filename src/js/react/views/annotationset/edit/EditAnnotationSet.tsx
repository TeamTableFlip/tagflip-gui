import React, {FunctionComponent} from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {bindActionCreators} from "redux";
import {ActionCreators} from "../../../../redux/actions/ActionCreators";
import {connect, ConnectedProps} from "react-redux";
import {RootState} from "../../../../redux/reducers/Reducers";
import AnnotationSet from "../../../../backend/model/AnnotationSet";
import {Container} from "react-bootstrap";
import FormSideInfo from "../../../components/FormSideInfo";
import AnnotationSetFormProvider from "./AnnotationSetFormProvider";
import EditAnnotation from "./EditAnnotation";

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

    const isNewAnnotationSet = () => {
        return props.annotationSet.values.annotationSetId <= 0
    }

    return (
        <AnnotationSetFormProvider>
            {
                (annotationSetFormRenderProps) => (
                    <Container>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <h2 className="h4 text-center">Edit Annotation Set
                                    ({!isNewAnnotationSet() ? ("ID: " + props.annotationSet.values.annotationSetId) : "New"})</h2>
                            </Col>
                            <Col xs lg="3"/>
                        </Row>
                        <Row className="d-flex align-items-center">
                            <Col>
                                <Card className="w-100">
                                    <Card.Body>
                                        <Card.Title>
                                            Basic Information
                                        </Card.Title>
                                        {annotationSetFormRenderProps.basicDataForm.form}
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-end">
                                        {annotationSetFormRenderProps.basicDataForm.buttons}
                                    </Card.Footer>
                                </Card>
                            </Col>
                            <Col xs lg="3">
                                <FormSideInfo
                                    text="Give some Basic Information about the Annotation Set. Your Annotation Set requires at least a name."/>
                                {
                                    isNewAnnotationSet() && (
                                        <FormSideInfo title=""
                                                      text="Right after saving this step, you will be able define Annotations as part of this Annotation Set."/>
                                    )}
                            </Col>
                        </Row>
                        {
                            !isNewAnnotationSet() && (
                                <Row className="d-flex align-items-start mt-2">
                                    <Col>
                                        <EditAnnotation />
                                    </Col>
                                    <Col xs lg="3" className="mt-5">
                                        <FormSideInfo
                                            text="Here you can define the Annotations as part of the Annotation Set."/>
                                        {
                                            isNewAnnotationSet() && (
                                                <FormSideInfo title=""
                                                              text="Right after saving this step, you will be able define Annotations as part of this Annotation Set."/>
                                            )}
                                    </Col>
                                </Row>
                            )
                        }

                    </Container>
                )
            }
        </AnnotationSetFormProvider>
    )

}

export default connector(EditAnnotationSet);
