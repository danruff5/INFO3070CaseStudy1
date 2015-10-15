using HelpdeskDAL;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace HelpdeskViewModels
{
    public class DepartmentViewModel : ViewModelUtils
    {
        private DepartmentDAO _dao;
        public string Id { get; set; }
        public string DepartmentName { get; set; }
        public string Entity64 { get; set; }

        public DepartmentViewModel()
        { 
            _dao = new DepartmentDAO();
        }

        public void GetById(string id)
        {
            try
            {
                Department dep = _dao.GetByID(id);
                Id = dep._id.ToString();
                DepartmentName = dep.DepartmentName;
                Entity64 = Convert.ToBase64String(Serializer(dep));
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "DepartmentViewModel", "GetById");
            }
        }

        public int Update()
        {
            int rowUp = -1;

            try
            {
                byte[] bytDep = Convert.FromBase64String(Entity64);
                Department dep = (Department)Deserializer(bytDep);
                dep.DepartmentName = DepartmentName;
                rowUp = _dao.Update(dep);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "DepartmentViewModel", "Update");
            }
            return rowUp;
        }

        public void Create()
        {
            try
            {
                Department dep = new Department();
                dep.DepartmentName = DepartmentName;
                Id = _dao.Create(dep);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "DepartmentViewModel", "Create");
            }
        }

        public List<DepartmentViewModel> GetAll()
        {
            List<DepartmentViewModel> viewModels = new List<DepartmentViewModel>();

            try
            {
                List<Department> departments = _dao.GetAll();

                foreach (Department e in departments)
                {
                    // Return only fields for display, subdequent get will other fields
                    DepartmentViewModel viewModel = new DepartmentViewModel();
                    viewModel.Id = e._id.ToString();
                    viewModel.DepartmentName = e.DepartmentName;
                    viewModels.Add(viewModel); // Add to list
                }
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "DepartmentViewModel", "GetAll");
            }
            return viewModels;
        }

        public bool Delete()
        {
            bool deleteOK = false;

            try
            {
                deleteOK = _dao.Delete(Id);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "DepartmentViewModel", "Delete");
            }
            return deleteOK;
        }
    }
}
