using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class Ticket
    {
        public virtual string FromEmail { get; set; }
        [Required(ErrorMessage = "You must select an Urgency Level")]
        public virtual string UrgencyLevel { get; set; }
        [Required(ErrorMessage = "You must select a Support Department")]
        public virtual string SupportDepartment { get; set; }
        public virtual string ForApplication { get; set; }
        public virtual string ForWebSite { get; set; }

        public virtual string YourPhoneNumber { get; set; }
        public virtual string LocationOfProblem { get; set; }
        [Required(ErrorMessage = "You must enter the Subject.")]
        //[DisplayName("Subject:")]
        public virtual string Subject { get; set; }
        [Required(ErrorMessage = "You must enter the Message Body.")]
        public virtual string MessageBody { get; set; }
        public virtual List<string> Availability { get; set; }
        public virtual List<string> EmailCCs { get; set; }
        public virtual ICollection<Attachment> Attachments { get; set; } //Note: if IList is used instead, a different mapping test is used.
    }
}
