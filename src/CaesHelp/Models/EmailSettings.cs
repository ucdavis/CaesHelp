using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class EmailSettings
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public string SendEmails { get; set; }

        public string AppSupportEmail { get; set; }
        public string WebSupportEmail { get; set; }
        public string ComputerSupportEmail { get; set; }
    }
}
