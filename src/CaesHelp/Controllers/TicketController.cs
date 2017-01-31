using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CaesHelp.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaesHelp.Controllers
{
    public class TicketController : Controller
    {
        // GET: /<controller>/
        [HttpGet]
        public IActionResult RequestHelp(string appName, string subject)
        {
            if (!string.IsNullOrEmpty(appName))
            {
                if (appName.Contains("appName="))
                {
                    appName = appName.Substring(appName.LastIndexOf("appName=") + 8);
                }
            }
            if (!string.IsNullOrWhiteSpace(subject))
            {
                var subjectLength = (subject.Trim().Length - 1) / 2;
                if (subject[subjectLength] == ',')
                {
                    var subjectFirst = subject.Substring(0, subjectLength);
                    var subjectLast = subject.Substring(subjectLength + 1);
                    if (subjectFirst == subjectLast)
                    {
                        subject = subjectLast;
                    }
                }
            }



            return View(TicketViewModel.Create( appName, subject));
        }

        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult RequestHelp(Ticket ticket)
        {
            var xxx = ticket;

            return this.RedirectToAction("RequestHelp");
        }

    }
}
