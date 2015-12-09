using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    // A problem data access object for interacting with the database using problem objects
    public class ProblemDAO
    {
        // Get the problem based on the name.
        public Problem GetByName(string name)
        {
            Problem retPrb= null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retPrb = _ctx.Problems.FirstOrDefault(p => p.Description == name);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "GetByName");
            }

            return retPrb;
        }

        // Get the problem based on the id.
        public Problem GetByID(string id)
        {
            Problem retPrb = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retPrb = _ctx.Problems.FirstOrDefault(p => p._id == ID);
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "GetByID");
            }

            return retPrb;
        }

        // Get all of the problems from the database.
        public List<Problem> GetAll()
        {
            List<Problem> allPrbs = new List<Problem>();

            try
            {
                DbContext ctx = new DbContext();
                allPrbs = ctx.Problems.ToList();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "GetAll");
            }

            return allPrbs;
        }

        // Update the problem based on the given problem object
        public int Update(Problem prb)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Problem>(prb, "problems");
                update = 1;
            }
            catch (MongoConcurrencyException)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "Update:Error");
            }

            return update;
        }

        public string Create (Problem prb)
        {
            string newid = "";

            try
            {
                DbContext ctx = new DbContext();
                ctx.Save(prb, "problems");
                newid = prb._id.ToString();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "Create");
            }

            return newid;
        }

        // Delete the problem with the given id
        public bool Delete(string id)
        {
            bool deleteOk = false;
            ObjectId prbId = new ObjectId(id);

            try
            {
                DbContext ctx = new DbContext();
                Problem prb = ctx.Problems.FirstOrDefault(p => p._id == prbId);
                ctx.Delete<Problem>(prb, "problems");
                deleteOk = true;
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "Delete");
            }

            return deleteOk;
        }
    }
}