import * as React from "react";
import ErrorList from "../components/ErrorList";
import InputArray from "../components/InputArray";
import validateEmail  from "../util/email";
import Dropzone from 'react-dropzone';

interface ITicketState {
    urgencyLevel: string;
    supportDepartment: string;
    phone: string;
    location: string;
    forWebSite: string;
    forApplication: string;
    subject: string;
    message: string;
    submitting: boolean;
    validState: boolean;
    showErrors: boolean;
    errorArray: [string];
    availableInputs: [{value: string, isValid: boolean}];
    emailInputs: [{ value: string, isValid: boolean }];
    file: { name: string, size: number };
}

export interface ITicketProps {
    appName: string;
    subject: string;
    onlyShowAppSupport: boolean;
    submitterEmail: string;
    antiForgeryToken: string;
}


export default class Ticket extends React.Component<ITicketProps, ITicketState> {
    private _formRef: HTMLFormElement;


    constructor(props) {
        super(props);

        const initialState: ITicketState = {
            urgencyLevel: "Non-Critical Issue",
            supportDepartment: this.props.onlyShowAppSupport ? "Programming Support" : "",
            phone: "",
            location: "",
            forWebSite: "",
            forApplication: this.props.appName != null ? this.props.appName : "",
            subject: this.props.subject != null ? this.props.subject : "",
            message: "",
            submitting: false,
            validState: false,
            showErrors: false,
            errorArray: [""],
            availableInputs: [{ value: "", isValid: true }],
            emailInputs: [{ value: "", isValid: true }],
            file: { name: "", size: 0 },
        };

        this.state = { ...initialState };

    }



    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as any, this._validateState);

    }

    handleAddAvailableInput = () => {
        this.setState(({
            availableInputs: this.state.availableInputs.concat([{ value: "", isValid: true }])
        }) as any);
    };

    handleRemoveAvailableInput = (idx: any) => {
        this.setState(({
            availableInputs: this.state.availableInputs.filter((s, sidx) => idx !== sidx)
        }) as any);
    };

    handleRemoveEmailInput = (idx: any) => {
        this.setState(({
            emailInputs: this.state.emailInputs.filter((s, sidx) => idx !== sidx)
        }) as any, this._validateState);
    };

    handleAddEmailInput = () => {
        this.setState(({
            emailInputs: this.state.emailInputs.concat([{ value: "", isValid: true }])
        }) as any);
    };

    handleEmailChange = (idx: any, evt: any) => {

        const newValues = this.state.emailInputs.map((input, sidx) => {
            if (idx !== sidx) return input;
            return { ...input, value: evt.target.value.trim(), isValid: validateEmail(evt.target.value) };
        });

        this.setState(({ emailInputs: newValues }) as any, this._validateState);
    };

    handleAvailableChange = (idx: any, evt: any) => {

        const newValues = this.state.availableInputs.map((input, sidx) => {
            if (idx !== sidx) return input;
            return { ...input, value: evt.target.value, isValid: true };
        });

        this.setState(({ availableInputs: newValues }) as any);
    };

    handleFileUpload = (acceptedFiles: File[]) => {
        this.setState(({ file: { name: acceptedFiles[0].name, size: acceptedFiles[0].size } }), this._validateState);
    };


    private _validateState = () => {
        const maxFileSize = 6000000;  //6 MB
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

        let emails = this.state.emailInputs.filter(function(cc) {
            return cc.isValid === false;
        });
        if (emails.length > 0) {
            valid = false;
            errList.push(`${emails.length} Carbon Copy ${emails.length <= 1 ? "Email is" :"Emails are"} invalid.`);
        }

        if (this.state.file && this.state.file.name && this.state.file.size > maxFileSize) {
            valid = false;
            errList.push("Your attachment is too big.");
        }


        switch (this.state.supportDepartment) {
            case "Computer Support":
                break;
            case "Web Site Support":
                if (!this.state.forWebSite || !this.state.forWebSite.trim()) {
                    valid = false;
                    errList.push("You must specify the URL for the website.");
                }
                if (this.state.forWebSite &&
                    this.state.forWebSite.toLowerCase().indexOf("registration.ucdavis.edu") >= 0) {
                    valid = false;
                    errList.push("The registration.ucdavis.edu website is managed by Programming Support. Please change the Support Department.");
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

    private _makeClassName = (prefix, postfix) => {
        return `${prefix}-${postfix.toLowerCase().replace(" ", "-")}`;
    };

    handleSubmit = async (event) => {
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
        data.append("files", event.target.files[0]);

        var response = await fetch('/home/index', {
            method: 'POST',
            body: data,
            headers: [["RequestVerificationToken", this.props.antiForgeryToken]]
        });
        var result = await response.json();

        if (response.ok) {
            if (result.success) {
                alert(result.message);
                window.location.href = "/";
                return;
            } else {
                alert(result.message);
                this.setState(state => ({
                    submitting: false
                }));
            }

        } else {
            alert("There was an error, please try again.");
            this.setState(state => ({
                submitting: false
            }));
        }

        //TODO: Dialog instead of Alert? Would need to figure out how to get the window.location to work with that.
    }
    public render() {
        const programmingSupportTitle = "<b>Programming Support:</b> (Scott Kirkland, Ken Taylor, Jason Sylvestre)";
        const webSupportTitle = "<b>Web Site Support:</b> (Calvin Doval, Student Assistants)<br/>";
        const computerSupportTitle = "<b>Computer Support:</b> (Shuka Smith, Steven Barkey, Jacqueline Emerson, Darrell Joe, Student Assistants)<br/>";
        const everyoneTitle = computerSupportTitle + webSupportTitle + programmingSupportTitle;
        const titleToUse = this.props.onlyShowAppSupport ? programmingSupportTitle : everyoneTitle;
        return (
            <div>
              <h3>Ticket Information</h3>
              <p>Hail friend, please use the below forms to seek help with your College of Agricultural and Environmental Sciences Dean’s Office Computer Resources Unit question. </p>

                <form onSubmit={this.handleSubmit} action="Submit" method="post" ref={r => this._formRef = r}>
                    <div className="form-group">
                        <label className="control-label">Submitter Email</label>
                        <input type="text" name="submitter-email" className="form-control" value={this.props.submitterEmail} disabled={true}/>
                    </div>
                    {this.props.onlyShowAppSupport &&
                        <div>{this.props.appName}</div>
                    }
                    <div className="form-group">
                        <label className="control-label">Urgency <i className="far fa-question-circle" data-toggle="tooltip" data-html="true" data-placement="auto" title="<b>Non-Critical Issue:</b> Annoyances or other low priority requests.<br/><b>Scheduled Requests:</b> Heads up for future action.<br/><b>Workaround Available:</b> Alternative solutions exist to technical problem.<br/><b>Work Stoppages:</b> A technical problem preventing you from getting your job done.<br/><b>Critical:</b> A work stoppage for more than one person."/></label>
                        <select name="urgencyLevel" className={`form-control ${this._makeClassName("color",this.state.urgencyLevel)}`} value={this.state.urgencyLevel} onChange={this.handleInputChange}>
                            <option className="noncrit" value="Non-Critical Issue">Non-Critical Issue</option>
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
                    {!!this.state.supportDepartment &&
                        <div>
                        {this.state.supportDepartment === "Computer Support" &&
                            <div>
                            <div className="form-group">
                                    <label className="control-label">Your Phone Number <i className="far fa-question-circle" data-toggle="tooltip" data-placement="auto" title="Call back phone number so we can contact you directly." /></label>
                                    <input type="text" name="phone" className="form-control" value={this.state.phone} onChange={this.handleInputChange} />


                            </div>
                            <div className="form-group">
                                    <label className="control-label">Location <i className="far fa-question-circle" data-toggle="tooltip" data-placement="auto" title="The location of the problem in case we need to physically investigate." /></label>
                                    <input type="text" name="location" className="form-control" value={this.state.location} onChange={this.handleInputChange}/>
                            </div>
                            </div>
                        }
                        {this.state.supportDepartment === "Web Site Support" || this.state.supportDepartment === "Computer Support" &&
                            <div className="form-group">
                                <label className="control-label">Available Dates and Times</label>
                                <InputArray name="available" placeholder="" addButtonName="Add Additional Dates/Times" inputs={this.state.availableInputs} handleAddInput={this.handleAddAvailableInput} handleRemoveInput={this.handleRemoveAvailableInput} handleChange={this.handleAvailableChange}/>
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
                                <option value="Registration">Registration</option>
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
                                <option value="Tacos">Tacos</option>
                            </select>
                            </div>
                        }
                        <div className="form-group">
                            <label className="control-label">Should anyone else know?</label>
                            <InputArray name="carbonCopies" placeholder="some@email.com" addButtonName="Add Email" inputs={this.state.emailInputs} handleAddInput={this.handleAddEmailInput} handleRemoveInput={this.handleRemoveEmailInput} handleChange={this.handleEmailChange}/>
                        </div>


                        <div className="form-group">
                            <label className="control-label">Attachment</label>
                            <Dropzone onDrop={acceptedFiles => this.handleFileUpload(acceptedFiles)}>
                                {({ getRootProps, getInputProps }) => (
                                <div className="border border-secondary">
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} className="form-control" name="files"/>
                                            <div className='d-flex justify-content-center align-items-center'>
                                                <i className='fas fa-upload fa-2x mr-4' />
                                                <div className='d-flex flex-column align-items-center'>
                                                    <span>Drop file to attach, or click to Browse.</span>

                                                    <span>(Individual file upload size limit 5 MB)</span>
                                                </div>
                                            </div>
                                    </div>
                                </div>
                            )}
                            </Dropzone>
                            {this.state.file.name &&
                                <small className="form-text">File Name: {this.state.file.name}</small>
                            }
                        </div>
                        <div className="form-group">
                            <label className="control-label">Subject</label>
                            <input required={true} type="text" name="subject" className="form-control" value={this.state.subject} onChange={this.handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label className="control-label">Message</label>
                            <textarea required={true} name="message" className="form-control" value={this.state.message} onChange={this.handleInputChange}/>
                        </div>

                        {this.state.showErrors && !this.state.validState && <ErrorList errorArray={this.state.errorArray} />}
                        <div className="form-group">
                            <input disabled={(this.state.showErrors && !this.state.validState) || this.state.submitting} type="submit" name="Submit" className="form-control"/>
                            {this.state.submitting && <div className="text-center"><i className="fas fa-sync fa-spin"></i> Submitting... Please wait. If you have uploaded an attachment, this may take a minute.</div>}
                        </div>
                    </div>
                    }

                </form>
            </div>
        );
    }
}
