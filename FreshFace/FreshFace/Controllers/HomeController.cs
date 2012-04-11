﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FreshFace.Models;
using FreshFace.models;

namespace FreshFace.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Num = StockEngine.FetchStocks();
            // Default ID that Sam setup
            ViewBag.AppID = FBModel.GetAppID(HttpContext);

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
    }
}
