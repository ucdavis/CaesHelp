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
using Microsoft.Extensions.Options;

namespace CaesHelp.Controllers
{
    [AutoValidateAntiforgeryToken]
    public class HomeController : SuperController
    {
        private readonly IEmailService _emailService;
        private readonly ComputerSupport _computerSupport;


        public HomeController(IEmailService emailService, IOptions<ComputerSupport> computerSupport)
        {
            _emailService = emailService;
            _computerSupport = computerSupport.Value;
        }

        [Authorize]
        public IActionResult Index(string appName, string subject, string team)
        {
            var user = new User();
            try
            {
                user = User.GetUserInfo();
            }
            catch (Exception)
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
                    case bool b when model.AppName.Equals("Crp", StringComparison.OrdinalIgnoreCase):
                        model.AppName = "Registration";
                        break;
                    default:
                        break;
                }
                model.TeamName = team;
                model.OnlyShowAppSupport = true;
            }

           

            try
            {
                if (!string.IsNullOrWhiteSpace(_computerSupport.Services))
                {
                    //populate the model.Services with the key from the dictionary
                    model.Services = _computerSupport.Services.Split(',').Select(x => x.Split(':')).Select(x => x[0]).ToArray();
                }
                
            }
            catch (Exception)
            {
                //Swallow it
            }



            return View(model);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Index([FromForm] TicketPostModel model)
        {
            var message = string.Empty;
            try
            {
                model.UserInfo = User.GetUserInfo();
                await _emailService.SendEmail(model);
                message = "Help ticket submitted. You should get a confirmation email within 5 or 10 minutes.";
            }
            catch (Exception)
            {
                message = "There was an unexpected error. Please try again. If the problem persists, please email apprequests@caes.ucdavis.edu";
                return RedirectToAction("Error");

            }

            return RedirectToAction("Success");
        }

        public IActionResult Success()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return RedirectToAction("Index", "Error");
            //return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
