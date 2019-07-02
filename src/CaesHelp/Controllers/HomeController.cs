using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CaesHelp.Models;

namespace CaesHelp.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Submit(string appName, string subject) 
        {
            var model = new TicketDefaultsModel {AppName = appName, Subject = subject};
            if (!string.IsNullOrWhiteSpace(model.AppName))
            {
                //TODO, validate appName
                model.OnlyShowAppSupport = true;
            }


            return View(model);
        }

        [HttpPost]
        public IActionResult Submit([FromForm] TicketPostModel model)
        {

            return RedirectToAction("Submit");
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
