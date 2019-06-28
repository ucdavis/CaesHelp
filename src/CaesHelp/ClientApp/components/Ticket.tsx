import * as React from "react";
import * as ReactDOM from "react-dom";

interface ITicketState {
    urgencyLevel: string;
    supportDepartment: string;
    phone: string;
}

export interface ITicketProps {
    appName: string;
    subject: string;
    onlyShowAppSupport: boolean;
}


export default class Ticket extends React.Component<ITicketProps, ITicketState> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const initialState: ITicketState = {
            urgencyLevel: "",
            supportDepartment: this.props.onlyShowAppSupport ? "Programming Support" : "",
            phone: "",
        };

        this.state = { ...initialState };


    }



    handleChange(event) {
        this.setState({ supportDepartment: event.target.value });
    }

    handleSubmit(event) {
        alert('Choice was: ' + this.state.supportDepartment);
        event.preventDefault();
    }
    public render() {
        const programmingSupportTitle = "<b>Programming Support:</b> (Scott Kirkland, Ken Taylor, Jason Sylvestre)";
        const webSupportTitle = "<b>Web Site Support:</b> (Calvin Doval, Student Assistants)<br/>";
        const computerSupportTitle = "<b>Computer Support:</b> (Shuka Smith, Steven Barkey, Jacqueline Emerson, Darrell Joe, Student Assistants)<br/>";
        const everyoneTitle = computerSupportTitle + webSupportTitle + programmingSupportTitle;
        const titleToUse = this.props.onlyShowAppSupport ? programmingSupportTitle : everyoneTitle;
        return(
            <form onSubmit={this.handleSubmit}>
                {this.props.onlyShowAppSupport &&
                    <div>{this.props.appName}</div>
                }
                <div className="form-group">
                    <label className="control-label">Urgency <i className="far fa-question-circle"  data-toggle="tooltip" data-html="true" data-placement="auto" title="<div><b>Non-Critical Issue:</b> Annoyances or other low priority requests.<br/><b>Scheduled Requests:</b> Heads up for future action.<br/><b>Workaround Available:</b> Alternative solutions exist to technical problem.<br/><b>Work Stoppages:</b> A technical problem preventing you from getting your job done.<br/><b>Critical:</b> A work stoppage for more than one person.</div>"/></label>
                    <select name="UrgencyLevel" className="form-control">
                        <option value="Non-Critical Issue">Non-Critical Issue</option>
                        <option value="Scheduled Requests">Scheduled Requests</option>
                        <option value="Workaround Available">Workaround Available</option>
                        <option value="Work Stoppage">Work Stoppage</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="control-label">Support Department <i className="far fa-question-circle" data-toggle="tooltip" data-html="true" data-placement="auto" title={titleToUse}/></label>
                    <select name="SupportDepartment" className="form-control" value={this.state.supportDepartment} onChange={this.handleChange} disabled={this.props.onlyShowAppSupport} >
                        <option value="">--Select a Support Department--</option>
                        <option value="Computer Support">Computer Support</option>
                        <option value="Web Site Support">Web Site Support</option>
                        <option value="Programming Support">Programming Support</option>
                    </select>
                </div>
                {this.state.supportDepartment !==  "" &&
                    <div>
                    
                {this.state.supportDepartment === "Computer Support" &&
                    <div>
                    <div className="form-group">
                            <label className="control-label">Your Phone Number <i className="far fa-question-circle" data-toggle="tooltip" data-placement="auto" title="Call back phone number so we can contact you directly." /></label>
                        <input type="text" name="Phone" className="form-control" />
                    </div>
                    <div className="form-group">
                            <label className="control-label">Location <i className="far fa-question-circle" data-toggle="tooltip" data-placement="auto" title="The location of the problem in case we need to physically investigate." /></label>
                        <input type="text" name="Location" className="form-control" />
                    </div>
                    </div>
                }
                {this.state.supportDepartment === "Web Site Support" || this.state.supportDepartment === "Computer Support" &&
                    <div className="form-group"> {/*TODO: Replace with multiples*/}
                        <label className="control-label">Available Dates and Times</label>
                        <input type="text" name="Available" className="form-control" />
                    </div>  
                }

                {this.state.supportDepartment === "Web Site Support" &&
                    <div className="form-group">
                        <label className="control-label">For Website <i className="far fa-question-circle"  data-toggle="tooltip" data-html="true" data-placement="auto" title="Copy the URL of the site and paste here. For example:<br/><u>https://www.ucdavis.edu/index.html</u>"/></label>
                        <input type="text" name="ForWebSite" className="form-control" placeholder="https://somesite.example.com"/>
                    </div>
                }
                    {this.state.supportDepartment === "Programming Support" &&
                        <div className="form-group">
                        <label className="control-label">For Application</label>
                        <select name="ForApplication" className="form-control">
                            <option value="">--Select a Program--</option>
                            <option value="Academic Course Evaluations">Academic Course Evaluations</option>
                            <option value="AD419">AD419</option>
                            <option value="CatBert">CatBert</option>
                            <option value="Commencement">Commencement</option>
                            <option value="Conference Registration And Payments">Conference Registration And Payments</option>
                            <option value="Dogbert">Dogbert</option>
                            <option value="Eat Fit">Eat Fit</option>
                            <option value="Eligibility List">Eligibility List</option>
                            <option value="Employee Salary Review Analysis">Employee Salary Review Analysis</option>
                            <option value="FSNEP Records">FSNEP Records</option>
                            <option value="Grants Management">Grants Management</option>
                            <option value="Messaging and Appointment System">Messaging and Appointment System</option>
                            <option value="Payments">Payments</option>
                            <option value="Peaks">Peaks</option>
                            <option value="PrePurchasing">PrePurchasing</option>
                            <option value="PTF">PTF</option>
                            <option value="Recruitment">Recruitment</option>
                            <option value="Student Information Management System">Student Information Management System</option>
                            <option value="Subject To Dismissal">Subject To Dismissal</option>
                            <option value="TPS3">TPS3</option>
                        </select>
                        </div>
                    }
                <div className="form-group"> {/*TODO: Replace with multiples*/}
                    <label className="control-label">Carbon Copies</label>
                    <input type="text" name="Available" className="form-control" />
                </div> 
                //TODO: Attachment
                <div className="form-group">
                    <label className="control-label">Subject</label>
                    <input type="text" name="Subject" className="form-control" />
                </div>   
                <div className="form-group">
                    <label className="control-label">Message</label>
                    <textarea name="Message" className="form-control" />
                </div>   
                <div className="form-group">
                    <input type="submit" name="Submit" className="form-control" />
                    </div>   
                </div>
                }

            </form>
        );
    }
}

