import React, {FunctionComponent, useEffect} from "react";
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
import AnnotationSetSettings from "./AnnotationSetSettings";
import {RouteComponentProps, withRouter} from "react-router-dom";

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


type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & RouteComponentProps & {
    annotationSet: AnnotationSet,
    changePageOnSave: boolean
};

/**
 * The view for creating and updating single AnnotationSets with their list of Annotations.
 */
const NewAnnotationSet: FunctionComponent<Props> = (props) => {

    const isNewAnnotationSet = () => {
        return props.annotationSet.values.annotationSetId <= 0
    }

    useEffect(() => {
        props.setActiveAnnotationSet(AnnotationSet.create());
    }, []);

    return (
        <Container>
            <Row className="d-flex align-items-center">
                <Col>
                    <h2 className="h4">New Annotation Set</h2>
                </Col>
                <Col xs lg="3"/>
            </Row>
            <Row className="d-flex align-items-center">
                <Col>
                    <AnnotationSetSettings />
                </Col>
                <Col xs lg="3">
                    <FormSideInfo
                        text="Give some Basic Information about the Annotation Set. Your Annotation Set requires at least a name."/>
                    {
                        isNewAnnotationSet() && (
                            <FormSideInfo title=""
                                          text="Right after saving this step, you will be able to add Annotations to the set."/>
                        )}
                </Col>
            </Row>
        </Container>

    )

}

export default withRouter(connector(NewAnnotationSet));
