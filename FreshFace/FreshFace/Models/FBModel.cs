using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace FreshFace.Models
{
    public class FBModel
    {
        [Required]
        [Display(Name = "FB User Id")]
        public string UserID { get; set; }

        public static string GetAppID(HttpContextBase server)
        {
            var AppID = "377609208946698"; // the actual AppID for deployment

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

            try
            {
                // But if you provide your own ID in this file 
                //  (root/fb_app_id.txt) , use it
                var filePath = server.Server.MapPath("fb_app_id.txt");
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