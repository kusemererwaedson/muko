import React, { useState, useEffect } from 'react';
import { getStudents } from '../services/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="content-wrapper"><div>Loading...</div></div>;

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex align-items-end flex-wrap">
              <div className="mr-md-3 mr-xl-5">
                <h2>Students</h2>
                <p className="mb-md-0">Manage student records</p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-end flex-wrap">
              <button className="btn btn-primary mt-2 mt-xl-0">Add New Student</button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Register No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Guardian</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? students.map(student => (
                      <tr key={student.id}>
                        <td className="font-weight-bold">{student.register_no}</td>
                        <td>{student.full_name}</td>
                        <td>{student.class} {student.section}</td>
                        <td>{student.guardian_name}</td>
                        <td>{student.guardian_phone}</td>
                        <td>
                          <label className={`badge badge-${student.active ? 'success' : 'danger'}`}>
                            {student.active ? 'Active' : 'Inactive'}
                          </label>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-info mr-2">View</button>
                          <button className="btn btn-sm btn-success">Collect Fees</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center">No students found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;