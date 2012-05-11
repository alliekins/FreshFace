using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FreshFace.Models;

namespace FreshFace.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return PageRedirectHelp("Index");
        }

        public ActionResult MyStocks()
        {
            return PageRedirectHelp("MyStocks");
        }

        public ActionResult MyCalendar()
        {
            return PageRedirectHelp("MyCalendar");
        }

        public ActionResult ShoutOut()
        {
            return PageRedirectHelp("ShoutOut");
        }

        private ActionResult PageRedirectHelp(string pageName)
        {
            // Default ID that Sam setup
            ViewBag.AppID = FBModel.GetAppID(HttpContext);
            if (Request.IsAuthenticated)
            {
                if (!Request.Path.Contains(pageName))
                    Response.Redirect(@Url.Content("~/Home/" + pageName), true);
                return View();
            }
            else
            {
                return RedirectToAction("LogOn", "Account");
            }
        }
    }
}
