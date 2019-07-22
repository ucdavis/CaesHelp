using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using CaesHelp.Extensions;
using Microsoft.AspNetCore.Mvc;
using CaesHelp.Models;
using CaesHelp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace CaesHelp.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly IEmailService _emailService;
        private const string TempDataMessageKey = "Message";
        private const string TempDataErrorMessageKey = "ErrorMessage";

        public string Message
        {
            get => TempData[TempDataMessageKey] as string;
            set => TempData[TempDataMessageKey] = value;
        }

        public string ErrorMessage
        {
            get => TempData[TempDataErrorMessageKey] as string;
            set => TempData[TempDataErrorMessageKey] = value;
        }

        public HomeController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Submit(string appName, string subject)
        {
            var user = User.GetUserInfo();
            var model = new TicketDefaultsModel {AppName = appName, Subject = subject, SubmitterEmail = user.Email};
            if (!string.IsNullOrWhiteSpace(model.AppName))
            {
                //TODO, validate appName
                model.OnlyShowAppSupport = true;
            }


            return View(model);
        }

        [HttpPost]
        public async Task<IActionResult> Submit([FromForm] TicketPostModel model)
        {
            //TODO: json
            model.UserInfo = User.GetUserInfo();
            await _emailService.SendEmail(model);
            return RedirectToAction("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
