﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FreshFace.models;

namespace FreshFace.Controllers
{
    public class StockController : Controller
    {

        //
        // GET: /Stock/Details/5

        [HttpGet]
        public JsonResult Details(int id)
        {
            if (!Request.IsAuthenticated)
            {
                return null;
            }

            return Json(new StockModel() { CompanyName = "GOOG", ChangePrice = 5, CurrentPrice = 600 }, JsonRequestBehavior.AllowGet);
        }

        //
        // GET: /Stock/Create

        public ActionResult Create(StockModel stock)
        {
            return View();
        }

        //
        // GET: /Stock/Delete/5
 
        public ActionResult Delete(int id)
        {
            return View();
        }

    }
}
