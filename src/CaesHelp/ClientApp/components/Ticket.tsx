import * as React from "react";
import * as ReactDOM from "react-dom";

interface ITicketState {
    urgencyLevel: string;
    supportDepartment: string;
    phone: string;
}


export default class Ticket extends React.Component<{}, ITicketState> {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        const initialState: ITicketState = {
            urgencyLevel: "",
            supportDepartment: "",
            phone: "",
        };

        this.state = { ...initialState};
    }

    handleChange(event) {
        this.setState({ supportDepartment: event.target.value });
    }

    handleSubmit(event) {
        alert('Choice was: ' + this.state.supportDepartment);
        event.preventDefault();
    }
    public  render() {
        return(
            <form onSubmit={this.handleSubmit}>
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
                    <label className="control-label">Support Department</label>
                    <select name="SupportDepartment" className="form-control" onChange={this.handleChange}>
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
                        <label className="control-label">Your Phone Number</label>
                        <input type="text" name="Phone" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label className="control-label">Location</label>
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
                        <label className="control-label">For Website</label>
                        <input type="text" name="ForWebSite" className="form-control" />
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