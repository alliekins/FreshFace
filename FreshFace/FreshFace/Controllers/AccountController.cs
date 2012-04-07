using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using FreshFace.Models;

namespace FreshFace.Controllers
{
    public class AccountController : Controller
    {

        //
        // GET: /Account/LogOn

        public ActionResult LogOn()
        {
            // Default ID that Sam setup
            ViewBag.AppID = FBModel.GetAppID(HttpContext);

            return View();
        }

        //
        // POST: /Account/LogOn

        [HttpPost]
        public JsonResult LogOn(FBModel model, string returnUrl)
        {
            if (model != null && !model.UserID.Equals(""))
            {
                FormsAuthentication.SetAuthCookie(model.UserID, false);
                return Json(new LogOnModel() { Success = true });
            }

            // If we got this far, something failed, redisplay form
            return Json(new LogOnModel() { Success = false });
        }

        //
        // POST: /Account/LogOff

        [HttpPost]
        public JsonResult LogOff()
        {
            FormsAuthentication.SignOut();

            return Json(new LogOnModel() { Success = true });
        }
    }
}
