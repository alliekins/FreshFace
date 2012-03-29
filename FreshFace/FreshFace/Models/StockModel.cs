
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

namespace FreshFace.models
{
    public class StockModel
    {
        [Required]
        public string CompanyName { get; set; }

        public int CurrentPrice { get; set; }

        public int ChangePrice { get; set; }
    }

}