using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    public class CallDAO
    { 
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

        public int Update(Call call)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Call>(call, "calls");
                update = 1;
            }
            catch (MongoConcurrencyException ex)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "CallDAO", "Update:Error");
            }

            return update;
        }

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