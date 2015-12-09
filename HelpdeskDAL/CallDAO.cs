using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    // A call data acces object for interacting with the database using call objects.
    public class CallDAO
    { 
        // Get all of the call information based on the object id
        public Call GetByID(string id)
        {
            Call retCall = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retCall = _ctx.Calls.FirstOrDefault(c => c._id == ID);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retCall;
        }

        // Get all of the calls from the database
        public List<Call> GetAll()
        {
            List<Call> allCalls = new List<Call>();

            try
            {
                DbContext ctx = new DbContext();
                allCalls = ctx.Calls.ToList();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "CallDAO", "GetAll");
            }

            return allCalls;
        }

        // Update the call based on the given call object
        public int Update(Call call)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Call>(call, "calls");
                update = 1;
            }
            catch (MongoConcurrencyException)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "CallDAO", "Update:Error");
            }

            return update;
        }

        // Create a new call based on the given call object
        public string Create (Call call)
        {
            string newid = "";

            try
            {
                DbContext ctx = new DbContext();
                ctx.Save(call, "calls");
                newid = call._id.ToString();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "CallDAO", "Create");
            }

            return newid;
        }

        // Delete the call with the given id
        public bool Delete(string id)
        {
            bool deleteOk = false;
            ObjectId callId = new ObjectId(id);

            try
            {
                DbContext ctx = new DbContext();
                Call call = ctx.Calls.FirstOrDefault(c => c._id == callId);
                ctx.Delete<Call>(call, "calls");
                deleteOk = true;
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "CallDAO", "Delete");
            }

            return deleteOk;
        }
    }
}