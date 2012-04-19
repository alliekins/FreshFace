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
            // Default ID that Sam setup
            ViewBag.AppID = FBModel.GetAppID(HttpContext);

            if (Request.IsAuthenticated)
            {
                if (!Request.Path.Contains("Index"))
                    Response.Redirect(@Url.Content("~/Home/Index"), true);
                return View();
            }
            else
            {
                return RedirectToAction("LogOn", "Account");
            }
        }
    }
}
