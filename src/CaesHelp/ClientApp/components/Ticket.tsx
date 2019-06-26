import * as React from "react";
import * as ReactDOM from "react-dom";


export default class Ticket extends React.Component {
    constructor(props) {
        super(props);
    }

    public  render() {
        return(
            <div>
                <div className="form-group">
                    <label className="control-label">Urgency</label>
                    <select name="UrgencyLevel" className="form-control">
                        <option value="Non-Critical Issue">Non-Critical Issue</option>
                        <option value="Scheduled Requests">Scheduled Requests</option>
                        <option value="Workaround Available">Workaround Available</option>
                        <option value="Work Stoppage">Work Stoppage</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="control-label">Subject</label>
                    <input type="text" name="Subject" className="form-control"/>
                </div>    
            </div>
        );
    }
}