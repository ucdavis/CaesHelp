﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
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

        public EmailService(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value;
        }

        public async Task SendEmail(TicketPostModel model)
        {
            if (!_emailSettings.SendEmails.Equals("Yes", StringComparison.OrdinalIgnoreCase))
            {
                //Log.Information("Email Sending Disabled");
                return;
            }

            //TODO: Build email
            var message = new MailMessage { From = new MailAddress(model.UserInfo.Email) };
            message.To.Add(_emailSettings.AppSupportEmail); //TODO: Replace with ticket email

            foreach (var carbonCopy in FilterCarbonCopies(model.CarbonCopies))
            {
                message.CC.Add(new MailAddress(carbonCopy));
            }

            message.Subject = model.Subject;




            message.IsBodyHtml = false;
            message.Body = "Fake Email Body";

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
                            var attach = new Attachment(memoryStream, file.FileName,
                                MediaTypeNames.Application.Octet);

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

                        client.Send(message);
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

                var email = ccEmail.ToLower();
                if (IsValidEmail(email))
                {
                    rtValue.Add(email);
                }

            }
            return rtValue;
        }

        private bool IsValidEmail(string email)
        {
            //TODO: Add validation (regex and filter ticket emails)
            return true;
        }

    }
}
