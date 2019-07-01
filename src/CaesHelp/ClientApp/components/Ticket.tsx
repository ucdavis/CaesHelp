﻿import * as React from "react";
import * as ReactDOM from "react-dom";

interface ITicketState {
    urgencyLevel: string;
    supportDepartment: string;
    phone: string;
    location: string;
    available: string; //TODO: Replace this with array control thing
    carbonCopies: string; //TODO: Replace this with array control thing
    forWebSite: string;
    forApplication: string;
    subject: string;
    message: string;
    error: string;
    submitting: boolean;
    validState: boolean;
}

export interface ITicketProps {
    appName: string;
    subject: string;
    onlyShowAppSupport: boolean;
}


export default class Ticket extends React.Component<ITicketProps, ITicketState> {
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const initialState: ITicketState = {
            urgencyLevel: "Non-Critical Issue",
            supportDepartment: this.props.onlyShowAppSupport ? "Programming Support" : "",
            phone: "",
            location: "",
            available: "", //TODO: Replace
            carbonCopies: "", //TODO:Replace
            forWebSite: "",
            forApplication: "",
            subject: "", //TODO: Check if passed parameter
            message: "",
            error: "Some Fake Error",
            submitting: false,
            validState: false
    };

        this.state = { ...initialState };


    }



    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState(({[name]: value}) as any); //TODO: Do I need as any here?
    }

    handleSubmit(event) {
        alert('Choice was: ' + this.state.supportDepartment);
        event.preventDefault();

        //event.preventDefault();
        //const data = new FormData(event.target);

        //fetch('/api/form-submit-url', {
        //    method: 'POST',
        //    body: data,
        //});
    }
    public render() {
        const programmingSupportTitle = "<b>Programming Support:</b> (Scott Kirkland, Ken Taylor, Jason Sylvestre)";
        const webSupportTitle = "<b>Web Site Support:</b> (Calvin Doval, Student Assistants)<br/>";
        const computerSupportTitle = "<b>Computer Support:</b> (Shuka Smith, Steven Barkey, Jacqueline Emerson, Darrell Joe, Student Assistants)<br/>";
        const everyoneTitle = computerSupportTitle + webSupportTitle + programmingSupportTitle;
        const titleToUse = this.props.onlyShowAppSupport ? programmingSupportTitle : everyoneTitle;
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {this.props.onlyShowAppSupport &&
                        <div>{this.props.appName}</div>
                    }
                    <div className="form-group">
                        <label className="control-label">Urgency <i className="far fa-question-circle"  data-toggle="tooltip" data-html="true" data-placement="auto" title="<div><b>Non-Critical Issue:</b> Annoyances or other low priority requests.<br/><b>Scheduled Requests:</b> Heads up for future action.<br/><b>Workaround Available:</b> Alternative solutions exist to technical problem.<br/><b>Work Stoppages:</b> A technical problem preventing you from getting your job done.<br/><b>Critical:</b> A work stoppage for more than one person.</div>"/></label>
                        <select name="urgencyLevel" className="form-control" value={this.state.urgencyLevel} onChange={this.handleInputChange}>
                            <option value="Non-Critical Issue">Non-Critical Issue</option>
                            <option value="Scheduled Requests">Scheduled Requests</option>
                            <option value="Workaround Available">Workaround Available</option>
                            <option value="Work Stoppage">Work Stoppage</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="control-label">Support Department <i className="far fa-question-circle" data-toggle="tooltip" data-html="true" data-placement="auto" title={titleToUse}/></label>
                        <select name="supportDepartment" className="form-control" value={this.state.supportDepartment} onChange={this.handleInputChange} disabled={this.props.onlyShowAppSupport} >
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
                                <input type="text" name="phone" className="form-control" value={this.state.phone} onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                                <label className="control-label">Location <i className="far fa-question-circle" data-toggle="tooltip" data-placement="auto" title="The location of the problem in case we need to physically investigate." /></label>
                                <input type="text" name="location" className="form-control" value={this.state.location} onChange={this.handleInputChange}/>
                        </div>
                        </div>
                    }
                    {this.state.supportDepartment === "Web Site Support" || this.state.supportDepartment === "Computer Support" &&
                        <div className="form-group"> {/*TODO: Replace with multiples*/}
                            <label className="control-label">Available Dates and Times</label>
                            <input type="text" name="available" className="form-control" value={this.state.available} onChange={this.handleInputChange}/>
                        </div>  
                    }

                    {this.state.supportDepartment === "Web Site Support" &&
                        <div className="form-group">
                            <label className="control-label">For Website <i className="far fa-question-circle"  data-toggle="tooltip" data-html="true" data-placement="auto" title="Copy the URL of the site and paste here. For example:<br/><u>https://www.ucdavis.edu/index.html</u>"/></label>
                            <input type="text" name="forWebSite" className="form-control" placeholder="https://somesite.example.com" value={this.state.forWebSite} onChange={this.handleInputChange}/>
                        </div>
                    }
                        {this.state.supportDepartment === "Programming Support" &&
                            <div className="form-group">
                            <label className="control-label">For Application</label>
                            <select name="forApplication" className="form-control" value={this.state.forApplication} onChange={this.handleInputChange}>
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
                            <input type="text" name="carbonCopies" className="form-control" value={this.state.carbonCopies} onChange={this.handleInputChange}/>
                    </div> 
                    //TODO: Attachment
                    <div className="form-group">
                        <label className="control-label">Subject</label>
                            <input type="text" name="subject" className="form-control" value={this.state.subject} onChange={this.handleInputChange} />
                    </div>   
                    <div className="form-group">
                        <label className="control-label">Message</label>
                            <textarea name="message" className="form-control" value={this.state.message} onChange={this.handleInputChange}/>
                        </div>   
                    <div className="validation-summary-errors">{this.state.error}</div>
                    <div className="form-group">
                                <input disabled={!this.state.validState || this.state.submitting} type="submit" name="Submit" className="form-control" />
                        </div>   
                    </div>
                    }

                    </form>
            </div>
        );
    }
}

