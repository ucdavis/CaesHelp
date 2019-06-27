using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class TicketDefaultsModel
    {
        public string AppName { get; set; }
        public string Subject { get; set; }
        public bool OnlyShowAppSupport { get; set; } = false;
    }
}
