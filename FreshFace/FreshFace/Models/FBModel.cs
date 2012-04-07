using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FreshFace.Models
{
    public class FBModel
    {
        public static string GetAppID(HttpContextBase server)
        {
            var AppID = "377609208946698";

            try
            {
                // But if you provide your own ID in this file 
                //  (root/fb_app_id.txt) , use it
                var filePath = server.Server.MapPath("../fb_app_id.txt");
                AppID = System.IO.File.ReadAllText(filePath);
            }
            catch (Exception)
            {
                // Don't care otherwise; use the default.
            }

            return AppID;
        }
    }
}