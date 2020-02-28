import React, {Component} from "react";
import CodeMirror from "react-codemirror";
import PropTypes from "prop-types";
import AnnotationPicker from "./AnnotationPicker";

import "./temp-maker.css"

const testvalue = "Killer Bees (2017 film)\n" +
    "From Wikipedia, the free encyclopedia\n" +
    "Jump to navigationJump to search\n" +
    "Killer Bees\n" +
    "Killer Bees 2017 poster.jpg\n" +
    "Directed by\t\n" +
    "Benjamin Cummings\n" +
    "Orson Cummings\n" +
    "Produced by\t\n" +
    "Shaquille O'Neal\n" +
    "Glenn Fuhrman\n" +
    "Larry Gagosian\n" +
    "Hilary McHone\n" +
    "Eric Lane\n" +
    "Mara Burros-Sandler\n" +
    "Music by\tMoses Truzman\n" +
    "Edited by\tAlex Bayer\n" +
    "Release date\n" +
    "October 6, 2017 (Hamptons International Film Festival)[1]\n" +
    "Running time\n" +
    "85 minutes\n" +
    "Country\tUnited States\n" +
    "Language\tEnglish\n" +
    "Killer Bees is an American documentary film directed by Benjamin Cummings & Orson Cummings, and produced by Shaquille O'Neal, Glenn Fuhrman, and Larry Gagosian.[2]\n" +
    "\n" +
    "The film chronicles the Bridgehampton School boys basketball team, nicknamed the Killer Bees, through the 2015-2016 season and ultimately reveals the significant impact of racism, income inequality and gentrification within their community nestled in America’s wealthiest neighborhood: The Hamptons.\n" +
    "\n" +
    "Killer Bees was selected for the 2017 Hamptons International Film Festival[3], Santa Barbara International Film Festival[4], International Sports Film Festival of Ohio[5]. In 2018 the film was selected for the Sarasota Film Festival[6], and the YES Film Festival. The film was awarded the 2018 Jury Prize for Best Documentary at the YES Film Festival [7].\n" +
    "\n" +
    "Killer Bees was named Sports Illustrated’s Best Sports Documentaries of 2017 [8] and a New York Times Critic’s Pick [9] in 2018 after opening in select theaters in Los Angeles and New York City on July 27, 2018[10].\n" +
    "\n" +
    "Killer Bees has been streamed on Amazon, Hulu, Google Play and iTunes[11]\n" +
    "\n" +
    "\n" +
    "Contents\n" +
    "1\tPremise\n" +
    "2\tAppearances\n" +
    "3\tReferences\n" +
    "4\tExternal links\n" +
    "Premise\n" +
    "Filmmaker brothers Ben and Orson Cummings document the 2015-2016 season of the Bridgehampton School boys basketball team, locally referred to as the Killer Bees. The film reveals the real life story of hope and hardship within the community.\n" +
    "\n" +
    "Appearances\n" +
    "Carl Johnson (Killer Bees coach, 2016)\n" +
    "Joe Zucker (Killer Bees Assistant coach, 2016)\n" +
    "Joshua Lamison (Killer Bees senior, 2016)\n" +
    "Tylik Furman (Killer Bees senior, 2016)\n" +
    "Matthew Hostetter (Killer Bees senior, 2016)\n" +
    "Jamari Gant (Killer Bees senior, 2016)\n" +
    "Elijah Jackson (Killer Bees junior, 2016)\n" +
    "JP Harding (Killer Bees Freshman, 2016)\n" +
    "Dr. Robert North (Activist and organizer)\n" +
    "Paul Jeffers Jr. (Chairman of the Board, Bridgehampton Child Care & Recreational Center)\n" +
    "Louis Myrick (Former Killer Bees, class of ‘98)\n" +
    "Julian Johnson (Former Killer Bees player)\n" +
    "Vincent Horcasitas (Hamptons real estate broker)\n" +
    "References\n" +
    " \"'Killer Bees' Documentary Premieres At Hamptons International Film Festival - Bridgehampton\". 27east.com. Retrieved 30 November 2018.\n" +
    " \"Oscars: Shaq Enters the Race With Basketball Doc 'Killer Bees' (Exclusive)\". hollywoodreporter.com. The Hollywood Reporter. 19 October 2018.\n" +
    " \"Bees Doc to Premiere at Hamptons Film Fest - The East Hampton Star\". easthamptonstar.com. Retrieved 30 November 2018.\n" +
    " \"SBIFF's Sporty Side\". www.independent.com. Retrieved 30 November 2018.\n" +
    " \"Killer Bees (2017)\". isffohio.org. 3 March 2018. Retrieved 30 November 2018.\n" +
    " \"Tickets. Events. Elevated - elevent\". www.goelevent.com. Retrieved 30 November 2018.\n" +
    " Blair, Brian. \"Yes Film Festival jury prize winners named\". therepublic.com. Retrieved 30 November 2018.\n" +
    " \"These are the best sports documentaries of 2017\". si.com. Retrieved 30 November 2018.\n" +
    " \"Review: 'Killer Bees' Tracks Working-Class Athletes in the Hamptons\". nytimes.com. Retrieved 30 November 2018.\n" +
    " https://projects.newsday.com/entertainment/killer-bees-bridgehampton-documentary/\n" +
    " Streaming services:\n" +
    "\"Killer Bees\". Amazon. Retrieved 30 November 2018.\n" +
    "\"Watch Killer Bees Online at Hulu\". Retrieved 30 November 2018 – via Hulu.\n" +
    "\"Killer Bees - Movies & TV on Google Play\". Google Play. Retrieved 30 November 2018.\n" +
    "\"Killer Bees on iTunes\". iTunes. 7 August 2018. Retrieved 30 November 2018.\n" +
    "External links\n" +
    "Killer Bees on IMDb\n" +
    "Stub icon\tThis article about a documentary film is a stub. You can help Wikipedia by expanding it.\n"

const initialState = {
    text: testvalue,
    timerId: undefined,
    aceEditor: undefined,
    textSelected: false,
    markers: []
};

class AnnotationEditor extends Component {

    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
    }

    render() {
        return (
            <React.Fragment>
                <div className="editor">
                    <CodeMirror value={this.state.text}
                                options={{
                                    lineNumbers: true,
                                    readOnly: true,
                                    lineWrapping: true
                                }}
                    />
                </div>
            </React.Fragment>
        );
    }


}

AnnotationEditor.propTypes = {
    timerIntervalMSec: PropTypes.number,
    autoSave: PropTypes.bool,
    onSave: PropTypes.func,
    annotations: PropTypes.any
};

export default AnnotationEditor;
