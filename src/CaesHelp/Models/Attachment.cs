using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class Attachment
    {
        public Attachment(string name, string fileName)
        {
            SetDefaults();

            Name = name;
            FileName = fileName;
        }

        /// <summary>
        /// Required by nhibernate, use the parameterized constructor
        /// </summary>
        protected Attachment() { SetDefaults(); }

        protected void SetDefaults()
        {
            DateCreated = DateTime.UtcNow; //TODO Pacific?
        }

        [Required]
        [StringLength(100)]
        public virtual string Name { get; set; }
        public virtual DateTime DateCreated { get; set; }
        [Required]
        [StringLength(100)]
        public virtual string FileName { get; set; }
        [Required] //Was not null. Not sure if this will work...
        public virtual byte[] Contents { get; set; }
        public virtual string ContentType { get; set; }
    }
}
