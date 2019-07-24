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
    [AutoValidateAntiforgeryToken]
    public class HomeController : SuperController
    {
        private readonly IEmailService _emailService;


        public HomeController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [Authorize]
        public IActionResult Submit(string appName, string subject)
        {
            var user = new User();
            try
            {
                user = User.GetUserInfo();
            }
            catch (Exception e)
            {
                ErrorMessage = "There was an error getting your user information from IAM. Please email our Programming support directly to let us know.";
                return RedirectToAction("Index", "Error");
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                ErrorMessage = "We couldn't find your email in IAM for your account. Please email our Programming support directly to let us know.";
                return RedirectToAction("Index", "Error");
            }

            var model = new TicketDefaultsModel { AppName = appName, Subject = subject, SubmitterEmail = user.Email };

            if (!string.IsNullOrWhiteSpace(model.AppName))
            {
                switch (true)
                {
                    case bool b when model.AppName.Equals("OPP", StringComparison.OrdinalIgnoreCase):
                        model.AppName = "PrePurchasing";
                        break;
                    case bool b when model.AppName.Equals("Ace", StringComparison.OrdinalIgnoreCase):
                        model.AppName = "Academic Course Evaluations";
                        break;
                    default:
                        break;
                }

                model.OnlyShowAppSupport = true;
            }


            return View(model);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Submit([FromForm] TicketPostModel model)
        {
            var success = false;
            var message = string.Empty;
            try
            {
                model.UserInfo = User.GetUserInfo();
                await _emailService.SendEmail(model);
                success = true;
                message = "Help ticket submitted. You should get a confirmation email within 5 or 10 minutes.";
            }
            catch (Exception e)
            {
                message = "There was an unexpected error. Please try again.";
            }

            return Json(new { success, message });
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
