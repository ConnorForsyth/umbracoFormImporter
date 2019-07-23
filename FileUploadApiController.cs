using System;
using System.IO;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;


namespace SimpleFileUpload
{
    [PluginController("FormFileUploader")]
    public class FileUploadApiController : UmbracoAuthorizedApiController
    {
        public async Task<HttpResponseMessage> UploadFileToServer()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
			
			var root = "";
			var importType = "";
			if(Request.Content != null)
			{
				importType = Request.RequestUri.ToString();
			}

            // Make this directory whatever makes sense for your project.		
			if(importType.Contains("form"))
			{
				root = HttpContext.Current.Server.MapPath("~/App_Data/UmbracoForms/Data/forms");
			}
			
			if(importType.Contains("workflow"))
			{
				root = HttpContext.Current.Server.MapPath("~/App_Data/UmbracoForms/Data/workflows");				
			}		
			
            Directory.CreateDirectory(root);
            var provider = new CustomMultipartFormDataStreamProvider(root);
            var result = await Request.Content.ReadAsMultipartAsync(provider);

            if (result.FileData.FirstOrDefault() == null)
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "Error uploading file");

            // Get full file path from disk
            var filename = result.FileData.FirstOrDefault().LocalFileName;
			
            // Return the feedback to the response
            return Request.CreateResponse(HttpStatusCode.OK, filename);
        }

    }
}
