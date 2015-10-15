using System;
using System.Runtime.Serialization.Formatters.Binary;
using System.IO;
using HelpdeskDAL;
using System.Diagnostics;

namespace HelpdeskViewModels
{
    public class ViewModelUtils
    {
        /// <summary>
        /// Serializer
        /// </summary>
        /// <param name="inObject">Object to be serialized.</param>
        /// <returns>Serialized Object in byte array format.</returns>
        public static byte[] Serializer(Object inObject)
        {
            byte[] byteArrayObject;
            BinaryFormatter frm = new BinaryFormatter();
            MemoryStream strm = new MemoryStream();
            frm.Serialize(strm, inObject);
            byteArrayObject = strm.ToArray();
            return byteArrayObject;
        }

        /// <summary>
        /// DeDeserializer
        /// </summary>
        /// <param name="byteArrayIn">Byte array to be deserialized.</param>
        /// <returns>Deserialized Object.</returns>
        public static Object Deserializer(byte[] byteArrayIn)
        {
            BinaryFormatter frm = new BinaryFormatter();
            MemoryStream strm = new MemoryStream(byteArrayIn);
            return frm.Deserialize(strm);
        }

        public bool LoadCollections()
        {
            bool createOK = false;

            try
            {
                DALUtils dal = new DALUtils();
                createOK = dal.LoadCollections();
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "ViewModelUtils", "LoadCollections");
            }

            return createOK;
        }

        /// <summary>
        /// Common DAL Error Method
        /// </summary>
        /// <param name="e">Execption thrown</param>
        /// <param name="obj">Class throwing execption</param>
        /// <param name="method">Method throwing execption</param>
        public static void ErrorRoutine(Exception e, string obj, string method)
        {
            if (e.InnerException != null)
            {
                Trace.WriteLine("Error in ViewModels, Objects = "
                    + obj
                    + ", method = "
                    + method
                    + ", inner execption message = "
                    + e.InnerException.Message
                );
                //throw e.InnerException;
            }
            else
            {
                Trace.WriteLine("Error in ViewModels, object = "
                    + obj
                    + ", method = "
                    + method
                    + ", message = "
                    + e.Message
                );
                //throw e;
            }
        }
    }
}
