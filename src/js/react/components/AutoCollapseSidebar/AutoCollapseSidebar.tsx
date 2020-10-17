import React, {FunctionComponent, useEffect, useRef, useState} from "react";
import {ProSidebar} from 'react-pro-sidebar';
import "./AutoCollapseSidebar.scss"
import {CSSTransition, SwitchTransition} from 'react-transition-group';

interface Props {
    animateTransition?: boolean
    className?: string
}


export const AutoCollapseSidebar: FunctionComponent<Props> = (props) => {
    // const [collapse, setCollapse] = useState(false);
    const [fadeStart, setFadeStart] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        setFadeStart(true)
    }, [])
    const {children, className} = {...props};
    return (

        // <CSSTransition in={fadeStart} classNames={props.animateTransition ? "bar" : ""} unmountOnExit>
            <ProSidebar ref={ref} className={className}>
                {children}
            </ProSidebar>
        // </CSSTransition>
    )
}

