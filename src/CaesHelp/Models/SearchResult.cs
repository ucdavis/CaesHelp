using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class SearchResult
    {
        public string SearchValue { get; set; }
        public bool Found { get; set; } = false;
        public string FullName { get; set; }
        public string KerbId { get; set; }
        public string IamId { get; set; }
        public string Email { get; set; }

        public bool IsEmployee { get; set; }
        public bool IsHSEmployee { get; set; }
        public bool IsFaculty { get; set; }
        public bool IsStudent { get; set; }
        public bool IsExternal { get; set; }
        public bool IsStaff { get; set; }

        public string ExpandedAffiliation
        {
            get
            {
                var roles = new List<string>();
                if (IsStaff)
                {
                    roles.Add("Staff");
                }

                if (IsFaculty)
                {
                    roles.Add("Faculty");
                }

                if (IsStudent)
                {
                    roles.Add("Student");
                }

                return string.Join(", ", roles);
            }
        }

        public string Departments { get; set; }

        public string ErrorMessage { get; set; }
    }
}
