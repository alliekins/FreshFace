
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace FreshFace.models
{
    public class StockModel
    {
        [Required]
        public string CompanyName { get; set; }

        public double CurrentPrice { get; set; }

        public double ChangePrice { get; set; }
    }

}