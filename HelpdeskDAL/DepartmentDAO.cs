using MongoDB.Driver.Linq;
using System.Linq;
using System;
using MongoDB.Kennedy;
using MongoDB.Bson;
using System.Collections.Generic;

namespace HelpdeskDAL
{
    public class DepartmentDAO
    {
        public Department GetByName(string name)
        {
            Department retDep = null;
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                var departments = _ctx.Departments;
                var department = departments.AsQueryable<Department>().Where(dep => dep.DepartmentName == name).FirstOrDefault();
                retDep = (Department)department;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retDep;
        }

        public Department GetByID(string id)
        {
            Department retDep = null;
            ObjectId ID = new ObjectId(id);
            DbContext _ctx;

            try
            {
                _ctx = new DbContext();
                retDep = _ctx.Departments.FirstOrDefault(d => d._id == ID);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Problem " + ex.Message);
            }

            return retDep;
        }

        public List<Department> GetAll()
        {
            List<Department> allDeps = new List<Department>();

            try
            {
                DbContext ctx = new DbContext();
                allDeps = ctx.Departments.ToList();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "GetAll");
            }

            return allDeps;
        }

        public int Update(Department dep)
        {
            int update = -1;
            try
            {
                DbContext ctx = new DbContext();
                ctx.Save<Department>(dep, "departments");
                update = 1;
            }
            catch (MongoConcurrencyException ex)
            {
                update = -2;
            }
            catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Update:Error");
            }

            return update;
        }

        public string Create (Department dep)
        {
            string newid = "";

            try
            {
                DbContext ctx = new DbContext();
                ctx.Save(dep, "departments");
                newid = dep._id.ToString();
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Create");
            }

            return newid;
        }

        public bool Delete(string id)
        {
            bool deleteOk = false;
            ObjectId depId = new ObjectId(id);

            try
            {
                DbContext ctx = new DbContext();
                Department dep = ctx.Departments.FirstOrDefault(d => d._id == depId);
                ctx.Delete<Department>(dep, "departments");
                deleteOk = true;
            } catch (Exception ex)
            {
                DALUtils.ErrorRoutine(ex, "DepartmentDAO", "Delete");
            }

            return deleteOk;
        }
    }
}