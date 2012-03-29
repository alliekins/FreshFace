using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FreshFace.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (Request.IsAuthenticated)
            {
                ViewBag.Message = "Welcome to FreshFace!  More to come!";

                return View();
            }
            else
            {
                return RedirectToAction("LogOn", "Account");
            }
        }

        public ActionResult About()
        {
            return View();
        }
    }
}
