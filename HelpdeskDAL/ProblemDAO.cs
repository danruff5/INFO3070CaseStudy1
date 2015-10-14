using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    public class ProblemDAO
    {
        public Problem GetByName(string name)
        {
            Problem retPrb= null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                var problems = _ctx.Problems;
                var problem = problems.AsQueryable<Problem>().Where(prb => prb.Description == name).FirstOrDefault();
                retPrb = (Problem)problem;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retPrb;
        }

        public Problem GetByID(string id)
        {
            Problem retPrb = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                var problems = _ctx.Problems;
                var problem = problems.AsQueryable<Problem>().Where(prb => prb._id == ID).FirstOrDefault();
                retPrb = (Problem)problem;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retPrb;
        }

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

        public int Update(Problem prb)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Problem>(prb, "problems");
                update = 1;
            }
            catch (MongoConcurrencyException ex)
            {
                update = -2;
                DALUtils.ErrorRoutine(ex, "ProblemDAO", "Update:Concurrency");
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