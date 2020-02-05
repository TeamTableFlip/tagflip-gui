import React, {Component} from "react";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Nav from "react-bootstrap/Nav";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CorporaList from "./corpora/CorporaList";
import CorpusDetails from "./corpora/CorpusDetails";

class Configuration extends Component {

    render() {
        return (
            <React.Fragment>
                <div class="leftNav">
                    <Nav variant="pills" activeKey="1" className="mt-4 flex-column">
                        <Nav.Link eventKey="1">Corpora</Nav.Link>
                        <Nav.Link>Annotations</Nav.Link>
                    </Nav>
                </div>
                <div class="content">

                    <CorpusDetails />
                    {/*<CorporaList />*/}
                </div>
            </React.Fragment>
        );
    }
}

export default Configuration;