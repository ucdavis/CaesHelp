using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;

namespace CaesHelp.Models
{


    public class TicketViewModel
    {
        public string AppName;
        public string CallingPage;
        public string PassedSubject;

        public List<string> Urgency { get; set; }
        public List<string> SupportDepartment { get; set; }
        public Ticket Ticket { get; set; }
        public List<string> ProgrammingSupportApps { get; set; }

        public Dictionary<string, string> AvailableApps { get; set; }

        public static TicketViewModel Create(string appName, string subject)
        {

            //Check.Require(ticketRepository != null, "ticketRepository is required.");            
            var viewModel = new TicketViewModel();
            viewModel.AppName = appName;
            viewModel.PassedSubject = subject;
            viewModel.Ticket = new Ticket();

            //This list isn't complete, but we haven't got a ticket from the missing ones in more that 2 years
            viewModel.AvailableApps = new Dictionary<string, string>();
            viewModel.AvailableApps.Add("", "-- Select a Program --");
            viewModel.AvailableApps.Add("ACE", "Academic Course Evaluations");
            viewModel.AvailableApps.Add("AD419", "AD419");
            viewModel.AvailableApps.Add("CatBert", "CatBert");
            viewModel.AvailableApps.Add("Commencement", "Commencement");
            viewModel.AvailableApps.Add("CRP", "Conference Registration And Payments");
            viewModel.AvailableApps.Add("EL", "Eligibility List");
            viewModel.AvailableApps.Add("ESRA", "Employee Salary Review Analysis");
            viewModel.AvailableApps.Add("GRAMPS", "Grants Management");
            viewModel.AvailableApps.Add("OPP", "PrePurchasing");
            viewModel.AvailableApps.Add("PTF", "PTF");
            viewModel.AvailableApps.Add("SIMS", "Student Information Management System");
            viewModel.AvailableApps.Add("STD", "Subject To Dismissal");




            viewModel.Urgency = new List<string>(5);
            viewModel.Urgency.Add("Non-Critical Issue");
            viewModel.Urgency.Add("Scheduled Requests");
            viewModel.Urgency.Add("Workaround Available");
            viewModel.Urgency.Add("Work Stoppage");
            viewModel.Urgency.Add("Critical");


            viewModel.SupportDepartment = new List<string>();
            if (string.IsNullOrEmpty(viewModel.AppName))
            {
                viewModel.SupportDepartment.Add("Computer Support");
                viewModel.SupportDepartment.Add("Web Site Support");
                viewModel.SupportDepartment.Add("Programming Support");
            }
            else
            {
                viewModel.SupportDepartment.Add("Programming Support");
                viewModel.Ticket.Subject = subject;
            }

            viewModel.ProgrammingSupportApps = new List<string>();
            if (viewModel.AvailableApps.Where(x => x.Key == viewModel.AppName).Any())
            {
                viewModel.ProgrammingSupportApps.Add(
                    viewModel.AvailableApps.Where(x => x.Key == viewModel.AppName).Single().Value);
                viewModel.Ticket.ForApplication = viewModel.ProgrammingSupportApps[0];
            }
            else
            {
                foreach (var application in viewModel.AvailableApps.OrderBy(a => a.Value))
                {
                    viewModel.ProgrammingSupportApps.Add(application.Value);
                }
            }
            return viewModel;
        }

    }

}
