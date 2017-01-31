﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CaesHelp.Models
{
    public class GenericViewModel
    {
        public string AppName;
        public string CallingPage;
        public string PassedSubject;
        public static GenericViewModel Create(string appName, string subject)
        {
            return new GenericViewModel { AppName = appName, PassedSubject = subject };
        }
    }
}
