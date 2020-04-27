using CaesHelp.Models;
using Microsoft.AspNetCore.Mvc;

namespace CaesHelp.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {
        }

        
        public IActionResult Index()
        {
            var model = new TicketDefaultsModel { AppName = null, Subject = null, SubmitterEmail = "srkirkland@ucdavis.edu" };

            return View(model); 
        }

        public IActionResult Gone() {
            return Content("Not Found");
        }
    }
}
