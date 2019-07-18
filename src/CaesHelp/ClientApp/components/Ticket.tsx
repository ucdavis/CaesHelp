﻿import * as React from "react";
import { ErrorList } from "../components/ErrorList";
import InputArray from "../components/InputArray";

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
    submitting: boolean;
    validState: boolean;
    showErrors: boolean;
    errorArray: [string];
}

export interface ITicketProps {
    appName: string;
    subject: string;
    onlyShowAppSupport: boolean;
    submitterEmail: string;
}


export default class Ticket extends React.Component<ITicketProps, ITicketState> {
    private _formRef: HTMLFormElement;

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
            subject: this.props.subject,
            message: "",
            submitting: false,
            validState: false,
            showErrors: false,
            errorArray: [""]
        };

        this.state = { ...initialState };


    }



    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as any, this._validateState);

        //this.setState(({ [name]: value }) as any); //TODO: Do I need as any here?
        //this._validateState();
    }

    private _validateState = () => {
        let valid = true;
        let errList = [];

        const isValid = this._formRef.checkValidity();
        if (!isValid) {
            valid = false;
            errList.push("One or more fields are invalid");
        }

        if (!this.state.message || !this.state.message.trim()) {
            valid = false;
            errList.push("Message is required.");
        }

        if (!this.state.subject || !this.state.subject.trim()) {
            valid = false;
            errList.push("Subject is required.");
        }


        switch (this.state.supportDepartment) {
            case "Computer Support":
                break;
            case "Web Site Support":
                if (!this.state.forWebSite || !this.state.forWebSite.trim()) {
                    valid = false;
                    errList.push("You must specify the URL for the website.");
                }
                break;
            case "Programming Support":
                if (!this.state.forApplication || !this.state.forApplication) {
                    valid = false;
                    errList.push("For Programming support, you must select an application for this list.");
                }
                break;
            default:
                valid = false;
                errList.push("You must select a Support Department.");
                break;
        }

        this.setState((state => ({
            validState: valid,
            errorArray: errList
        })) as any);


    };

    async handleSubmit(event) {
        this.setState({
            showErrors: true
        });

        this._validateState();

        if (!this.state.validState || this.state.submitting) {
            event.preventDefault();
            return;
        }
        this.setState(state => ({
            submitting: true
        }));

        event.preventDefault();
        const data = new FormData(event.target);
        data.append("files",event.target.files[0]);

        var response = await fetch('/home/submit', {
            method: 'POST',
            body: data,
        });

        if (response.ok) {
            window.location.href = "/";
            return;
        }

        var result = await response.json();
        //TODO: messages where there are errors
    }
    public render() {
        const programmingSupportTitle = "<b>Programming Support:</b> (Scott Kirkland, Ken Taylor, Jason Sylvestre)";
        const webSupportTitle = "<b>Web Site Support:</b> (Calvin Doval, Student Assistants)<br/>";
        const computerSupportTitle = "<b>Computer Support:</b> (Shuka Smith, Steven Barkey, Jacqueline Emerson, Darrell Joe, Student Assistants)<br/>";
        const everyoneTitle = computerSupportTitle + webSupportTitle + programmingSupportTitle;
        const titleToUse = this.props.onlyShowAppSupport ? programmingSupportTitle : everyoneTitle;
        return (
            <div>
                <form onSubmit={this.handleSubmit} action="Submit" method="post" ref={r => this._formRef = r} >
                    <div className="form-group">
                        <label className="control-label">Submitter Email</label>
                        <input type="text" name="phone" className="form-control" value={this.props.submitterEmail} disabled={true} />
                    </div>
                    {this.props.onlyShowAppSupport &&
                        <div>{this.props.appName}</div>
                    }
                    <div className="form-group">
                        <label className="control-label">Urgency <i className="far fa-question-circle" data-toggle="tooltip" data-html="true" data-placement="auto" title="<b>Non-Critical Issue:</b> Annoyances or other low priority requests.<br/><b>Scheduled Requests:</b> Heads up for future action.<br/><b>Workaround Available:</b> Alternative solutions exist to technical problem.<br/><b>Work Stoppages:</b> A technical problem preventing you from getting your job done.<br/><b>Critical:</b> A work stoppage for more than one person."/></label>
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
                        <select name="supportDepartment" className="form-control" value={this.state.supportDepartment} onChange={this.handleInputChange} disabled={this.props.onlyShowAppSupport}>
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
                            <InputArray name="available" placeholder="" addButtonName="Add Additional Dates/Times"/>
                        </div>  
                    }

                    {this.state.supportDepartment === "Web Site Support" &&
                        <div className="form-group">
                            <label className="control-label">For Website <i className="far fa-question-circle"  data-toggle="tooltip" data-html="true" data-placement="auto" title="Copy the URL of the site and paste here. For example:<br/><u>https://www.ucdavis.edu/index.html</u>"/></label>
                            <input required={true} type="text" name="forWebSite" className="form-control" placeholder="https://somesite.example.com" value={this.state.forWebSite} onChange={this.handleInputChange}/>
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
                        <div className="form-group"> {/*TODO: Validation on each one, and pass that back to here?*/}
                            <label className="control-label">Carbon Copies</label>
                                <InputArray name="carbonCopies" placeholder="some@email.com" addButtonName="Add Email"/>
                        </div> 

                        <div className="form-group">
                            <label className="control-label">Attachment</label>
                            <input type="file" name="files" className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label className="control-label">Subject</label>
                            <input required={true} type="text" name="subject" className="form-control" value={this.state.subject} onChange={this.handleInputChange} />
                        </div>   
                        <div className="form-group">
                            <label className="control-label">Message</label>
                            <textarea required={true} name="message" className="form-control" value={this.state.message} onChange={this.handleInputChange}/>
                         </div>   

                        {this.state.showErrors && !this.state.validState && <ErrorList errorArray={this.state.errorArray} />}
                        <div className="form-group">
                            <input disabled={(this.state.showErrors && !this.state.validState) || this.state.submitting} type="submit" name="Submit" className="form-control" />
                        </div>
                    </div>
                    }

                </form>
            </div>
        );
    }
}

