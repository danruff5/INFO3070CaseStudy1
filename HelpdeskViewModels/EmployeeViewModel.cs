using HelpdeskDAL;
using MongoDB.Bson;
using System;
using System.Collections.Generic;

namespace HelpdeskViewModels
{
    // An employee view model for client side inteaction
    public class EmployeeViewModel : ViewModelUtils
    {
        private EmployeeDAO _dao;
        public string Id { get; set; }
        public string Title { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phoneno { get; set; }
        public string Entity64 { get; set; }
        public string DepartmentId { get; set; }
        public string StaffPicture64 { get; set; }
        public bool IsTech { get; set; }

        public EmployeeViewModel()
        { 
            _dao = new EmployeeDAO();
        }

        // Get and populate this based on the given id
        public void GetById(string id)
        {
            try
            {
                Employee emp = _dao.GetByID(id);
                Id = emp._id.ToString();
                Title = emp.Title;
                Firstname = emp.Firstname;
                Lastname = emp.Lastname;
                Phoneno = emp.Phoneno;
                Email = emp.Email;
                DepartmentId = emp.DepartmentId.ToString();
                StaffPicture64 = emp.StaffPicture64;
                IsTech = emp.IsTech;
                Entity64 = Convert.ToBase64String(Serializer(emp));
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "GetById");
            }
        }

        // Update this employee
        public int Update()
        {
            int rowUp = -1;

            try
            {
                byte[] bytEmp = Convert.FromBase64String(Entity64);
                Employee emp = (Employee)Deserializer(bytEmp);
                emp.Title = Title;
                emp.Firstname = Firstname;
                emp.Lastname = Lastname;
                emp.Phoneno = Phoneno;
                emp.Email = Email;
                emp.DepartmentId = new ObjectId(DepartmentId);
                emp.StaffPicture64 = StaffPicture64;
                emp.IsTech = IsTech;
                rowUp = _dao.Update(emp);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "Update");
            }
            return rowUp;
        }

        // Create this employee
        public void Create()
        {
            try
            {
                Employee emp = new Employee();
                emp.DepartmentId = new ObjectId(DepartmentId);
                emp.Title = Title;
                emp.Firstname = Firstname;
                emp.Lastname = Lastname;
                emp.Phoneno = Phoneno;
                emp.Email = Email;
                emp.StaffPicture64 = StaffPicture64;
                emp.IsTech = IsTech;
                Id = _dao.Create(emp);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "Create");
            }
        }

        // Get all employees (only the required fields, not all)
        public List<EmployeeViewModel> GetAll()
        {
            List<EmployeeViewModel> viewModels = new List<EmployeeViewModel>();

            try
            {
                List<Employee> employees = _dao.GetAll();

                foreach (Employee e in employees)
                {
                    // Return only fields for display, subdequent get will other fields
                    EmployeeViewModel viewModel = new EmployeeViewModel();
                    viewModel.Id = e._id.ToString();
                    viewModel.Title = e.Title;
                    viewModel.Firstname = e.Firstname;
                    viewModel.Lastname = e.Lastname;
                    viewModel.StaffPicture64 = e.StaffPicture64;
                    viewModels.Add(viewModel); // Add to list
                }
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "GetAll");
            }
            return viewModels;
        }

        // Get all of the tech (only the required fields, not all)
        public List<EmployeeViewModel> GetAllTech()
        {
            List<EmployeeViewModel> viewModels = new List<EmployeeViewModel>();

            try
            {
                List<Employee> employees = _dao.GetAllTech();

                foreach (Employee e in employees)
                {
                    // Return only fields for display, subdequent get will other fields
                    EmployeeViewModel viewModel = new EmployeeViewModel();
                    viewModel.Id = e._id.ToString();
                    viewModel.Title = e.Title;
                    viewModel.Firstname = e.Firstname;
                    viewModel.Lastname = e.Lastname;
                    viewModels.Add(viewModel); // Add to list
                }
            }
            catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "GetAll");
            }
            return viewModels;
        }

        // Delete this employee
        public bool Delete()
        {
            bool deleteOK = false;

            try
            {
                deleteOK = _dao.Delete(Id);
            } catch (Exception ex)
            {
                ErrorRoutine(ex, "EmployeeViewModel", "Delete");
            }
            return deleteOK;
        }
    }
}
