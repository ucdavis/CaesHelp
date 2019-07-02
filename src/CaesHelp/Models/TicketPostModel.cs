using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class TicketPostModel
    {
        public string UrgencyLevel { get; set; }
        public string SupportDepartment { get; set; }
        public string Phone { get; set; }
        public string Location { get; set; }
        public string Available { get; set; }
        public string ForWebSite { get; set; }
        public string ForApplication { get; set; }
        public string CarbonCopies { get; set; } //TODO: Replace with array?
        public string Subject { get; set; }
        public string Message { get; set; }
        public string x { get; set; } //TODO: Attachment
    }
}
