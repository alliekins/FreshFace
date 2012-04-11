
using System.Linq;
using System.Linq.Expressions;
using System.Data.Linq;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using FreshFace.Models;
using System;

namespace FreshFace.models
{
    public class StockEngine
    {
        public static int FetchStocks()
        {
            DataClasses1DataContext dc = new DataClasses1DataContext();
            //DataContext dc = new DataContext("localhost");
            Table<User> Users = dc.GetTable<User>();

            var query =
                from user in Users
                where user.UserID == "123456"
                select user;

            //var first = query.First();
            var first = query.FirstOrDefault();

            if (first == null)
            {
                return -1;
            }
            else
            {
                return 5;
            }
        }
    }

    public class StockModel
    {
        [Required]
        public string CompanyName { get; set; }

        public int CurrentPrice { get; set; }

        public int ChangePrice { get; set; }
    }

}