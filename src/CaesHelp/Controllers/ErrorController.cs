using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CaesHelp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace CaesHelp.Controllers
{
    public class ErrorController : SuperController
    {
        private readonly EmailSettings _emailSettings;

        public ErrorController(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }
        public IActionResult Index()
        {

            ViewBag.ProgrammingSupport = _emailSettings.AppSupportEmail;
            ViewBag.WebSupport = _emailSettings.WebSupportEmail;
            ViewBag.ComputerSupport = _emailSettings.ComputerSupportEmail;
            return View();
        }
    }
}