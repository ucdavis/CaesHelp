using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CaesHelp.Models;
using Microsoft.AspNetCore.Mvc;
using PaulMiami.AspNetCore.Mvc.Recaptcha;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CaesHelp.Controllers
{
    public class TestController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [ValidateRecaptcha]
        [HttpPost]
        public IActionResult Index(TestEmailNewsletterViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                return RedirectToAction("ThankYou", new { name = viewModel.Name });
            }

            return View();
        }


        [HttpGet]
        public IActionResult JqueryValidationDisabled()
        {
            return View();
        }

        [ValidateRecaptcha]
        [HttpPost]
        public IActionResult JqueryValidationDisabled(TestEmailNewsletterViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                return RedirectToAction(nameof(ThankYou), new { name = viewModel.Name });
            }

            return View();
        }



        [HttpGet]
        public IActionResult ThankYou(string name)
        {
            return View(nameof(ThankYou), name);
        }
    }
}
