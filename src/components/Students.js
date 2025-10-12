import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [formData, setFormData] = useState({
    register_no: '',
    first_name: '',
    last_name: '',
    class: '',
    section: '',
    roll: '',
    gender: 'male',
    birthday: '',
    admission_date: '',
    email: '',
    phone: '',
    address: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_email: '',
    guardian_relationship: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll();
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = students;
    
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.register_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (classFilter) {
      filtered = filtered.filter(student => student.class === classFilter);
    }
    
    setFilteredStudents(filtered);
  }, [students, searchTerm, classFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentAPI.update(editingStudent.id, formData);
      } else {
        await studentAPI.create(formData);
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error('Error saving student:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      register_no: '',
      first_name: '',
      last_name: '',
      class: '',
      section: '',
      roll: '',
      gender: 'male',
      birthday: '',
      admission_date: '',
      email: '',
      phone: '',
      address: '',
      guardian_name: '',
      guardian_phone: '',
      guardian_email: '',
      guardian_relationship: ''
    });
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleView = async (student) => {
    setViewingStudent(student);
    try {
      const response = await studentAPI.getById(student.id);
      setStudentDetails(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleCollectFees = (student) => {
    // Store student data for fee collection and navigate
    localStorage.setItem('selectedStudent', JSON.stringify(student));
    window.location.hash = '#/fee-payments';
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="skeleton" style={{height: '20px', marginBottom: '15px', width: '30%'}}></div>
                <div className="skeleton" style={{height: '40px', marginBottom: '10px'}}></div>
                <div className="skeleton" style={{height: '40px', marginBottom: '10px'}}></div>
                <div className="skeleton" style={{height: '40px', width: '80%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="row">
            <div className="col-12 col-xl-8 mb-4 mb-xl-0">
              <h3 className="font-weight-bold">Students Management</h3>
              <h6 className="font-weight-normal mb-0">Manage student records and information</h6>
            </div>
            <div className="col-12 col-xl-4">
              <div className="justify-content-end d-flex">
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(!showForm)}
                >
                  {showForm ? 'Cancel' : 'Add Student'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or register number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <select
                      className="form-control"
                      value={classFilter}
                      onChange={(e) => setClassFilter(e.target.value)}
                    >
                      <option value="">All Classes</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                      <option value="S4">S4</option>
                      <option value="S5">S5</option>
                      <option value="S6">S6</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <span className="text-muted">Total: {filteredStudents.length} students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="row">
          <div className="col-md-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Register No</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.register_no}
                          onChange={(e) => setFormData({...formData, register_no: e.target.value})}
                          placeholder="e.g., 2024001"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Class</label>
                        <select
                          className="form-control"
                          value={formData.class}
                          onChange={(e) => setFormData({...formData, class: e.target.value})}
                          required
                        >
                          <option value="">Select Class</option>
                          <option value="S1">S1</option>
                          <option value="S2">S2</option>
                          <option value="S3">S3</option>
                          <option value="S4">S4</option>
                          <option value="S5">S5</option>
                          <option value="S6">S6</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.first_name}
                          onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                          placeholder="e.g., John"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.last_name}
                          onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                          placeholder="e.g., Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Section</label>
                        <select
                          className="form-control"
                          value={formData.section}
                          onChange={(e) => setFormData({...formData, section: e.target.value})}
                        >
                          <option value="">Select Section</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Gender</label>
                        <select
                          className="form-control"
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Birthday</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.birthday}
                          onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Admission Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.admission_date}
                          onChange={(e) => setFormData({...formData, admission_date: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Guardian Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.guardian_name}
                          onChange={(e) => setFormData({...formData, guardian_name: e.target.value})}
                          placeholder="e.g., Jane Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Guardian Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.guardian_phone}
                          onChange={(e) => setFormData({...formData, guardian_phone: e.target.value})}
                          placeholder="e.g., +256700123456"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Guardian Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.guardian_email}
                          onChange={(e) => setFormData({...formData, guardian_email: e.target.value})}
                          placeholder="e.g., jane.doe@email.com"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Relationship</label>
                        <select
                          className="form-control"
                          value={formData.guardian_relationship}
                          onChange={(e) => setFormData({...formData, guardian_relationship: e.target.value})}
                        >
                          <option value="">Select Relationship</option>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Guardian</option>
                          <option value="uncle">Uncle</option>
                          <option value="aunt">Aunt</option>
                          <option value="grandparent">Grandparent</option>
                          <option value="sibling">Sibling</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Address</label>
                        <textarea
                          className="form-control"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows="3"
                          placeholder="Enter guardian's address"
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary mr-2">
                    {editingStudent ? 'Update' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-light" onClick={resetForm}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingStudent && (
        <div className="modal" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050, overflow: 'auto'}}>
          <div className="modal-dialog modal-xl" style={{margin: '30px auto', maxWidth: '90%'}}>
            <div className="modal-content" style={{maxHeight: '90vh', overflow: 'auto'}}>
              <div className="modal-header">
                <h4 className="modal-title">Student Details - {viewingStudent.first_name} {viewingStudent.last_name}</h4>
                <button type="button" className="close" onClick={() => {setViewingStudent(null); setStudentDetails(null);}}>&times;</button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h5>Personal Information</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr><td><strong>Register No:</strong></td><td>{viewingStudent.register_no}</td></tr>
                        <tr><td><strong>Full Name:</strong></td><td>{viewingStudent.first_name} {viewingStudent.last_name}</td></tr>
                        <tr><td><strong>Class:</strong></td><td>{viewingStudent.class}</td></tr>
                        <tr><td><strong>Gender:</strong></td><td>{viewingStudent.gender}</td></tr>
                        <tr><td><strong>Admission Date:</strong></td><td>{viewingStudent.admission_date}</td></tr>
                        <tr><td><strong>Status:</strong></td><td><span className={`badge badge-${viewingStudent.active ? 'success' : 'danger'}`}>{viewingStudent.active ? 'Active' : 'Inactive'}</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h5>Guardian Information</h5>
                    <table className="table table-borderless">
                      <tbody>
                        <tr><td><strong>Guardian Name:</strong></td><td>{viewingStudent.guardian_name}</td></tr>
                        <tr><td><strong>Relationship:</strong></td><td>{viewingStudent.guardian_relationship || 'N/A'}</td></tr>
                        <tr><td><strong>Phone:</strong></td><td>{viewingStudent.guardian_phone}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>{viewingStudent.guardian_email || 'N/A'}</td></tr>
                        <tr><td><strong>Address:</strong></td><td>{viewingStudent.address || 'N/A'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {studentDetails && (
                  <>
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <h5>Fee Allocations</h5>
                        <div className="table-responsive">
                          <table className="table table-striped table-borderless">
                            <thead>
                              <tr>
                                <th>Fee Type</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentDetails.fee_allocations?.length > 0 ? (
                                studentDetails.fee_allocations.map((allocation) => (
                                  <tr key={allocation.id}>
                                    <td>{allocation.fee_group?.fee_type?.name || 'N/A'}</td>
                                    <td>UGX {allocation.amount?.toLocaleString()}</td>
                                    <td>{new Date(allocation.due_date).toLocaleDateString()}</td>
                                    <td><span className={`badge badge-${allocation.status === 'paid' ? 'success' : allocation.status === 'partial' ? 'info' : 'warning'}`}>{allocation.status}</span></td>
                                  </tr>
                                ))
                              ) : (
                                <tr><td colSpan="4" className="text-center">No fee allocations found</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mt-3">
                      <div className="col-md-12">
                        <h5>Payment History</h5>
                        <div className="table-responsive">
                          <table className="table table-striped table-borderless">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Payment Method</th>
                                <th>Reference</th>
                              </tr>
                            </thead>
                            <tbody>
                              {studentDetails.fee_payments?.length > 0 ? (
                                studentDetails.fee_payments.map((payment) => (
                                  <tr key={payment.id}>
                                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                                    <td>UGX {payment.amount?.toLocaleString()}</td>
                                    <td>{payment.payment_method}</td>
                                    <td>{payment.reference || 'N/A'}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr><td colSpan="4" className="text-center">No payments found</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-title mb-0">Students List</p>
              <div className="table-responsive">
                <table className="table table-striped table-borderless">
                  <thead>
                    <tr>
                      <th>Register No</th>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Gender</th>
                      <th>Guardian</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>{student.register_no}</td>
                        <td>{student.first_name} {student.last_name}</td>
                        <td>{student.class}</td>
                        <td>{student.gender}</td>
                        <td>{student.guardian_name}</td>
                        <td>
                          <span className={`badge badge-${student.active ? 'success' : 'secondary'}`}>
                            {student.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info mr-1"
                            onClick={() => handleView(student)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline-primary mr-1"
                            onClick={() => handleEdit(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-success mr-1"
                            onClick={() => handleCollectFees(student)}
                          >
                            Collect Fees
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;