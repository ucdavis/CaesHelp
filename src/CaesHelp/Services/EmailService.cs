﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using CaesHelp.Models;
using Microsoft.Extensions.Options;


namespace CaesHelp.Services
{
    public interface IEmailService
    {
        Task SendEmail(TicketPostModel model);
    }

    public class EmailService : IEmailService
    {

        private readonly EmailSettings _emailSettings;

        private static readonly string[] SupportEmails = new string[] 
        {
            "ASISupport@caes.ucdavis.edu",
            "AppRequests@caes.ucdavis.edu",
            "Clusters@caes.ucdavis.edu",
            "CSRequests@caes.ucdavis.edu",
            "ITPLPNEM@ucdavis.edu",
            "PLPNEMITSupport@caes.ucdavis.edu",
            "ITSupport@ucdavis.edu",
            "OCSSupport@caes.ucdavis.edu",
            "OGSWeb@caes.ucdavis.edu",
            "WebRequests@caes.ucdavis.edu",
            "shuka@ucdavis.edu",
            "shuka@caes.ucdavis.edu",
            "smith@caes.ucdavis.edu",
            "ssmith@ucdavis.edu",
            "ssmith@caes.ucdavis.edu",
        };

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmail(TicketPostModel model)
        {
            var unknownSupportDept = false;
            if (!_emailSettings.SendEmails.Equals("Yes", StringComparison.OrdinalIgnoreCase))
            {
                //Log.Information("Email Sending Disabled");
                //return;
            }

            //TODO: Build email
            var message = new MailMessage { From = new MailAddress(model.UserInfo.Email) };
            switch (model.SupportDepartment)
            {
                case "Computer Support":
                    message.To.Add(_emailSettings.AppSupportEmail);
                    break;
                case "Web Site Support":
                    message.To.Add(_emailSettings.WebSupportEmail);
                    break;
                case "Programming Support":
                    message.To.Add(_emailSettings.ComputerSupportEmail);
                    break;
                default:
                    unknownSupportDept = true;
                    message.To.Add(_emailSettings.AppSupportEmail);
                    break;
            }
            

            foreach (var carbonCopy in FilterCarbonCopies(model.CarbonCopies))
            {
                message.CC.Add(new MailAddress(carbonCopy));
            }

            message.Subject = model.Subject;




            message.IsBodyHtml = false;
            message.Body = BuildBody(model, unknownSupportDept);

            using (var memoryStream = new MemoryStream())
            {
                if (model.Files != null && model.Files.Count > 0)
                {

                    foreach (var file in model.Files)
                    {

                        try
                        {

                            await file.CopyToAsync(memoryStream);
                            memoryStream.Seek(0, SeekOrigin.Begin);
                            var attach = new Attachment(memoryStream, file.FileName);

                            message.Attachments.Add(attach);

                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e);
                            throw;
                        }

                    }
                }
                //This has to be inside the memoryStream using because I think it read it at send time, and it would be closed otherwise
                try
                {

                    using (var client = new SmtpClient(_emailSettings.Host))
                    {
                        client.UseDefaultCredentials = false;
                        client.Credentials = new NetworkCredential(_emailSettings.UserName, _emailSettings.Password);
                        client.Port = _emailSettings.Port;
                        client.DeliveryMethod = SmtpDeliveryMethod.Network;
                        client.EnableSsl = true;
                        if (_emailSettings.SendEmails.Equals("Yes", StringComparison.OrdinalIgnoreCase))
                        {
                            client.Send(message);
                        }
                    }

                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }

            }


        }


        private List<string> FilterCarbonCopies(string[] ccEmails)
        {
            var rtValue = new List<string>();
            rtValue.Add("jsylvestre@ucdavis.edu"); //TODO: Remove

            if (ccEmails == null)
            {
                return rtValue;
            }

            foreach (var ccEmail in ccEmails)
            {
                if (string.IsNullOrWhiteSpace(ccEmail))
                {
                    continue;
                }

                var email = ccEmail.ToLower().Trim();
                if (IsValidEmail(email))
                {
                    rtValue.Add(email);
                }

            }
            return rtValue;
        }

        private bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            if (SupportEmails.Contains(email, StringComparer.CurrentCultureIgnoreCase))
            {
                return false;
            }
            return true;
        }

        private string BuildBody(TicketPostModel model, bool unknownSupportDept)
        {
            var body = new StringBuilder();
            if (unknownSupportDept)
            {
                body.AppendLine("Unknown Support Department Detected!!!");
                body.AppendLine("Routing to App Support First.");
                body.AppendLine();
            }
            //body.AppendLine($"xxxxxxxxxxxxxxxxxxxxx: {model.Subject}");
            body.AppendLine($"Original Subject     : {model.Subject}");
            body.AppendLine($"Urgency Level        : {model.UrgencyLevel}");
            body.AppendLine($"Support Department   : {model.SupportDepartment}");
            if(!string.IsNullOrWhiteSpace(model.ForApplication) )
            
        }


    }
}
