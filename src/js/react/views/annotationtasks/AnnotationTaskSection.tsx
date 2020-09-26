import React, {FunctionComponent} from "react";
import {Route, RouteComponentProps, useRouteMatch, withRouter} from "react-router-dom";
import {AnnotationTaskOverview} from "./AnnotationTaskOverview";
import FormAnnotationTask from "./data/FormAnnotationTask";
import AnnotationTaskEditor from "./data/edit/AnnotationTaskEditor";


interface State {
    activeLink: string
}

type Props = RouteComponentProps;


/**
 * The Settings view containing Routes for Corpus- and Annotation-Setup.
 */
export const AnnotationTaskSection: FunctionComponent<Props> = (props) => {
    const match = useRouteMatch();

    /**
     * Render the Settings view.
     * @returns {*} The component to be rendered.
     */
    return (
        <>
            <section id="content">
                <Route exact={true} path={`${match.path}`}>
                    <AnnotationTaskOverview/>
                </Route>
                <Route exact={true} path={`${match.path}/new`}>
                    <FormAnnotationTask new={true}/>
                </Route>
                <Route exact={true} path={`${match.path}/edit`}>
                    <FormAnnotationTask />
                </Route>
                <Route exact={true} path={`${match.path}/edit/editor`}>
                    <AnnotationTaskEditor />
                </Route>
            </section>
        </>
    );
}

export default withRouter(AnnotationTaskSection);
