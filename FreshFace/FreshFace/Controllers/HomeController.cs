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
            ViewBag.Message = "Welcome to FreshFace!  More to come!";

            return View();
        }

        public ActionResult About()
        {
            return View();
        }

        public ActionResult GridIndex()
        {
            return View();
        }
    }
}
