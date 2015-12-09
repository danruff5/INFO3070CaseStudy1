using MongoDB.Bson;
using MongoDB.Kennedy;

namespace HelpdeskDAL
{
    // An employee object for storing information about each employee.
    // Department is an Id from the Department collection. Staff Picture
    // is a base 64 encoded picture.
    [System.Serializable]
    public class Employee : IMongoEntity
    {
        public ObjectId _id { get; set; }
        public string _accessId { get; set; }
        public ObjectId DepartmentId { get; set; }
        public string Title { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public string Phoneno { get; set; }
        public string Entity64 { get; set; }
        public string StaffPicture64 { get; set; }
        public bool IsTech { get; set; }

        public Employee(string name)
        {
            Firstname = name;
        }

        public Employee()
        {
            Firstname = "not found";
        }
    }
}